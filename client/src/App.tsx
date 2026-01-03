import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Approvals from "./pages/Approvals";
import Contract from "./pages/Contract";
import Workflow from "./pages/Workflow";
import Payroll from "./pages/Payroll";
import Reports from "./pages/Reports";
import Employees from "./pages/Employees";
import Settings from "./pages/Settings";
import Attendance from "./pages/Attendance";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/attendance"} component={Attendance} />
      <Route path={"/login"} component={Login} />
      <Route path={"/signup"} component={Signup} />
      <Route path={"/approvals"} component={Approvals} />
      <Route path={"/contract"} component={Contract} />
      <Route path={"/workflow"} component={Workflow} />
      <Route path={"/payroll"} component={Payroll} />
      <Route path={"/reports"} component={Reports} />
      <Route path={"/employees"} component={Employees} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
