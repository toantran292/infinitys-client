"use server";

export async function signUp(formData: FormData) {
  console.log("User Data:", formData);
  return { success: "Đăng ký thành công!" };
}


