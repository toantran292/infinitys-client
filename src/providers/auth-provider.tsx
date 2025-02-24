"use client";

import {
  createContext,
  FC,
  PropsWithChildren,
  useState,
  useEffect,
  useContext
} from "react";
import { useMutation } from "@tanstack/react-query";
import { instance } from "@/common/api";
import { useToast } from "@/hooks/use-toast";

type SignInFormData = {
  email: string;
  password: string;
};

type SignUpFormData = {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  active: boolean;
};

type Auth = {
  token: string;
  user?: User | null;
};

type Context = {
  auth: Auth;
  setAuth: (auth: Auth) => void;
  signOut: () => void;
  signIn: (data: SignInFormData) => void;
  signUp: (data: SignUpFormData) => void;
  isSigningIn: boolean;
  isSigningUp: boolean;
};

const defaultAuth: Auth = {
  token: "",
  user: null
};

const AuthContext = createContext<Context>({
  auth: defaultAuth,
  setAuth: () => {},
  signOut: () => {},
  signIn: () => {},
  signUp: () => {},
  isSigningIn: false,
  isSigningUp: false
});

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [auth, setAuth] = useState<Auth>(defaultAuth);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      const user = localStorage.getItem("user");
      if (token && user) {
        try {
          setAuth({
            token: token,
            user: user ? JSON.parse(user) : null
          });
        } catch {
          setAuth(defaultAuth);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (auth.token) {
        localStorage.setItem("accessToken", auth.token);
        localStorage.setItem("user", JSON.stringify(auth.user));
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      }
    }
  }, [auth.token]);

  const signOut = () => {
    setAuth(defaultAuth);
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
    window.location.href = "/";
  };

  const { mutate: signIn, isPending: isSigningIn } = useMutation({
    mutationFn: async (data: SignInFormData) => {
      const response = await instance.post("api/auths/login", data);
      return response.data;
    },

    onSuccess: (result) => {
      if (result.token) {
        try {
          setAuth({
            token: result.token.accessToken,
            user: result.user
          });

          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", result.token.accessToken);
            localStorage.setItem("user", JSON.stringify(result.user));
          }
          window.location.href = "/home";
        } catch (error) {
          console.error("Token decode error:", error);
        }
      }
    },
    onError: (error: unknown) => {
      console.error("Error signing in:", error);
      toast({
        variant: "destructive",
        title: "Đăng nhập không thành công",
        description:
          (error as { response?: { data?: { message?: string } } }).response
            ?.data?.message || ""
      });
    }
  });

  const { mutate: signUp, isPending: isSigningUp } = useMutation({
    mutationFn: async (data: SignUpFormData) => {
      const response = await instance.post("api/auths/register", data);
      return response.data;
    },
    onSuccess: (result) => {
      if (result.token) {
        try {
          setAuth({
            token: result.token.accessToken,
            user: result.user
          });

          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", result.token.accessToken);
            localStorage.setItem("user", JSON.stringify(result.user));
          }
          window.location.href = "/home";
        } catch (error) {
          console.error("Token decode error:", error);
        }
      }
    },
    onError: (error: unknown) => {
      console.error("Error signing up:", error);
      toast({
        variant: "destructive",
        title: "Đăng ký không thành công",
        description:
          (error as { response?: { data?: { message?: string } } }).response
            ?.data?.message || ""
      });
    }
  });

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        signOut,
        signIn,
        signUp,
        isSigningIn,
        isSigningUp
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

export const useAuth = () => useContext(AuthContext);
