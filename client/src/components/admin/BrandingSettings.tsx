import { useState, useRef } from "react";
import { useBranding } from "@/contexts/BrandingContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Upload, RefreshCw, Check } from "lucide-react";

export default function BrandingSettings() {
  const { branding, updateBranding, resetBranding } = useBranding();
  const [primaryColor, setPrimaryColor] = useState(branding.primaryColor);
  const [companyName, setCompanyName] = useState(branding.companyName);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryColor(e.target.value);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("이미지 크기는 2MB 이하여야 합니다.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      updateBranding({ logoUrl: base64String });
      toast.success("로고가 업데이트되었습니다.");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateBranding({
      primaryColor,
      companyName,
    });
    toast.success("브랜딩 설정이 저장되었습니다.");
  };

  const handleReset = () => {
    resetBranding();
    setPrimaryColor("#007AFF");
    setCompanyName("ATTENDANCE ENTERPRISE SYSTEM");
    toast.info("기본 설정으로 초기화되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">브랜딩 설정</h2>
        <p className="text-muted-foreground">
          회사 로고와 브랜드 색상을 설정하여 시스템을 커스터마이징하세요.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>브랜드 아이덴티티</CardTitle>
            <CardDescription>
              시스템 전반에 적용될 회사 정보를 입력하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">회사명 (시스템 타이틀)</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="회사명을 입력하세요"
              />
            </div>

            <div className="space-y-2">
              <Label>회사 로고</Label>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 border rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
                  {branding.logoUrl ? (
                    <img
                      src={branding.logoUrl}
                      alt="Company Logo"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground text-center px-2">
                      로고 없음
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    이미지 업로드
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    권장 크기: 200x200px (PNG, JPG)
                    <br />
                    최대 2MB
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>테마 색상</CardTitle>
            <CardDescription>
              브랜드의 대표 색상을 선택하세요. 버튼과 강조 텍스트에 적용됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">대표 색상 (Primary Color)</Label>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={primaryColor}
                    onChange={handleColorChange}
                    className="w-12 h-12 p-1 cursor-pointer rounded-full overflow-hidden"
                  />
                </div>
                <Input
                  value={primaryColor}
                  onChange={handleColorChange}
                  className="font-mono uppercase"
                  maxLength={7}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>미리보기</Label>
              <div className="p-4 border rounded-lg space-y-4">
                <div className="flex gap-2">
                  <Button style={{ backgroundColor: primaryColor }}>Primary Button</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                  <span style={{ color: primaryColor }} className="font-bold">
                    강조된 텍스트 예시입니다.
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleReset}>
          <RefreshCw className="w-4 h-4 mr-2" />
          초기화
        </Button>
        <Button onClick={handleSave}>
          <Check className="w-4 h-4 mr-2" />
          설정 저장
        </Button>
      </div>
    </div>
  );
}
