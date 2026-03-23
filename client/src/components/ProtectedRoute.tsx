import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Redirect } from "wouter";
import { ReactNode } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ProtectedRouteProps {
  component?: React.ComponentType<any>;
  children?: ReactNode;
  allowedRoles?: UserRole[];
}

/**
 * P-01: 6단계 권한 체계에 맞는 대시보드 라우팅
 */
function getDashboardPath(role: string): string {
  switch (role) {
    case "super_admin":
    case "company_admin":
    case "company_hr":
    case "company_finance":
      return "/admin-dashboard";
    case "consultant":
      return "/consultant-dashboard";
    case "employee":
      return "/employee-dashboard";
    default:
      return "/login-gateway";
  }
}

export default function ProtectedRoute({ 
  component: Component, 
  children, 
  allowedRoles 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner className="min-h-screen" />;
  }

  if (!isAuthenticated) {
    return <Redirect to="/login-gateway" />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Redirect to={getDashboardPath(user.role || "employee")} />;
  }

  if (Component) {
    return <Component />;
  }

  return <>{children}</>;
}
