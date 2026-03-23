import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wifi, Globe, Plus, Trash2, Monitor } from "lucide-react";
import { toast } from "sonner";

interface AllowedIp {
  id: string;
  name: string;
  ipAddress: string;
  type: "wifi" | "fixed_ip";
  description: string;
  isActive: boolean;
}

const MOCK_IPS: AllowedIp[] = [
  { id: "1", name: "본사 사무실 WiFi", ipAddress: "211.45.12.10", type: "wifi", description: "3층 사무실 메인망", isActive: true },
  { id: "2", name: "공장 보안망", ipAddress: "112.10.55.20", type: "fixed_ip", description: "생산라인 유선망", isActive: true },
];

export default function IpAccessManager() {
  const [ips, setIps] = useState<AllowedIp[]>(MOCK_IPS);
  const [newIpName, setNewIpName] = useState("");
  const [newIpAddress, setNewIpAddress] = useState("");
  const [currentIp, setCurrentIp] = useState("211.45.12.10"); // Mock current IP

  const handleAddIp = () => {
    if (!newIpName || !newIpAddress) {
      toast.error("이름과 IP 주소를 모두 입력해주세요.");
      return;
    }
    
    const newIp: AllowedIp = {
      id: Date.now().toString(),
      name: newIpName,
      ipAddress: newIpAddress,
      type: "fixed_ip",
      description: "관리자 추가",
      isActive: true
    };
    
    setIps([...ips, newIp]);
    setNewIpName("");
    setNewIpAddress("");
    toast.success("허용 IP가 추가되었습니다.");
  };

  const handleDeleteIp = (id: string) => {
    setIps(ips.filter(ip => ip.id !== id));
    toast.success("삭제되었습니다.");
  };

  const toggleIpStatus = (id: string) => {
    setIps(ips.map(ip => ip.id === id ? { ...ip, isActive: !ip.isActive } : ip));
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            IP/WiFi 기반 출퇴근 인증
          </CardTitle>
          <CardDescription>
            GPS 수신이 어려운 실내나 보안 구역을 위해 회사 네트워크(IP) 접속 시 출근을 인정합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg border">
            <div className="flex items-center gap-3">
              <Monitor className="h-5 w-5 text-stone-500" />
              <div>
                <p className="text-sm font-medium">현재 접속 IP</p>
                <p className="text-lg font-bold text-primary">{currentIp}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setNewIpAddress(currentIp)}>
              현재 IP 추가하기
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3 items-end">
            <div className="space-y-2">
              <Label>네트워크 이름</Label>
              <Input 
                placeholder="예: 3층 회의실 WiFi" 
                value={newIpName}
                onChange={(e) => setNewIpName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>IP 주소 (CIDR 지원)</Label>
              <Input 
                placeholder="예: 192.168.0.1" 
                value={newIpAddress}
                onChange={(e) => setNewIpAddress(e.target.value)}
              />
            </div>
            <Button onClick={handleAddIp} className="w-full">
              <Plus className="h-4 w-4 mr-2" /> 추가하기
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>유형</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>IP 주소</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ips.map((ip) => (
                  <TableRow key={ip.id}>
                    <TableCell>
                      {ip.type === 'wifi' ? (
                        <Badge variant="secondary" className="gap-1"><Wifi className="h-3 w-3" /> WiFi</Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1"><Globe className="h-3 w-3" /> IP</Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{ip.name}</TableCell>
                    <TableCell className="font-mono text-xs">{ip.ipAddress}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{ip.description}</TableCell>
                    <TableCell>
                      <Switch 
                        checked={ip.isActive} 
                        onCheckedChange={() => toggleIpStatus(ip.id)} 
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteIp(ip.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
