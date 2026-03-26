import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { OfflineSyncManager } from "@/components/OfflineSyncManager";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { BrandingProvider } from "./contexts/BrandingContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Loader2 } from "lucide-react";

// Pages
import Home from "./pages/Home";
import LoginGateway from "@/pages/LoginGateway";
import UnifiedLogin from "@/pages/UnifiedLogin";
import EmployeeSignup from "@/pages/EmployeeSignup";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ContractSigning from "@/pages/ContractSigning";
import ConsultantDashboard from "./pages/ConsultantDashboard";
import Approvals from "./pages/Approvals";
import Contract from "./pages/Contract";
import Workflow from "./pages/Workflow";
import Payroll from "./pages/Payroll";
import Reports from "./pages/Reports";
import Employees from "./pages/Employees";
import Settings from "./pages/Settings";
import Insights from "./pages/Insights";
import Attendance from "./pages/Attendance";
import ClientsPage from "./pages/ClientsPage";
import ConsultationsPage from "./pages/ConsultationsPage";

/**
 * 역할별 대시보드 라우팅 맵
 */
const DASHBOARD_ROUTES: Record<string, string> = {
  super_admin: "/admin-dashboard",
  consultant: "/consultant-dashboard",
  company_admin: "/admin-dashboard",
  company_hr: "/admin-dashboard",
  company_finance: "/admin-dashboard",
  employee: "/employee-dashboard",
};

/**
 * 루트 경로 핸들러: 인증 상태에 따라 적절한 페이지로 리다이렉트
 */
function RootRedirect() {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isAuthenticated && role) {
    const target = DASHBOARD_ROUTES[role] || "/employee-dashboard";
    return <Redirect to={target} />;
  }

  return <Redirect to="/login" />;
}

/**
 * P-01: 6단계 권한 체계에 맞는 라우트 접근 제어
 * super_admin(100) > consultant(80) > company_admin(60) > company_hr(40) > company_finance(30) > employee(10)
 */
function Router() {
  return (
    <Switch>
      {/* 공통 진입점 */}
      <Route path="/login-gateway" component={LoginGateway} />
      <Route path="/login" component={UnifiedLogin} />
      <Route path="/employee-signup" component={EmployeeSignup} />
      
      {/* 루트: 인증 상태에 따라 대시보드 또는 로그인으로 리다이렉트 */}
      <Route path="/">
        <RootRedirect />
      </Route>

      {/* 직원 전용 대시보드 */}
      <Route path="/employee-dashboard">
        <ProtectedRoute allowedRoles={["employee"]} component={EmployeeDashboard} />
      </Route>
      <Route path="/contract-signing">
        <ProtectedRoute allowedRoles={["employee"]} component={ContractSigning} />
      </Route>

      {/* 자문사 전용 대시보드 */}
      <Route path="/consultant-dashboard">
        <ProtectedRoute allowedRoles={["consultant"]} component={ConsultantDashboard} />
      </Route>
      
      {/* 관리자 대시보드 (super_admin, company_admin, company_hr, company_finance) */}
      <Route path="/admin-dashboard">
        <ProtectedRoute allowedRoles={["super_admin", "company_admin", "company_hr", "company_finance"]} component={Home} />
      </Route>

      {/* 근태 관리 (super_admin, consultant, company_admin, company_hr) */}
      <Route path="/attendance">
        <ProtectedRoute allowedRoles={["super_admin", "consultant", "company_admin", "company_hr"]} component={Attendance} />
      </Route>

      {/* 승인 관리 (super_admin, company_admin) */}
      <Route path="/approvals">
        <ProtectedRoute allowedRoles={["super_admin", "company_admin"]} component={Approvals} />
      </Route>

      {/* 전자 근로계약서 (super_admin, company_admin, company_hr) */}
      <Route path="/contract">
        <ProtectedRoute allowedRoles={["super_admin", "company_admin", "company_hr"]} component={Contract} />
      </Route>

      {/* 전자 결재 (super_admin, company_admin) */}
      <Route path="/workflow">
        <ProtectedRoute allowedRoles={["super_admin", "company_admin"]} component={Workflow} />
      </Route>

      {/* 급여 관리 (super_admin, consultant, company_admin, company_finance) */}
      <Route path="/payroll">
        <ProtectedRoute allowedRoles={["super_admin", "consultant", "company_admin", "company_finance"]} component={Payroll} />
      </Route>

      {/* 통계 보고서 (super_admin, consultant, company_admin) */}
      <Route path="/reports">
        <ProtectedRoute allowedRoles={["super_admin", "consultant", "company_admin"]} component={Reports} />
      </Route>

      {/* 직원 관리 (super_admin, consultant, company_admin, company_hr) */}
      <Route path="/employees">
        <ProtectedRoute allowedRoles={["super_admin", "consultant", "company_admin", "company_hr"]} component={Employees} />
      </Route>

      {/* 설정 (super_admin 전용) */}
      <Route path="/settings">
        <ProtectedRoute allowedRoles={["super_admin"]} component={Settings} />
      </Route>

      {/* AI 인사이트 (super_admin, company_admin) */}
      <Route path="/insights">
        <ProtectedRoute allowedRoles={["super_admin", "company_admin"]} component={Insights} />
      </Route>

      {/* 고객사 관리 (super_admin, consultant) */}
      <Route path="/clients">
        <ProtectedRoute allowedRoles={["super_admin", "consultant"]} component={ClientsPage} />
      </Route>

      {/* 자문 이력 (super_admin, consultant) */}
      <Route path="/consultations">
        <ProtectedRoute allowedRoles={["super_admin", "consultant"]} component={ConsultationsPage} />
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <BrandingProvider>
          <TooltipProvider>
            <PWAInstallPrompt />
            <OfflineSyncManager />
            <Toaster />
            <Router />
          </TooltipProvider>
        </BrandingProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
