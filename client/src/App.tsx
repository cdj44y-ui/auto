import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { OfflineSyncManager } from "@/components/OfflineSyncManager";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { BrandingProvider } from "./contexts/BrandingContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import LoginGateway from "@/pages/LoginGateway";
import UnifiedLogin from "@/pages/UnifiedLogin";
import EmployeeSignup from "@/pages/EmployeeSignup";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ContractSigning from "@/pages/ContractSigning";
import DeveloperDashboard from "./pages/DeveloperDashboard";
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
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      {/* 공통 진입점 */}
      <Route path="/login-gateway" component={LoginGateway} />
      <Route path="/login" component={UnifiedLogin} />
      <Route path="/employee-signup" component={EmployeeSignup} />
      
      {/* 루트 경로 접속 시 로그인 페이지로 리다이렉트 (보안 강화) */}
      <Route path="/">
        <Redirect to="/login" />
      </Route>

      {/* 직원 전용 대시보드 (직원만 접근 가능) */}
      <Route path="/employee-dashboard">
        <ProtectedRoute allowedRoles={["employee"]} component={EmployeeDashboard} />
      </Route>
      <Route path="/contract-signing">
        <ProtectedRoute allowedRoles={["employee"]} component={ContractSigning} />
      </Route>

      {/* 개발자 전용 대시보드 (개발자만 접근 가능) */}
      <Route path="/developer-dashboard">
        <ProtectedRoute allowedRoles={["developer"]} component={DeveloperDashboard} />
      </Route>

      {/* 자문사 전용 대시보드 (자문사만 접근 가능) */}
      <Route path="/consultant-dashboard">
        <ProtectedRoute allowedRoles={["consultant"]} component={ConsultantDashboard} />
      </Route>
      
      {/* 관리자용 라우트 (관리자만 접근 가능) */}
      <Route path="/admin-dashboard">
        <ProtectedRoute allowedRoles={["admin"]} component={Home} />
      </Route>
      <Route path="/attendance">
        <ProtectedRoute allowedRoles={["admin"]} component={Attendance} />
      </Route>
      <Route path="/approvals">
        <ProtectedRoute allowedRoles={["admin"]} component={Approvals} />
      </Route>
      <Route path="/contract">
        <ProtectedRoute allowedRoles={["admin"]} component={Contract} />
      </Route>
      <Route path="/workflow">
        <ProtectedRoute allowedRoles={["admin"]} component={Workflow} />
      </Route>
      <Route path="/payroll">
        <ProtectedRoute allowedRoles={["admin"]} component={Payroll} />
      </Route>
      <Route path="/reports">
        <ProtectedRoute allowedRoles={["admin"]} component={Reports} />
      </Route>
      <Route path="/employees">
        <ProtectedRoute allowedRoles={["admin"]} component={Employees} />
      </Route>
      <Route path="/settings">
        <ProtectedRoute allowedRoles={["admin"]} component={Settings} />
      </Route>
      <Route path="/insights">
        <ProtectedRoute allowedRoles={["admin"]} component={Insights} />
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
