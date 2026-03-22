import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardList, Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

type Consultation = {
  id: number;
  clientId: number;
  consultantId: number;
  title: string;
  description: string | null;
  consultationType: "labor_law" | "payroll" | "hr_policy" | "compliance" | "contract" | "dispute" | "general" | "other";
  consultationDate: Date;
  startTime: string | null;
  endTime: string | null;
  duration: number | null;
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "rescheduled";
  outcome: string | null;
  recommendations: string | null;
  followUpRequired: "yes" | "no" | null;
  followUpDate: Date | null;
};

type FormData = {
  clientId: number;
  consultantId: number;
  title: string;
  description: string;
  consultationType: "labor_law" | "payroll" | "hr_policy" | "compliance" | "contract" | "dispute" | "general" | "other";
  consultationDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "rescheduled";
  outcome: string;
  recommendations: string;
  followUpRequired: "yes" | "no";
  followUpDate: string;
};

const initialFormData: FormData = {
  clientId: 0, consultantId: 0, title: "", description: "", consultationType: "general",
  consultationDate: "", startTime: "", endTime: "", duration: 0, status: "scheduled",
  outcome: "", recommendations: "", followUpRequired: "no", followUpDate: "",
};

const typeLabels: Record<string, string> = {
  labor_law: "노동법", payroll: "급여", hr_policy: "인사정책", compliance: "컴플라이언스",
  contract: "계약", dispute: "분쟁", general: "일반", other: "기타"
};
const statusLabels: Record<string, string> = {
  scheduled: "예정", in_progress: "진행중", completed: "완료", cancelled: "취소", rescheduled: "재조정"
};
const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800", in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800", cancelled: "bg-red-100 text-red-800", rescheduled: "bg-purple-100 text-purple-800"
};

