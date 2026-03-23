import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Plus, Pencil, Trash2, Search, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";

type Client = {
  id: number;
  companyName: string;
  businessNumber: string | null;
  representativeName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  contractStartDate: Date | null;
  contractEndDate: Date | null;
  contractStatus: "active" | "pending" | "expired" | "terminated";
  maxEmployees: number | null;
  isActive: boolean;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type ClientFormData = {
  companyName: string;
  businessNumber: string;
  representativeName: string;
  email: string;
  phone: string;
  address: string;
  contractStartDate: string;
  contractEndDate: string;
  contractStatus: "active" | "pending" | "expired" | "terminated";
  maxEmployees: number;
  notes: string;
};

const initialFormData: ClientFormData = {
  companyName: "",
  businessNumber: "",
  representativeName: "",
  email: "",
  phone: "",
  address: "",
  contractStartDate: "",
  contractEndDate: "",
  contractStatus: "pending",
  maxEmployees: 100,
  notes: "",
};

const statusLabels: Record<string, string> = {
  active: "활성",
  pending: "대기",
  expired: "만료",
  terminated: "해지",
};

export default function ClientsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const utils = trpc.useUtils();
  const { data: clients = [], isLoading } = trpc.clientMgmt.list.useQuery();

  const createMutation = trpc.clientMgmt.create.useMutation({
    onSuccess: () => {
      utils.clientMgmt.list.invalidate();
      setIsDialogOpen(false);
      setFormData(initialFormData);
      toast.success("고객사가 등록되었습니다", { description: formData.companyName });
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = trpc.clientMgmt.update.useMutation({
    onSuccess: () => {
      utils.clientMgmt.list.invalidate();
      setIsDialogOpen(false);
      setEditingClient(null);
      setFormData(initialFormData);
      toast.success("고객사 정보가 수정되었습니다");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = trpc.clientMgmt.delete.useMutation({
    onSuccess: () => {
      utils.clientMgmt.list.invalidate();
      setIsDeleteDialogOpen(false);
      setDeletingClient(null);
      toast.error("삭제되었습니다", { description: "이 작업은 되돌릴 수 없습니다" });
    },
    onError: (error) => toast.error(error.message),
  });

  const handleOpenCreate = () => {
    setEditingClient(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      companyName: client.companyName,
      businessNumber: client.businessNumber || "",
      representativeName: client.representativeName || "",
      email: client.email || "",
      phone: client.phone || "",
      address: client.address || "",
      contractStartDate: client.contractStartDate
        ? new Date(client.contractStartDate).toISOString().split("T")[0]
        : "",
      contractEndDate: client.contractEndDate
        ? new Date(client.contractEndDate).toISOString().split("T")[0]
        : "",
      contractStatus: client.contractStatus,
      maxEmployees: client.maxEmployees || 100,
      notes: client.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.companyName.trim()) {
      toast.error("회사명을 입력해주세요.");
      return;
    }
    const payload = {
      companyName: formData.companyName,
      businessNumber: formData.businessNumber || undefined,
      representativeName: formData.representativeName || undefined,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      address: formData.address || undefined,
      contractStartDate: formData.contractStartDate ? new Date(formData.contractStartDate) : undefined,
      contractEndDate: formData.contractEndDate ? new Date(formData.contractEndDate) : undefined,
      contractStatus: formData.contractStatus,
      maxEmployees: formData.maxEmployees,
      notes: formData.notes || undefined,
    };
    if (editingClient) {
      updateMutation.mutate({ id: editingClient.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.businessNumber && client.businessNumber.includes(searchTerm)) ||
      (client.representativeName && client.representativeName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || client.contractStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* P-3: Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-stone-900 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            고객사 관리
          </h1>
          <p className="text-sm text-stone-500 mt-1">등록된 고객사를 관리합니다.</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-primary hover:bg-orange-800 text-white">
          <Plus className="h-4 w-4 mr-1.5" />
          고객사 추가
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            placeholder="회사명, 사업자번호, 대표자명 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 text-sm border-stone-200 focus:border-primary focus:ring-primary500/20"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] h-10 text-sm border-stone-200">
            <SelectValue placeholder="계약 상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="active">활성</SelectItem>
            <SelectItem value="pending">대기</SelectItem>
            <SelectItem value="expired">만료</SelectItem>
            <SelectItem value="terminated">해지</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* P-4: Premium Table */}
      {isLoading ? (
        <LoadingState />
      ) : filteredClients.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-7 w-7" />}
          title="등록된 고객사가 없습니다"
          description="첫 번째 고객사를 등록하고 근태 관리를 시작하세요."
          action={
            <Button onClick={handleOpenCreate} className="bg-primary hover:bg-orange-800 text-white">
              <Plus className="h-4 w-4 mr-1" />고객사 등록
            </Button>
          }
        />
      ) : (
        <div className="bg-white rounded-xl shadow-[0_1px_3px_0_rgb(0_0_0/0.04)] border border-stone-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">회사명</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">사업자번호</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">대표자</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">연락처</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">계약 상태</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">최대 직원수</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-stone-900">{client.companyName}</td>
                  <td className="px-6 py-4 text-sm text-stone-600">{client.businessNumber || "-"}</td>
                  <td className="px-6 py-4 text-sm text-stone-600">{client.representativeName || "-"}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5 text-sm text-stone-600">
                      {client.phone && (
                        <span className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-stone-400" /> {client.phone}</span>
                      )}
                      {client.email && (
                        <span className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-stone-400" /> {client.email}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={statusLabels[client.contractStatus]} />
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-600">{client.maxEmployees?.toLocaleString() || "-"}명</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleOpenEdit(client)} className="p-1.5 rounded-md hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => { setDeletingClient(client); setIsDeleteDialogOpen(true); }} className="p-1.5 rounded-md hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* P-6: Premium Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-white p-0 rounded-xl overflow-hidden">
          <div className="px-6 py-4 bg-stone-50 border-b border-stone-100">
            <DialogTitle className="text-base font-semibold text-stone-900">
              {editingClient ? "고객사 수정" : "고객사 등록"}
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500 mt-0.5">
              {editingClient ? "고객사 정보를 수정합니다." : "새로운 고객사 정보를 입력해주세요."}
            </DialogDescription>
          </div>

          <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  회사명 <span className="text-red-500">*</span>
                </label>
                <Input className="h-11 text-sm border-stone-200 focus:border-primary focus:ring-primary500/20" placeholder="예: 주식회사 가나다"
                  value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">사업자등록번호</label>
                <Input className="h-11 text-sm border-stone-200 focus:border-primary focus:ring-primary500/20" placeholder="예: 123-45-67890"
                  value={formData.businessNumber} onChange={(e) => setFormData({ ...formData, businessNumber: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">대표자명</label>
                <Input className="h-11 text-sm border-stone-200 focus:border-primary focus:ring-primary500/20" placeholder="홍길동"
                  value={formData.representativeName} onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">연락처</label>
                <Input className="h-11 text-sm border-stone-200 focus:border-primary focus:ring-primary500/20" placeholder="02-1234-5678"
                  value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">이메일</label>
              <Input className="h-11 text-sm border-stone-200 focus:border-primary focus:ring-primary500/20" type="email" placeholder="contact@company.com"
                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">주소</label>
              <Input className="h-11 text-sm border-stone-200 focus:border-primary focus:ring-primary500/20" placeholder="서울시 강남구 테헤란로 123"
                value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">계약 시작일</label>
                <Input className="h-11 text-sm border-stone-200 focus:border-primary focus:ring-primary500/20" type="date"
                  value={formData.contractStartDate} onChange={(e) => setFormData({ ...formData, contractStartDate: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">계약 종료일</label>
                <Input className="h-11 text-sm border-stone-200 focus:border-primary focus:ring-primary500/20" type="date"
                  value={formData.contractEndDate} onChange={(e) => setFormData({ ...formData, contractEndDate: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">계약 상태</label>
                <Select value={formData.contractStatus} onValueChange={(v: "active" | "pending" | "expired" | "terminated") => setFormData({ ...formData, contractStatus: v })}>
                  <SelectTrigger className="h-11 text-sm border-stone-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">대기</SelectItem>
                    <SelectItem value="active">활성</SelectItem>
                    <SelectItem value="expired">만료</SelectItem>
                    <SelectItem value="terminated">해지</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">최대 직원수</label>
              <Input className="h-11 text-sm border-stone-200 focus:border-primary focus:ring-primary500/20" type="number"
                value={formData.maxEmployees} onChange={(e) => setFormData({ ...formData, maxEmployees: parseInt(e.target.value) || 100 })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">비고</label>
              <Textarea className="text-sm border-stone-200 focus:border-primary focus:ring-primary500/20" placeholder="추가 메모사항" rows={3}
                value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
            </div>
          </div>

          <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex justify-end gap-2">
            <Button variant="outline" className="border-stone-200 text-stone-600" onClick={() => setIsDialogOpen(false)}>취소</Button>
            <Button className="bg-primary hover:bg-orange-800 text-white" onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
              {editingClient ? "수정" : "등록"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm bg-white p-0 rounded-xl overflow-hidden">
          <div className="px-6 py-4 bg-stone-50 border-b border-stone-100">
            <DialogTitle className="text-base font-semibold text-stone-900">고객사 삭제</DialogTitle>
            <DialogDescription className="text-xs text-stone-500 mt-0.5">
              정말로 "{deletingClient?.companyName}" 고객사를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </div>
          <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex justify-end gap-2">
            <Button variant="outline" className="border-stone-200 text-stone-600" onClick={() => setIsDeleteDialogOpen(false)}>취소</Button>
            <Button variant="destructive" onClick={() => { if (deletingClient) deleteMutation.mutate({ id: deletingClient.id }); }} disabled={deleteMutation.isPending}>삭제</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
