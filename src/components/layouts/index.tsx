'use client';

import Header from "@/components/layouts/header";
import { FC, PropsWithChildren } from "react";
import { ProtectedRoute } from "../auth/protected-route";

interface LayoutProps extends PropsWithChildren {
  sectionClassName?: string;
}

const Layout: FC<LayoutProps> = ({ children, sectionClassName }) => {
  return (
    <div className="min-h-screen bg-[#f4f2ee]">
      {/* Header cố định */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="max-w-[1128px] mx-auto">
          <Header />
        </div>
      </div>

      {/* Main content với padding-top để tránh header */}
      <main className="pt-[72px] min-h-screen">
        <div className={`max-w-[1128px] mx-auto ${sectionClassName}`}>
          {children}
        </div>
      </main>
    </div>
  );
};

const FullWidthLayout: FC<LayoutProps> = ({
  children,
  sectionClassName
}) => {
  return (
    <div className="min-h-screen bg-[#f4f2ee]">
      {/* Header cố định */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="max-w-[1128px] mx-auto">
          <Header />
        </div>
      </div>

      {/* Main content với padding-top để tránh header */}
      <main className="pt-[72px] min-h-screen">
        <div className={`${sectionClassName}`}>
          {children}
        </div>
      </main>
    </div>
  );
}

export const ProtectedRouteLayout: FC<LayoutProps> = ({
  children,
  sectionClassName
}) => {
  return (
    <ProtectedRoute>
      <Layout sectionClassName={sectionClassName}>{children}</Layout>
    </ProtectedRoute>
  );
};

export const FullWidthProtectedRouteLayout: FC<LayoutProps> = ({
  children,
  sectionClassName
}) => {
  return (
    <ProtectedRoute>
      <FullWidthLayout sectionClassName={sectionClassName}>{children}</FullWidthLayout>
    </ProtectedRoute>
  );
}
