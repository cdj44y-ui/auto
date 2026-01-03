import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useLocation } from "wouter";

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [location, setLocation] = useLocation();

  // 초기 로드 시 세션 스토리지에서 사용자 정보 복원 (새로고침 유지)
  useEffect(() => {
    const storedUser = sessionStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (role: UserRole) => {
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
        return;
    }

    setUser(mockUser);
    sessionStorage.setItem("currentUser", JSON.stringify(mockUser));
    
    // 로그인 후 역할에 맞는 대시보드로 이동
    if (role === "employee") setLocation("/employee-dashboard");
    else if (role === "consultant") setLocation("/consultant-dashboard");
    else if (role === "developer") setLocation("/developer-dashboard");
    else if (role === "admin") setLocation("/admin-dashboard"); // 관리자 경로 명시적 분리
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("currentUser");
    setLocation("/login");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      role: user?.role || null, 
      login, 
      logout,
      isAuthenticated: !!user 
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