export default function ConsultationsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Consultation | null>(null);
  const [deletingItem, setDeletingItem] = useState<Consultation | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const utils = trpc.useUtils();
  const { data: consultations = [], isLoading } = trpc.consultationMgmt.list.useQuery();
  const { data: clients = [] } = trpc.clientMgmt.list.useQuery();

  const createMutation = trpc.consultationMgmt.create.useMutation({
    onSuccess: () => { utils.consultationMgmt.list.invalidate(); setIsDialogOpen(false); setFormData(initialFormData); toast.success("자문 이력이 등록되었습니다."); },
    onError: (e) => toast.error(e.message),
  });
  const updateMutation = trpc.consultationMgmt.update.useMutation({
    onSuccess: () => { utils.consultationMgmt.list.invalidate(); setIsDialogOpen(false); setEditingItem(null); setFormData(initialFormData); toast.success("자문 이력이 수정되었습니다."); },
    onError: (e) => toast.error(e.message),
  });
  const deleteMutation = trpc.consultationMgmt.delete.useMutation({
    onSuccess: () => { utils.consultationMgmt.list.invalidate(); setIsDeleteDialogOpen(false); setDeletingItem(null); toast.success("자문 이력이 삭제되었습니다."); },
    onError: (e) => toast.error(e.message),
  });

  const handleOpenCreate = () => { setEditingItem(null); setFormData(initialFormData); setIsDialogOpen(true); };
  const handleOpenEdit = (item: Consultation) => {
    setEditingItem(item);
    setFormData({
      clientId: item.clientId, consultantId: item.consultantId, title: item.title,
      description: item.description || "", consultationType: item.consultationType,
      consultationDate: item.consultationDate ? new Date(item.consultationDate).toISOString().split("T")[0] : "",
      startTime: item.startTime || "", endTime: item.endTime || "", duration: item.duration || 0,
      status: item.status, outcome: item.outcome || "", recommendations: item.recommendations || "",
      followUpRequired: (item.followUpRequired as "yes" | "no") || "no",
      followUpDate: item.followUpDate ? new Date(item.followUpDate).toISOString().split("T")[0] : "",
    });
    setIsDialogOpen(true);
  };
  const handleOpenDelete = (item: Consultation) => { setDeletingItem(item); setIsDeleteDialogOpen(true); };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.clientId || !formData.consultationDate) {
      toast.error("제목, 고객사, 자문일자를 입력해주세요."); return;
    }
    const payload = {
      clientId: formData.clientId, consultantId: formData.consultantId || 1, title: formData.title,
      description: formData.description || undefined, consultationType: formData.consultationType,
      consultationDate: new Date(formData.consultationDate), startTime: formData.startTime || undefined,
      endTime: formData.endTime || undefined, duration: formData.duration || undefined,
      status: formData.status, outcome: formData.outcome || undefined,
      recommendations: formData.recommendations || undefined, followUpRequired: formData.followUpRequired,
      followUpDate: formData.followUpDate ? new Date(formData.followUpDate) : undefined,
    };
    if (editingItem) updateMutation.mutate({ id: editingItem.id, ...payload });
    else createMutation.mutate(payload);
  };

  const filteredData = consultations.filter((c: Consultation) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getClientName = (clientId: number) => clients.find((c: any) => c.id === clientId)?.companyName || "-";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><ClipboardList className="h-6 w-6" />자문 이력 관리</h1>
          <p className="text-muted-foreground">고객사별 자문 이력을 관리합니다.</p>
        </div>
        <Button onClick={handleOpenCreate}><Plus className="h-4 w-4 mr-2" />자문 등록</Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="제목 검색" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="상태" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {Object.entries(statusLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead><TableHead>고객사</TableHead><TableHead>유형</TableHead>
              <TableHead>자문일자</TableHead><TableHead>상태</TableHead><TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">로딩 중...</TableCell></TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">등록된 자문 이력이 없습니다.</TableCell></TableRow>
            ) : (
              filteredData.map((item: Consultation) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{getClientName(item.clientId)}</TableCell>
                  <TableCell><Badge variant="outline">{typeLabels[item.consultationType]}</Badge></TableCell>
                  <TableCell>{new Date(item.consultationDate).toLocaleDateString("ko-KR")}</TableCell>
                  <TableCell><Badge className={statusColors[item.status]}>{statusLabels[item.status]}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(item)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(item)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "자문 이력 수정" : "신규 자문 등록"}</DialogTitle>
            <DialogDescription>{editingItem ? "자문 이력을 수정합니다." : "새로운 자문 이력을 등록합니다."}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>고객사 *</Label>
                <Select value={String(formData.clientId || "")} onValueChange={(v) => setFormData({ ...formData, clientId: Number(v) })}>
                  <SelectTrigger><SelectValue placeholder="고객사 선택" /></SelectTrigger>
                  <SelectContent>{clients.map((c: any) => <SelectItem key={c.id} value={String(c.id)}>{c.companyName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>자문 유형</Label>
                <Select value={formData.consultationType} onValueChange={(v: any) => setFormData({ ...formData, consultationType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(typeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>제목 *</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="자문 제목" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>자문일자 *</Label>
                <Input type="date" value={formData.consultationDate} onChange={(e) => setFormData({ ...formData, consultationDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>시작 시간</Label>
                <Input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>종료 시간</Label>
                <Input type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>상태</Label>
              <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(statusLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>내용</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="자문 내용" rows={3} />
            </div>
            <div className="space-y-2">
              <Label>결과/권고사항</Label>
              <Textarea value={formData.recommendations} onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })} placeholder="자문 결과 및 권고사항" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>취소</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>{editingItem ? "수정" : "등록"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>자문 이력 삭제</DialogTitle>
            <DialogDescription>정말로 "{deletingItem?.title}" 자문 이력을 삭제하시겠습니까?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>취소</Button>
            <Button variant="destructive" onClick={() => deletingItem && deleteMutation.mutate({ id: deletingItem.id })} disabled={deleteMutation.isPending}>삭제</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
