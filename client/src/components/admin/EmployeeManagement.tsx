import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function EmployeeManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>직원 관리</CardTitle>
        <CardDescription>직원 목록 조회 및 관리 기능을 제공합니다.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
        <p className="text-muted-foreground">현재 직원 관리 모듈을 준비 중입니다.</p>
        <Button onClick={() => toast.info("직원 등록 기능은 곧 제공될 예정입니다.")}>
          신규 직원 등록
        </Button>
      </CardContent>
    </Card>
  );
}
