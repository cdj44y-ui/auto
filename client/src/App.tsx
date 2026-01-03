import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import LoginGateway from "./pages/LoginGateway";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import DeveloperDashboard from "./pages/DeveloperDashboard";
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
  return (
    <Switch>
      {/* 공통 진입점 */}
      <Route path="/login" component={LoginGateway} />
      
      {/* 루트 경로 접속 시 로그인 페이지로 리다이렉트 (보안 강화) */}
      <Route path="/">
        <Redirect to="/login" />
      </Route>

      {/* 직원 전용 대시보드 (직원만 접근 가능) */}
      <ProtectedRoute 
        path="/employee-dashboard" 
        component={EmployeeDashboard} 
        allowedRoles={["employee"]} 
      />

      {/* 개발자 전용 대시보드 (개발자만 접근 가능) */}
      <ProtectedRoute 
        path="/developer-dashboard" 
        component={DeveloperDashboard} 
        allowedRoles={["developer"]} 
      />
      
      {/* 관리자용 라우트 (관리자만 접근 가능) */}
      <ProtectedRoute path="/admin" component={Home} allowedRoles={["admin"]} />
      <ProtectedRoute path="/attendance" component={Attendance} allowedRoles={["admin"]} />
      <ProtectedRoute path="/approvals" component={Approvals} allowedRoles={["admin"]} />
      <ProtectedRoute path="/contract" component={Contract} allowedRoles={["admin"]} />
      <ProtectedRoute path="/workflow" component={Workflow} allowedRoles={["admin"]} />
      <ProtectedRoute path="/payroll" component={Payroll} allowedRoles={["admin"]} />
      <ProtectedRoute path="/reports" component={Reports} allowedRoles={["admin"]} />
      <ProtectedRoute path="/employees" component={Employees} allowedRoles={["admin"]} />
      <ProtectedRoute path="/settings" component={Settings} allowedRoles={["admin"]} />
      <ProtectedRoute path="/insights" component={Insights} allowedRoles={["admin"]} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
