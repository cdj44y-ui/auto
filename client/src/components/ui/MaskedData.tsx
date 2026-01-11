import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { addAuditLog } from '@/lib/audit-service';

interface MaskedDataProps {
  value: string;
  type: 'rrn' | 'phone' | 'salary' | 'account'; // rrn: 주민번호, phone: 전화번호, salary: 급여, account: 계좌
  label?: string; // For audit log details
  employeeName?: string; // For audit log details
}

export function MaskedData({ value, type, label = '민감 정보', employeeName = '사용자' }: MaskedDataProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getMaskedValue = () => {
    if (!value) return '-';
    
    switch (type) {
      case 'rrn':
        // 123456-1234567 -> 123456-1******
        return value.length >= 8 ? `${value.substring(0, 8)}******` : '******-*******';
      case 'phone':
        // 010-1234-5678 -> 010-****-5678
        const parts = value.split('-');
        if (parts.length === 3) {
          return `${parts[0]}-****-${parts[2]}`;
        }
        return value.replace(/\d/g, '*');
      case 'salary':
        // 3,000,000 -> *,***,***
        return '*,***,*** 원';
      case 'account':
        // 123-45-67890 -> 123-**-*****0
        return value.length > 6 ? `${value.substring(0, 4)}****${value.substring(value.length - 2)}` : '****';
      default:
        return '********';
    }
  };

  const handleToggle = async () => {
    if (!isVisible) {
      // When trying to view, log the access
      setIsLoading(true);
      try {
        await addAuditLog({
          actorId: 'current-user', // In real app, get from auth context
          actorName: '현재 사용자', // In real app, get from auth context
          actorRole: 'ADMIN',
          action: 'ACCESS_SENSITIVE_DATA',
          targetType: 'EMPLOYEE',
          details: `${employeeName}의 ${label} 조회`,
        });
        setIsVisible(true);
      } catch (error) {
        console.error("Failed to log access", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsVisible(false);
    }
  };

  return (
    <div className="flex items-center gap-2 group">
      <span className={`font-mono ${isVisible ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
        {isVisible ? (type === 'salary' ? `${Number(value).toLocaleString()} 원` : value) : getMaskedValue()}
      </span>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 opacity-50 group-hover:opacity-100 transition-opacity"
              onClick={handleToggle}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
              ) : isVisible ? (
                <EyeOff className="h-3.5 w-3.5 text-slate-500" />
              ) : (
                <Lock className="h-3.5 w-3.5 text-slate-400" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isVisible ? '정보 숨기기' : '클릭하여 정보 확인 (로그 기록됨)'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
