"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/ui/search-bar";
import { HomeIcon, BookIcon, MessageSquareIcon, BellIcon } from "lucide-react";
import { UserMenu } from "@/components/layouts/user-menu";

const dataButtons = [
  { label: "Trang Chủ", href: "/home", icon: HomeIcon },
  { label: "Bài tập", href: "/problems", icon: BookIcon },
  { label: "Nhắn tin", href: "/chat", icon: MessageSquareIcon },
  { label: "Thông báo", href: "/notifications", icon: BellIcon }
];

export const Header = () => {
  const [elementFocused, setElementFocused] = useState<number | null>(null);

  const handleHoverButton = (index: number | null) => {
    setElementFocused(index);
  };

  return (
    <div className="w-full flex justify-between items-center border-b py-4 px-8">
      <div className="flex items-center gap-2 font-bold text-xl">
        <h1 className="text-neutral-500">InfinityS</h1>
        <SearchBar />
      </div>

      <nav
        className="flex flex-row gap-4"
        onMouseLeave={() => handleHoverButton(null)}
      >
        {dataButtons.map((button, index) => {
          const Icon = button.icon;
          return (
            <Link
              href={button.href}
              key={button.label}
              className="relative w-fit whitespace-nowrap rounded px-2 py-1 flex flex-col justify-center items-center"
              onMouseEnter={() => handleHoverButton(index)}
            >
              <Icon className="text-neutral-500" size={20} />
              <p className="font-medium text-neutral-500 text-[10px]">
                {button.label}
              </p>
              <AnimatePresence>
                {elementFocused === index && (
                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    className="-z-10 absolute top-0 right-0 bottom-0 left-0 rounded-md bg-neutral-200 dark:bg-neutral-800"
                    exit={{ opacity: 0, scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    layout
                    layoutId="focused-element"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
            </Link>
          );
        })}
        <UserMenu />
      </nav>
    </div>
  );
};

export default Header;
