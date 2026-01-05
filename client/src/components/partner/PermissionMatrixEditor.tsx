import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PermissionMatrix } from "@/types/saas";

interface PermissionMatrixEditorProps {
  initialPermissions?: PermissionMatrix;
  onChange?: (permissions: PermissionMatrix) => void;
  readOnly?: boolean;
}

const DEFAULT_PERMISSIONS: PermissionMatrix = {
  client_management: { view: true, create: false, edit: false, delete: false },
  attendance_data: { view: true, export: false, modify: false },
  system_settings: { access: false },
  report_generation: { access: true, approve: false }
};

const PERMISSION_LABELS: Record<string, string> = {
  client_management: "고객사 관리",
  attendance_data: "근태 데이터",
  system_settings: "시스템 설정",
  report_generation: "리포트 생성"
};

const ACTION_LABELS: Record<string, string> = {
  view: "조회",
  create: "생성",
  edit: "수정",
  delete: "삭제",
  export: "내보내기",
  modify: "데이터 보정",
  access: "접근 허용",
  approve: "승인 권한"
};

export default function PermissionMatrixEditor({ 
  initialPermissions = DEFAULT_PERMISSIONS, 
  onChange,
  readOnly = false 
}: PermissionMatrixEditorProps) {
  const [permissions, setPermissions] = useState<PermissionMatrix>(initialPermissions);

  const handleToggle = (category: string, action: string) => {
    if (readOnly) return;

    const updated = {
      ...permissions,
      [category]: {
        ...permissions[category],
        [action]: !permissions[category][action]
      }
    };
    setPermissions(updated);
    onChange?.(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">권한 매트릭스 설정 (Permission Matrix)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">기능 모듈</TableHead>
              <TableHead>세부 권한 설정</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(permissions).map((category) => (
              <TableRow key={category}>
                <TableCell className="font-medium">
                  {PERMISSION_LABELS[category] || category}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-6">
                    {Object.keys(permissions[category]).map((action) => (
                      <div key={`${category}-${action}`} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`${category}-${action}`} 
                          checked={permissions[category][action]}
                          onCheckedChange={() => handleToggle(category, action)}
                          disabled={readOnly}
                        />
                        <Label 
                          htmlFor={`${category}-${action}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {ACTION_LABELS[action] || action}
                        </Label>
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
