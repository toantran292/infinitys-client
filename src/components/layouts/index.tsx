import Header from "@/components/layouts/header";
import { FC, PropsWithChildren } from "react";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="h-screen">
      <div className="mx-auto w-full">
        <Header />
      </div>
      <main className="max-w-[660px] mx-auto">{children}</main>
    </div>
  );
};
