import instance from "@/common/api";

type RegisterPage = {
  name: string;
  content?: string;
  address: string;
  url: URL;
  email: string;
};
export const registerPage = async (formData: RegisterPage) => {
  try {
    const response = await instance.post("api/pages/register", {
      ...formData
    });
    if (!response) {
      throw new Error("Không thể đăng ký trang");
    }

    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API đăng ký trang:", error);
    throw error;
  }
};

export const getMyPage = async () => {
  try {
    const response = await instance.get("api/pages/me");
    if (!response) {
      throw new Error("Không thể lấy các trang rieng");
    }
    return response;
  } catch (error) {
    console.error("Lỗi khi gọi API lấy trang rieng:", error);
    throw error;
  }
};

export const getPages = async () => {
  try {
    const response = await instance.get("api/pages");
    if (!response) {
      throw new Error("Không thể lấy danh sách trang");
    }

    return response;
  } catch (error) {
    console.error("Lỗi khi gọi API lấy danh sách trang:", error);
    throw error;
  }
};

export const getPageId = async (id: string) => {
  try {
    const response = await instance.get(`api/pages/${id}`);
    if (!response) {
      throw new Error("Không thể lấy trang");
    }

    return response;
  } catch (error) {
    console.error("Lỗi khi gọi API lấy trang:", error);
    throw error;
  }
};
export const getPresignedUrl = async (suffix: string) => {
  try {
    const response = await instance.post("api/assets/presign-link", {
      type: "avatar",
      suffix
    });
    if (!response) {
      throw new Error("Không thể lấy pre-signed URL");
    }
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API lấy pre-signed URL:", error);
    throw error;
  }
};
export const getViewsAsset = async (key: string) => {
  try {
    const response = await instance.get(`api/assets/view-url?key=${key}`);
    if (!response) {
      throw new Error("Không thể lấy URL xem ảnh");
    }
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API lấy URL xem ảnh:", error);
    throw error;
  }
};
