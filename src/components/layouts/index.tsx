import Header from "@/components/layouts/header";
import { FC, PropsWithChildren } from "react";

interface LayoutProps extends PropsWithChildren {
  sectionClassName?: string;
}

export const Layout: FC<LayoutProps> = ({ children, sectionClassName }) => {
  return (
    <div className="h-screen">
      <div className="mx-auto w-full">
        <Header />
      </div>
      <section className={sectionClassName}>{children}</section>
    </div>
  );
};
