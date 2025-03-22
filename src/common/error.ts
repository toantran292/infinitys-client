import { AxiosError } from "axios";

const ERROR_MESSAGES = {
  "error.invalidCredentials": "Tên đăng nhập hoặc mật khẩu không chính xác",
  "error.emailAlreadyExists": "Email đã tồn tại",
  "error.userNotFound": "Tài khoản không tồn tại",
  "error.passwordIncorrect": "Mật khẩu không chính xác",
  "error.emailNotVerified": "Email chưa được xác thực",
  "error.emailAlreadyVerified": "Email đã được xác thực",
  "error.application_already_applied": "Bạn đã ứng tuyển vào công việc này"
};

export type ErrorMessage = {
  message: string;
  errorMessage: string;
};

const getErrorMessage = (error: AxiosError): ErrorMessage => {
  const errorMessage = (error.response?.data as { message: string })?.message;

  const message =
    ERROR_MESSAGES[errorMessage as keyof typeof ERROR_MESSAGES] ||
    "Đã xảy ra lỗi";

  return { message, errorMessage };
};

export { getErrorMessage, ERROR_MESSAGES };
