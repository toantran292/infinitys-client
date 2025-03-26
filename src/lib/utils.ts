import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function toVietnamDate(tz: string) {
  return new Date(tz).toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
}