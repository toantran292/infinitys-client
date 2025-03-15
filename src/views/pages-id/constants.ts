export const TABS = [
    { key: "home", label: "Trang chủ" },
    { key: "about", label: "Giới thiệu" },
    { key: "posts", label: "Bài đăng" },
    { key: "jobs", label: "Việc làm" },
    { key: "people", label: "Người" }
] as const;

export type TabKey = typeof TABS[number]["key"]; 