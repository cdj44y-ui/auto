import { format } from 'date-fns';

interface CalendarEvent {
  title: string;
  description: string;
  location?: string;
  startDate: Date; // YYYY-MM-DD or Date object
  endDate: Date;   // YYYY-MM-DD or Date object
  isAllDay?: boolean;
}

/**
 * Generates a Google Calendar event link
 */
export const generateGoogleCalendarLink = (event: CalendarEvent): string => {
  const { title, description, location, startDate, endDate, isAllDay = true } = event;
  
  // Format dates for Google Calendar (YYYYMMDD or YYYYMMDDTHHMMSSZ)
  const formatDate = (date: Date, allDay: boolean) => {
    if (allDay) {
      // For all-day events, end date is exclusive in Google Calendar, so add 1 day if needed
      // But for simplicity in this utility, we assume input endDate is inclusive and let Google handle it or adjust logic
      // Google Calendar API expects YYYYMMDD for all day
      return format(date, 'yyyyMMdd');
    }
    return format(date, "yyyyMMdd'T'HHmmss");
  };

  const start = formatDate(startDate, isAllDay);
  const end = formatDate(endDate, isAllDay);
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    details: description,
    dates: `${start}/${end}`,
  });

  if (location) params.append('location', location);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Generates an Outlook Calendar event link (Web)
 */
export const generateOutlookCalendarLink = (event: CalendarEvent): string => {
  const { title, description, location, startDate, endDate, isAllDay = true } = event;

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    startdt: startDate.toISOString(),
    enddt: endDate.toISOString(),
    subject: title,
    body: description,
    allday: isAllDay ? 'true' : 'false',
  });

  if (location) params.append('location', location);

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
};

/**
 * Generates an iCal (.ics) file content
 */
export const generateICalContent = (event: CalendarEvent): string => {
  const { title, description, location, startDate, endDate, isAllDay = true } = event;
  
  const formatDate = (date: Date) => format(date, 'yyyyMMdd');
  const now = format(new Date(), "yyyyMMdd'T'HHmmss'Z'");

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Attendance System//KR
BEGIN:VEVENT
UID:${Date.now()}@attendance-system.com
DTSTAMP:${now}
DTSTART;VALUE=DATE:${formatDate(startDate)}
DTEND;VALUE=DATE:${formatDate(endDate)}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location || ''}
END:VEVENT
END:VCALENDAR`;
};

/**
 * Downloads an iCal (.ics) file
 */
export const downloadICalFile = (event: CalendarEvent) => {
  const content = generateICalContent(event);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.title}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
