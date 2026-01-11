import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, UserCheck } from "lucide-react";
import { MaskedData } from "@/components/ui/MaskedData";
import { toast } from "sonner";

// 모의 가입 신청 데이터
const initialRequests = [
  { id: 1, name: "이신입", department: "영업팀", position: "사원", email: "newbie@company.com", phone: "010-9999-8888", requestedAt: "2026-01-27 09:30", status: "pending" },
  { id: 2, name: "박경력", department: "개발팀", position: "과장", email: "dev.park@company.com", phone: "010-7777-6666", requestedAt: "2026-01-27 10:15", status: "pending" },
];

export default function SignupApproval() {
  const [requests, setRequests] = useState(initialRequests);

  const handleApprove = (id: number, name: string) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: "approved" } : req));
    toast.success(`${name}님의 가입이 승인되었습니다. 사번이 활성화됩니다.`);
  };

  const handleReject = (id: number, name: string) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: "rejected" } : req));
    toast.error(`${name}님의 가입 요청이 반려되었습니다.`);
  };

  const pendingCount = requests.filter(r => r.status === "pending").length;

  return (
    <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              신규 입사자 가입 승인
              {pendingCount > 0 && (
                <Badge variant="destructive" className="rounded-full px-2">{pendingCount}</Badge>
              )}
            </CardTitle>
            <CardDescription>직원용 회원가입 신청 내역을 검토하고 승인합니다.</CardDescription>
          </div>
          <UserCheck className="w-8 h-8 text-slate-200" />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800">
              <TableHead>이름</TableHead>
              <TableHead>부서/직급</TableHead>
              <TableHead>연락처</TableHead>
              <TableHead>신청일시</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  대기 중인 가입 신청이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">
                    <div>{req.name}</div>
                    <div className="text-xs text-muted-foreground">{req.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{req.department}</Badge> {req.position}
                  </TableCell>
                  <TableCell>
                    <MaskedData 
                      value={req.phone} 
                      type="phone" 
                      label="연락처" 
                      employeeName={req.name} 
                    />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{req.requestedAt}</TableCell>
                  <TableCell>
                    {req.status === "pending" && <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">승인 대기</Badge>}
                    {req.status === "approved" && <Badge className="bg-green-100 text-green-800 hover:bg-green-100">승인됨</Badge>}
                    {req.status === "rejected" && <Badge variant="destructive">반려됨</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    {req.status === "pending" && (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleReject(req.id, req.name)}>
                          <XCircle className="w-4 h-4 mr-1" /> 반려
                        </Button>
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => handleApprove(req.id, req.name)}>
                          <CheckCircle2 className="w-4 h-4 mr-1" /> 승인
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
