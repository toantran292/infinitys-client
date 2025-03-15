import { ProtectedRouteLayout } from "@/components/layouts";

export const HomeComponent = () => {
  return (
    <ProtectedRouteLayout>
      <div>content</div>
    </ProtectedRouteLayout>
  );
};
