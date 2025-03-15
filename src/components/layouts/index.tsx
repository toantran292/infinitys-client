import Header from "@/components/layouts/header";
import { FC, PropsWithChildren } from "react";
import { ProtectedRoute } from "../auth/protected-route";

interface LayoutProps extends PropsWithChildren {
  sectionClassName?: string;
}

const Layout: FC<LayoutProps> = ({ children, sectionClassName }) => {
  return (
    <div className="flex flex-col h-screen max-h-screen">
      <div className="flex mx-auto w-full">
        <Header />
      </div>
      <section className={sectionClassName}>{children}</section>
    </div>
  );
};

export const ProtectedRouteLayout: FC<LayoutProps> = ({ children, sectionClassName }) => {
  return (
    <ProtectedRoute>
      <Layout sectionClassName={sectionClassName}>{children}</Layout>
    </ProtectedRoute>
  );
};
