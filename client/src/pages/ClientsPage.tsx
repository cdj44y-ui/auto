import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Plus, Pencil, Trash2, Search, Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

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

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  expired: "bg-gray-100 text-gray-800",
  terminated: "bg-red-100 text-red-800",
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
      toast.success("고객사가 등록되었습니다.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = trpc.clientMgmt.update.useMutation({
    onSuccess: () => {
      utils.clientMgmt.list.invalidate();
      setIsDialogOpen(false);
      setEditingClient(null);
      setFormData(initialFormData);
      toast.success("고객사 정보가 수정되었습니다.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = trpc.clientMgmt.delete.useMutation({
    onSuccess: () => {
      utils.clientMgmt.list.invalidate();
      setIsDeleteDialogOpen(false);
      setDeletingClient(null);
      toast.success("고객사가 삭제되었습니다.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
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

  const handleOpenDelete = (client: Client) => {
    setDeletingClient(client);
    setIsDeleteDialogOpen(true);
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

  const handleDelete = () => {
    if (deletingClient) {
      deleteMutation.mutate({ id: deletingClient.id });
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            고객사 관리
          </h1>
          <p className="text-muted-foreground">등록된 고객사를 관리합니다.</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          고객사 추가
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="회사명, 사업자번호, 대표자명 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
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

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>회사명</TableHead>
              <TableHead>사업자번호</TableHead>
              <TableHead>대표자</TableHead>
              <TableHead>연락처</TableHead>
              <TableHead>계약 상태</TableHead>
              <TableHead>최대 직원수</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  등록된 고객사가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.companyName}</TableCell>
                  <TableCell>{client.businessNumber || "-"}</TableCell>
                  <TableCell>{client.representativeName || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      {client.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {client.phone}
                        </span>
                      )}
                      {client.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {client.email}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[client.contractStatus]}>
                      {statusLabels[client.contractStatus]}
                    </Badge>
                  </TableCell>
                  <TableCell>{client.maxEmployees?.toLocaleString() || "-"}명</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(client)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(client)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingClient ? "고객사 수정" : "신규 고객사 등록"}</DialogTitle>
            <DialogDescription>
              {editingClient ? "고객사 정보를 수정합니다." : "새로운 고객사를 등록합니다."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">회사명 *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="(주)회사명"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessNumber">사업자번호</Label>
                <Input
                  id="businessNumber"
                  value={formData.businessNumber}
                  onChange={(e) => setFormData({ ...formData, businessNumber: e.target.value })}
                  placeholder="000-00-00000"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="representativeName">대표자명</Label>
                <Input
                  id="representativeName"
                  value={formData.representativeName}
                  onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })}
                  placeholder="홍길동"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">연락처</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="02-1234-5678"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">주소</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="서울시 강남구 테헤란로 123"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contractStartDate">계약 시작일</Label>
                <Input
                  id="contractStartDate"
                  type="date"
                  value={formData.contractStartDate}
                  onChange={(e) => setFormData({ ...formData, contractStartDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractEndDate">계약 종료일</Label>
                <Input
                  id="contractEndDate"
                  type="date"
                  value={formData.contractEndDate}
                  onChange={(e) => setFormData({ ...formData, contractEndDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractStatus">계약 상태</Label>
                <Select
                  value={formData.contractStatus}
                  onValueChange={(value: "active" | "pending" | "expired" | "terminated") =>
                    setFormData({ ...formData, contractStatus: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">대기</SelectItem>
                    <SelectItem value="active">활성</SelectItem>
                    <SelectItem value="expired">만료</SelectItem>
                    <SelectItem value="terminated">해지</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxEmployees">최대 직원수</Label>
              <Input
                id="maxEmployees"
                type="number"
                value={formData.maxEmployees}
                onChange={(e) => setFormData({ ...formData, maxEmployees: parseInt(e.target.value) || 100 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">비고</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="추가 메모사항"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingClient ? "수정" : "등록"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>고객사 삭제</DialogTitle>
            <DialogDescription>
              정말로 "{deletingClient?.companyName}" 고객사를 삭제하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
