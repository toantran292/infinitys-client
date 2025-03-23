"use client";
import { UserMenu } from "@/components/layouts/user-menu";
import { SearchBar } from "@/components/ui/search-bar";
import { BellIcon, BookIcon, HomeIcon, MessageSquareIcon, BriefcaseIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { NotificationBell } from '@/components/notification';
import { useNotification } from '@/contexts/NotificationContext';
import Link from "next/link";

export const Header = () => {
  const [elementFocused, setElementFocused] = useState<number | null>(null);
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const { unreadCount } = useNotification();

  const dataButtons = [
    { label: "Trang Chủ", href: "/", icon: HomeIcon },
    { label: "Bài tập", href: "/problems", icon: BookIcon },
    { label: "Việc làm", href: "/jobs", icon: BriefcaseIcon },
    { label: "Nhắn tin", href: "/chat", icon: MessageSquareIcon },
    {
      label: "Thông báo",
      href: "#",
      icon: BellIcon,
      onClick: () => setIsOpenNotification(!isOpenNotification),
      badge: unreadCount > 0 ? unreadCount : null,
      component: <NotificationBell isOpen={isOpenNotification} setIsOpen={setIsOpenNotification} />
    }
  ];

  const handleHoverButton = (index: number | null) => {
    setElementFocused(index);
  };

  return (
    <header className="flex items-center justify-between h-[72px] px-4">
      <div className="flex items-center gap-2">
        <h1 className="text-gray-500 font-bold text-xl">InfinityS</h1>
        <SearchBar />
      </div>

      <div className="flex items-center gap-4">
        <nav
          className="flex flex-row gap-4"
          onMouseLeave={() => handleHoverButton(null)}
        >
          {dataButtons.map((button, index) => {
            const Icon = button.icon;
            return (
              <div
                key={button.label}
                className="relative"
              >
                {button.href !== "#" ? (
                  <Link href={button.href}>
                    <button
                      className="relative w-fit whitespace-nowrap rounded px-2 py-1 flex flex-col justify-center items-center"
                      onMouseEnter={() => handleHoverButton(index)}
                    >
                      <div className="relative">
                        <Icon className="text-neutral-500" size={20} />
                        {button.badge && (
                          <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform bg-red-600 rounded-full">
                            {button.badge}
                          </span>
                        )}
                      </div>
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
                    </button>
                  </Link>
                ) : (
                  <button
                    onClick={button.onClick}
                    className="relative w-fit whitespace-nowrap rounded px-2 py-1 flex flex-col justify-center items-center"
                    onMouseEnter={() => handleHoverButton(index)}
                  >
                    <div className="relative">
                      <Icon className="text-neutral-500" size={20} />
                      {button.badge && (
                        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform bg-red-600 rounded-full">
                          {button.badge}
                        </span>
                      )}
                    </div>
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
                  </button>
                )}
                {button.component}
              </div>
            );
          })}
          <UserMenu />
        </nav>
      </div>
    </header>
  );
};

export default Header;
