import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

/**
 * P-01: 6단계 권한 체계 통일
 * super_admin(100) > consultant(80) > company_admin(60) > company_hr(40) > company_finance(30) > employee(10)
 * 
 * P-02-SEC: 서버 세션 기반 인증 (mockUser 제거)
 * - sessionStorage 사용 안 함 (쿠키 기반)
 * - 새로고침 시 auth.me 호출로 세션 복원
 */
export type UserRole = "super_admin" | "consultant" | "company_admin" | "company_hr" | "company_finance" | "employee" | "user" | null;

interface User {
  id: number;
  name: string;
  role: UserRole;
  department?: string;
  position?: string;
  clientId?: number | null;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  login: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 역할별 대시보드 라우팅 맵
const DASHBOARD_ROUTES: Record<string, string> = {
  super_admin: "/admin-dashboard",
  consultant: "/consultant-dashboard",
  company_admin: "/admin-dashboard",
  company_hr: "/admin-dashboard",
  company_finance: "/admin-dashboard",
  employee: "/employee-dashboard",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  // ★ P-02-SEC: 서버에서 현재 세션 확인 (쿠키 기반, sessionStorage 사용 안 함)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/trpc/auth.me', { credentials: 'include' });
        const data = await res.json();
        if (data?.result?.data) {
          const serverUser = data.result.data;
          setUser({
            id: serverUser.id,
            name: serverUser.name || '사용자',
            role: serverUser.role || 'employee',
            department: serverUser.department,
            clientId: serverUser.clientId,
          });
        }
      } catch {
        // 세션 없음 — 정상 (로그인 필요)
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  /**
   * 로그인 함수
   * - 개발 모드: 데모 역할 선택 (mockUser) — 프로덕션에서는 OAuth 콜백으로 자동 처리
   * - 프로덕션: OAuth 완료 후 auth.me로 세션 복원되므로 직접 호출 불필요
   */
  const login = useCallback((role: UserRole) => {
    setIsLoading(true);

    // 개발 모드에서만 데모 로그인 허용
    const isDev = import.meta.env.DEV;
    if (!isDev) {
      // 프로덕션: OAuth 리다이렉트로 처리
      setIsLoading(false);
      return;
    }

    // 개발 모드: 데모 역할 로그인
    const demoUsers: Record<string, User> = {
      employee: { id: 1, name: "이영희", role: "employee", department: "개발팀", clientId: 1 },
      super_admin: { id: 2, name: "김관리", role: "super_admin", department: "시스템" },
      consultant: { id: 3, name: "박노무", role: "consultant", department: "노무법인" },
      company_admin: { id: 4, name: "최회사", role: "company_admin", department: "관리팀", clientId: 1 },
      company_hr: { id: 5, name: "정인사", role: "company_hr", department: "인사팀", clientId: 1 },
      company_finance: { id: 6, name: "한재무", role: "company_finance", department: "재무팀", clientId: 1 },
    };

    const mockUser = demoUsers[role as string];
    if (!mockUser) {
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setUser(mockUser);
      setLocation(DASHBOARD_ROUTES[role as string] || "/employee-dashboard");
      setIsLoading(false);
      toast.success(`${mockUser.name}님 환영합니다.`);
    }, 300);
  }, [setLocation]);

  const logout = useCallback(async () => {
    try {
      // ★ P-02-SEC: 서버 세션 무효화 (쿠키 삭제)
      await fetch('/api/trpc/auth.logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // 서버 호출 실패해도 클라이언트 상태는 정리
    } finally {
      setUser(null);
      setLocation("/login-gateway");
      toast.info("로그아웃되었습니다.");
    }
  }, [setLocation]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      role: user?.role || null, 
      login, 
      logout,
      isAuthenticated: !!user,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
