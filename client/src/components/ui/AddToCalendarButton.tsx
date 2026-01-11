import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarPlus, Download } from "lucide-react";
import { 
  generateGoogleCalendarLink, 
  generateOutlookCalendarLink, 
  downloadICalFile 
} from '@/lib/calendar-utils';

interface AddToCalendarButtonProps {
  event: {
    title: string;
    description: string;
    startDate: Date | string;
    endDate: Date | string;
    location?: string;
  };
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function AddToCalendarButton({ event, variant = "outline", size = "sm", className }: AddToCalendarButtonProps) {
  const eventData = {
    ...event,
    startDate: typeof event.startDate === 'string' ? new Date(event.startDate) : event.startDate,
    endDate: typeof event.endDate === 'string' ? new Date(event.endDate) : event.endDate,
  };

  const handleGoogleClick = () => {
    window.open(generateGoogleCalendarLink(eventData), '_blank');
  };

  const handleOutlookClick = () => {
    window.open(generateOutlookCalendarLink(eventData), '_blank');
  };

  const handleICalClick = () => {
    downloadICalFile(eventData);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <CalendarPlus className="h-4 w-4 mr-2" />
          캘린더에 추가
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleGoogleClick} className="cursor-pointer">
          Google Calendar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleOutlookClick} className="cursor-pointer">
          Outlook Calendar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleICalClick} className="cursor-pointer">
          <Download className="h-3 w-3 mr-2" />
          iCal 파일 다운로드 (.ics)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
