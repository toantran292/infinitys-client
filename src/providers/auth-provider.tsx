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
import { jwtDecode } from "jwt-decode";
import { instance } from "@/common/api";

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
  email: string;
};

type Auth = {
  message: string;
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
  message: "",
  token: "",
  user: null
};

type Decoded = {
  sub: string;
  email: string;
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
  const [auth, setAuth] = useState<Auth>(() => {
    const savedToken = localStorage.getItem("accessToken") || "";
    if (savedToken) {
      try {
        const decoded = jwtDecode<Decoded>(savedToken);
        const user: User = {
          id: decoded.sub as string,
          email: decoded.email as string
        };
        return {
          message: "",
          token: savedToken,
          user
        };
      } catch {
        return defaultAuth;
      }
    }
    return defaultAuth;
  });
  useEffect(() => {
    if (auth.token) {
      localStorage.setItem("accessToken", auth.token);
    } else {
      localStorage.removeItem("accessToken");
    }
  }, [auth.token]);

  const signOut = () => {
    setAuth(defaultAuth);
    localStorage.removeItem("accessToken");
  };

  const { mutate: signIn, isPending: isSigningIn } = useMutation({
    mutationFn: async (data: SignInFormData) => {
      const response = await instance.post("/auths/signin", data);
      return response.data;
    },
    onSuccess: (result) => {
      if (result.token) {
        try {
          const decoded = jwtDecode<Decoded>(result.token);
          setAuth({
            message: result.message,
            token: result.token,
            user: {
              id: decoded.sub,
              email: decoded.email
            }
          });
          localStorage.setItem("accessToken", result.token);
        } catch (error) {
          console.error("Token decode error:", error);
        }
      }
    },
    onError: (error) => {
      console.error("Error signing in:", error);
    }
  });

  const { mutate: signUp, isPending: isSigningUp } = useMutation({
    mutationFn: async (data: SignUpFormData) => {
      const response = await instance.post("/auths/signup", data);
      return response.data;
    },
    onSuccess: (result) => {
      if (result.token) {
        try {
          const decoded = jwtDecode<Decoded>(result.token);
          setAuth({
            message: result.message,
            token: result.token,
            user: {
              id: decoded.sub,
              email: decoded.email
            }
          });
          localStorage.setItem("accessToken", result.token);
        } catch (error) {
          console.error("Token decode error:", error);
        }
      }
    },
    onError: (error) => {
      console.error("Error signing up:", error);
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
