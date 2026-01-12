import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PayrollManager() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>급여 관리</CardTitle>
        <CardDescription>급여 대장 생성 및 명세서 발송 기능을 제공합니다.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
        <p className="text-muted-foreground">현재 급여 관리 모듈을 준비 중입니다.</p>
        <Button onClick={() => toast.info("급여 대장 생성 기능은 곧 제공될 예정입니다.")}>
          급여 대장 생성
        </Button>
      </CardContent>
    </Card>
  );
}
