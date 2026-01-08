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
  const [welcomeMessage, setWelcomeMessage] = useState(branding.welcomeMessage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

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

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("이미지 크기는 5MB 이하여야 합니다.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      updateBranding({ loginBackgroundUrl: base64String });
      toast.success("배경 이미지가 업데이트되었습니다.");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateBranding({
      primaryColor,
      companyName,
      welcomeMessage,
    });
    toast.success("브랜딩 설정이 저장되었습니다.");
  };

  const handleReset = () => {
    resetBranding();
    setPrimaryColor("#007AFF");
    setCompanyName("ATTENDANCE ENTERPRISE SYSTEM");
    setWelcomeMessage("근태관리 시스템 접속");
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

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>로그인 페이지 설정</CardTitle>
            <CardDescription>
              로그인 화면의 배경 이미지와 환영 메시지를 설정합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">환영 메시지</Label>
                  <Input
                    id="welcomeMessage"
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    placeholder="예: 근태관리 시스템 접속"
                  />
                </div>
                <div className="space-y-2">
                  <Label>배경 이미지</Label>
                  <div className="flex flex-col gap-4">
                    <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center group">
                      {branding.loginBackgroundUrl ? (
                        <img
                          src={branding.loginBackgroundUrl}
                          alt="Login Background"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">기본 배경 사용 중</span>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => bgInputRef.current?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          이미지 변경
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">
                        권장 크기: 1920x1080px (최대 5MB)
                      </p>
                      {branding.loginBackgroundUrl && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => updateBranding({ loginBackgroundUrl: null })}
                        >
                          기본값으로 복원
                        </Button>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={bgInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleBgUpload}
                    />
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-slate-50">
                <Label className="mb-2 block">미리보기</Label>
                <div className="relative w-full aspect-video rounded-md overflow-hidden border shadow-sm">
                  {branding.loginBackgroundUrl ? (
                    <img 
                      src={branding.loginBackgroundUrl} 
                      className="absolute inset-0 w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="bg-white/90 backdrop-blur shadow-lg rounded-lg p-6 w-full max-w-xs text-center space-y-4">
                      <div className="w-12 h-12 bg-primary rounded-lg mx-auto flex items-center justify-center text-white font-bold">
                        {branding.logoUrl ? (
                          <img src={branding.logoUrl} className="w-8 h-8 object-contain" />
                        ) : (
                          branding.companyName.charAt(0)
                        )}
                      </div>
                      <h3 className="font-bold text-lg">{welcomeMessage}</h3>
                      <div className="h-8 bg-slate-100 rounded w-full" />
                      <div className="h-8 bg-primary rounded w-full" />
                    </div>
                  </div>
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
