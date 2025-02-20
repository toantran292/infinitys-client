import Header from "@/components/layouts/header";
import { FC, PropsWithChildren } from "react";

interface LayoutProps extends PropsWithChildren {
  sectionClassName?: string;
}

export const Layout: FC<LayoutProps> = ({ children, sectionClassName }) => {
  return (
    <div className="flex flex-col h-screen max-h-screen">
      <div className="flex mx-auto w-full">
        <Header />
      </div>
      <section className={sectionClassName}>{children}</section>
    </div>
  );
};
