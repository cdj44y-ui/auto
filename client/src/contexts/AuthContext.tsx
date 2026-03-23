import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

/**
 * P-01: 6단계 권한 체계 통일
 * super_admin(100) > consultant(80) > company_admin(60) > company_hr(40) > company_finance(30) > employee(10)
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useLocation();

  // 초기 로드 시 세션 스토리지에서 사용자 정보 복원 (새로고침 유지)
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = sessionStorage.getItem("currentUser");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to restore auth session:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    initAuth();
  }, []);

  // 세션 만료 타이머 (8시간)
  useEffect(() => {
    if (!user) return;

    const SESSION_TIMEOUT = 8 * 60 * 60 * 1000;
    const timer = setTimeout(() => {
      logout();
      toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
    }, SESSION_TIMEOUT);

    return () => clearTimeout(timer);
  }, [user]);

  const login = (role: UserRole) => {
    setIsLoading(true);
    let mockUser: User;

    switch (role) {
      case "employee":
        mockUser = { id: 1, name: "이영희", role: "employee", department: "개발팀", position: "대리", clientId: 1 };
        break;
      case "super_admin":
        mockUser = { id: 2, name: "김관리", role: "super_admin", department: "인사팀", position: "팀장" };
        break;
      case "consultant":
        mockUser = { id: 3, name: "박노무", role: "consultant", department: "노무법인", position: "대표노무사" };
        break;
      case "company_admin":
        mockUser = { id: 4, name: "최회사", role: "company_admin", department: "관리팀", position: "관리자", clientId: 1 };
        break;
      case "company_hr":
        mockUser = { id: 5, name: "정인사", role: "company_hr", department: "인사팀", position: "인사담당", clientId: 1 };
        break;
      case "company_finance":
        mockUser = { id: 6, name: "한재무", role: "company_finance", department: "재무팀", position: "재무담당", clientId: 1 };
        break;
      default:
        setIsLoading(false);
        return;
    }

    setTimeout(() => {
      setUser(mockUser);
      sessionStorage.setItem("currentUser", JSON.stringify(mockUser));
      
      // P-01: 역할별 대시보드 라우팅
      const dashboardRoutes: Record<string, string> = {
        super_admin: "/admin-dashboard",
        consultant: "/consultant-dashboard",
        company_admin: "/admin-dashboard",
        company_hr: "/admin-dashboard",
        company_finance: "/admin-dashboard",
        employee: "/employee-dashboard",
      };
      setLocation(dashboardRoutes[role as string] || "/employee-dashboard");
      
      setIsLoading(false);
      toast.success(`${mockUser.name}님 환영합니다.`);
    }, 600);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("currentUser");
    setLocation("/login-gateway");
    toast.info("로그아웃되었습니다.");
  };

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
