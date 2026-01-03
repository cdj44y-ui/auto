import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Redirect, Route } from "wouter";
import { ReactNode } from "react";

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
  const { user, isAuthenticated } = useAuth();

  // 1. 비로그인 상태면 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Route path={path} component={() => <Redirect to="/login" />} />;
  }

  // 2. 권한 체크 (allowedRoles가 설정된 경우)
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // 권한 없음: 역할에 맞는 대시보드로 강제 이동
    const redirectPath = 
      user.role === "employee" ? "/employee-dashboard" :
      user.role === "developer" ? "/developer-dashboard" :
      "/"; // admin
      
    return <Route path={path} component={() => <Redirect to={redirectPath} />} />;
  }

  // 3. 정상 접근 허용
  if (Component) {
    return <Route path={path} component={Component} />;
  }

  return <Route path={path}>{children}</Route>;
}
