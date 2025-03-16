"use client";

import MyNetworkManage from "@/views/mynetwork/components/my-net-work-manage";
import { ProtectedRouteLayout } from "@/components/layouts";
import ManageInvitations from "@/views/mynetwork/components/request-manage";

export default function MyNetWorkView() {
  return <ProtectedRouteLayout sectionClassName={"flex gap-4 justify-center pt-4 bg-[#f0f2f5]"}>
    <MyNetworkManage />
    <ManageInvitations />
  </ProtectedRouteLayout>

}
