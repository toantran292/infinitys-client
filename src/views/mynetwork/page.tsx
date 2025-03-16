"use client";

import MyNetworkManage from "@/views/mynetwork/components/my-net-work-manage";
import { ProtectedRouteLayout } from "@/components/layouts";
import ManageInvitations from "@/views/mynetwork/components/request-manage";

export default function MyNetWorkView() {
  return (
    <ProtectedRouteLayout sectionClassName={"flex gap-4 justify-center pt-4"}>
      <MyNetworkManage />
      <ManageInvitations />
    </ProtectedRouteLayout>
  );
}
