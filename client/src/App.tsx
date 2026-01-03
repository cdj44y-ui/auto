import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";

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
      {/* 공통 진입점 (로그인 게이트웨이) */}
      <Route path="/login" component={LoginGateway} />
      
      {/* 역할별 대시보드 */}
      <Route path="/employee-dashboard" component={EmployeeDashboard} />
      <Route path="/developer-dashboard" component={DeveloperDashboard} />
      
      {/* 관리자용 라우트 (기존 경로 유지) */}
      <Route path="/" component={Home} />
      <Route path="/attendance" component={Attendance} />
      <Route path="/approvals" component={Approvals} />
      <Route path="/contract" component={Contract} />
      <Route path="/workflow" component={Workflow} />
      <Route path="/payroll" component={Payroll} />
      <Route path="/reports" component={Reports} />
      <Route path="/employees" component={Employees} />
      <Route path="/settings" component={Settings} />
      <Route path="/insights" component={Insights} />
      
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
