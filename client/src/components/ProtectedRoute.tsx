import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Redirect, Route } from "wouter";
import { ReactNode } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ProtectedRouteProps {
  path?: string;
  component?: React.ComponentType<any>;
  children?: ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ 
  path, 
  component: Component, 
  children, 
  allowedRoles 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  // 1. 로딩 중 처리 (깜빡임 방지)
  if (isLoading) {
    return <Route path={path} component={() => <LoadingSpinner className="min-h-screen" />} />;
  }

  // 2. 비로그인 상태면 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Route path={path} component={() => <Redirect to="/login-gateway" />} />;
  }

  // 3. 권한 체크 (allowedRoles가 설정된 경우)
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // 권한 없음: 역할에 맞는 대시보드로 강제 이동
    const redirectPath = 
      user.role === "employee" ? "/employee-dashboard" :
      user.role === "developer" ? "/developer-dashboard" :
      user.role === "consultant" ? "/consultant-dashboard" :
      user.role === "admin" ? "/admin-dashboard" :
      "/login-gateway";
      
    return <Route path={path} component={() => <Redirect to={redirectPath} />} />;
  }

  // 4. 정상 접근 허용
  if (Component) {
    return <Route path={path} component={Component} />;
  }

  return <Route path={path}>{children}</Route>;
}
