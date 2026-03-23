import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Filter, Eye, ShieldAlert, ArrowRight } from "lucide-react";
import { AuditLog, AuditAction } from '@/types/audit';
import { getAuditLogs } from '@/lib/audit-service';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, actionFilter]);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await getAuditLogs();
      setLogs(data);
    } catch (error) {
      console.error("Failed to load audit logs", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLogs = () => {
    let result = [...logs];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(log => 
        log.actorName.toLowerCase().includes(lowerTerm) || 
        log.details.toLowerCase().includes(lowerTerm) ||
        log.targetType.toLowerCase().includes(lowerTerm)
      );
    }

    if (actionFilter !== 'ALL') {
      result = result.filter(log => log.action === actionFilter);
    }

    setFilteredLogs(result);
  };

  const getActionBadgeColor = (action: AuditAction) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'UPDATE': return 'bg-orange-100/30 text-orange-800 hover:bg-stone-200';
      case 'DELETE': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'APPROVE': return 'bg-orange-100/30 text-orange-800 hover:bg-orange-200';
      case 'REJECT': return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'ACCESS_SENSITIVE_DATA': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      default: return 'bg-stone-100 text-stone-800 hover:bg-stone-200';
    }
  };

  return (
    <Card className="w-full shadow-sm border-t-4 border-t-stone-600">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-stone-600" />
              보안 감사 로그 (Audit Trail)
            </CardTitle>
            <CardDescription>
              시스템 내 모든 중요 변경 이력과 민감 정보 접근 기록을 모니터링합니다.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadLogs}>
            새로고침
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="작업자, 내용, 대상 검색..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-[200px]">
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="작업 유형" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">모든 작업</SelectItem>
                <SelectItem value="CREATE">생성 (Create)</SelectItem>
                <SelectItem value="UPDATE">수정 (Update)</SelectItem>
                <SelectItem value="DELETE">삭제 (Delete)</SelectItem>
                <SelectItem value="APPROVE">승인 (Approve)</SelectItem>
                <SelectItem value="REJECT">반려 (Reject)</SelectItem>
                <SelectItem value="ACCESS_SENSITIVE_DATA">정보 조회 (Access)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[180px]">일시</TableHead>
                <TableHead className="w-[120px]">작업자</TableHead>
                <TableHead className="w-[120px]">유형</TableHead>
                <TableHead className="w-[120px]">대상</TableHead>
                <TableHead>상세 내용</TableHead>
                <TableHead className="w-[80px] text-right">변경사항</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    로그를 불러오는 중입니다...
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/5">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{log.actorName}</span>
                        <span className="text-xs text-muted-foreground">{log.actorRole}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`${getActionBadgeColor(log.action)} border-0`}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-stone-700">{log.targetType}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm">{log.details}</span>
                        {log.ipAddress && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            IP: {log.ipAddress}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {log.changes && log.changes.length > 0 && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4 text-stone-500" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>변경 상세 내역</DialogTitle>
                              <DialogDescription>
                                {log.timestamp}에 {log.actorName}님이 수행한 변경사항입니다.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4 space-y-4">
                              {log.changes.map((change, idx) => (
                                <div key={idx} className="bg-muted/30 p-3 rounded-md border">
                                  <div className="text-sm font-semibold mb-2 text-stone-700">
                                    필드: {change.field}
                                  </div>
                                  <div className="flex items-center gap-3 text-sm">
                                    <div className="flex-1 bg-red-50 p-2 rounded text-red-700 border border-red-100">
                                      <span className="text-xs text-red-400 block mb-1">변경 전</span>
                                      {String(change.oldValue)}
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-stone-400" />
                                    <div className="flex-1 bg-green-50 p-2 rounded text-green-700 border border-green-100">
                                      <span className="text-xs text-green-400 block mb-1">변경 후</span>
                                      {String(change.newValue)}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
