"use client";

import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState
} from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { delay } from "@/lib/utils";
import { ErrorMessage } from "@/common/error";

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
  avatar?: {
    url: string;
  };
};

type Context = {
  user: User | null;
  isLoading: boolean;
  signOut: () => void;
  refetchUser: () => void;
  signIn: (data: SignInFormData) => void;
  signUp: (data: SignUpFormData) => void;
  isSigningIn: boolean;
  isSigningUp: boolean;
  signInError: unknown;
  signUpError: unknown;
};

const AuthContext = createContext<Context>({
  user: null,
  isLoading: false,
  signOut: () => { },
  refetchUser: () => { },
  signIn: () => { },
  signUp: () => { },
  isSigningIn: false,
  isSigningUp: false,
  signInError: null,
  signUpError: null
});

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Kiểm tra localStorage khi component mount ở client-side
  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken"));
  }, []);

  const { data: user, refetch: refetchUser, isLoading: isUserLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("api/auths/me");
        return response.data;
      } catch (error) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
        }
        throw error;
      }
    },
    enabled: !!accessToken, // Sử dụng state thay vì truy cập trực tiếp localStorage
    retry: false
  });

  // Mutation đăng nhập
  const signInMutation = useMutation({
    mutationFn: async (data: SignInFormData) => {
      const response = await axiosInstance.post("api/auths/login", data);
      return response.data;
    },
    onSuccess: async (data) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", data.accessToken);
      }
      setAccessToken(data.accessToken);
      await refetchUser();

      toast.success("Đăng nhập thành công", {
        duration: 2000,
        description: "Chuyển về trang chủ sau 2 giây"
      });

      await delay(2000);
      router.push("/");
    },
    onError: (error: ErrorMessage) => {
      toast.error("Đăng nhập thất bại", {
        duration: 2000,
        description: error.message
      });
    }
  });

  // Mutation đăng ký
  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpFormData) => {
      const response = await axiosInstance.post("api/auths/register", data);
      return response.data;
    },
    onSuccess: async (data) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", data.token.accessToken);
      }
      setAccessToken(data.token.accessToken);
      await refetchUser();

      toast.success("Đăng ký thành công", {
        duration: 2000,
        description: "Chuyển về trang chủ sau 2 giây"
      });

      await delay(2000);
      router.push("/");
    },
    onError: (error: ErrorMessage) => {
      toast.error("Đăng ký thất bại", {
        duration: 2000,
        description: error.message
      });
    }
  });

  // Mutation đăng xuất
  const signOutMutation = useMutation({
    mutationFn: async () => {
      // await axiosInstance.post("api/auths/signout");
      localStorage.removeItem("accessToken");
    },
    onSuccess: () => {
      router.push("/auth/login");
    }
  });

  const isLoading = signInMutation.isPending || signUpMutation.isPending || signOutMutation.isPending || isUserLoading;

  const value = {
    user,
    isLoading,
    signIn: signInMutation.mutate,
    signUp: signUpMutation.mutate,
    signOut: signOutMutation.mutate,
    refetchUser,
    isSigningIn: signInMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    signInError: signInMutation.error,
    signUpError: signUpMutation.error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

export const useAuth = () => useContext(AuthContext);
