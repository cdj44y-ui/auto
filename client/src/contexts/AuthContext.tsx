import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export type UserRole = "employee" | "admin" | "consultant" | "developer" | null;

interface User {
  id: number;
  name: string;
  role: UserRole;
  department?: string;
  position?: string;
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
        // 짧은 지연을 주어 로딩 상태가 너무 빨리 끝나는 것 방지 (UX)
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    initAuth();
  }, []);

  // 세션 만료 타이머 (8시간)
  useEffect(() => {
    if (!user) return;

    const SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8시간
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
        mockUser = { id: 1, name: "이영희", role: "employee", department: "개발팀", position: "대리" };
        break;
      case "admin":
        mockUser = { id: 2, name: "김관리", role: "admin", department: "인사팀", position: "팀장" };
        break;
      case "consultant":
        mockUser = { id: 3, name: "박노무", role: "consultant", department: "노무법인", position: "대표노무사" };
        break;
      case "developer":
        mockUser = { id: 999, name: "최개발", role: "developer" };
        break;
      default:
        setIsLoading(false);
        return;
    }

    // 로그인 처리 시뮬레이션 (약간의 지연)
    setTimeout(() => {
      setUser(mockUser);
      sessionStorage.setItem("currentUser", JSON.stringify(mockUser));
      
      // 로그인 후 역할에 맞는 대시보드로 이동
      if (role === "employee") setLocation("/employee-dashboard");
      else if (role === "consultant") setLocation("/consultant-dashboard");
      else if (role === "developer") setLocation("/developer-dashboard");
      else if (role === "admin") setLocation("/admin-dashboard");
      
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
