'use client';

import { ProtectedRouteLayout } from "@/components/layouts";
import { useNotification } from "@/contexts/NotificationContext";
import { Button } from "@/components/ui/button";
export const HomeComponent = () => {
  const { test } = useNotification();

  return (
    <ProtectedRouteLayout>
      <div>content</div>
      <Button onClick={test}>test</Button>
    </ProtectedRouteLayout>
  );
};
