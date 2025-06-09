import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    return token && user ? { token, user } : null;
  });

  const [role, setRole] = useState(null);

  // Helper: Cek apakah token expired
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now(); // exp dalam detik, Date.now dalam milidetik
    } catch {
      return true;
    }
  };

  useEffect(() => {
    if (auth?.token) {
      if (isTokenExpired(auth.token)) {
        logout();
      } else {
        try {
          const decoded = JSON.parse(atob(auth.token.split(".")[1]));
          setRole(decoded.role || auth.user?.role?.name); // Prioritaskan JWT role
        } catch {
          setRole(auth.user?.role?.name || null);
        }
      }
    } else {
      setRole(null);
    }
  }, [auth]);

  const login = ({ user, access_token }) => {
    localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ user, token: access_token });

    try {
      const decoded = JSON.parse(atob(access_token.split(".")[1]));
      setRole(decoded.role || user?.role?.name);
    } catch {
      setRole(user?.role?.name || null);
    }
  };

  const logout = () => {
    setAuth(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return <AuthContext.Provider value={{ auth, login, logout, role }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
