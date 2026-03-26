'use client';

import DashboardLayout from '@/components/layout';
import PendingEventDetail from '@/components/dashboard/pending-events/detail';
import { useViewApprovedEventDetailsByOrgManager } from "@/hooks/features/uc082-view-organization's-approval-events/useViewApprovedEventDetailsByOrgManager";
import { Card } from '@/components/ui/card';
import { User } from '@supabase/supabase-js';

interface Props {
  user: User | null | undefined;
  userDetails: Record<string, any> | null;
  id: string;
  routes?: any;
  colorVariant?: 'admin' | 'organizer';
  signInPath?: string;
}

export default function ApprovedEventDetailContainer({
  user,
  userDetails,
  id,
  routes,
  colorVariant = 'organizer',
  signInPath = '/signin/password_signin'
}: Props) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const { data, error, isLoading } = useViewApprovedEventDetailsByOrgManager({
    id,
    baseUrl: apiBaseUrl
  });

  if (isLoading) {
    return (
      <DashboardLayout
        user={user}
        userDetails={userDetails}
        title="Chi tiết sự kiện"
        description="Thông tin chi tiết sự kiện đã phê duyệt"
        routes={routes}
        colorVariant={colorVariant}
        signInPath={signInPath}
      >
        <div className="w-full">
          <Card className="border-zinc-200 bg-white p-6 text-zinc-900 shadow-sm">
            <p className="text-zinc-600">Đang tải dữ liệu...</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout
        user={user}
        userDetails={userDetails}
        title="Chi tiết sự kiện"
        description="Không thể tải dữ liệu sự kiện đã phê duyệt"
        routes={routes}
        colorVariant={colorVariant}
        signInPath={signInPath}
      >
        <div className="w-full">
          <Card className="border-zinc-200 bg-white p-6 text-zinc-900 shadow-sm">
            <p className="text-red-600">Không thể tải dữ liệu.</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <PendingEventDetail
      user={user}
      userDetails={userDetails}
      externalData={data}
      externalIsLoading={isLoading}
      externalError={error}
      backBasePath="/organizer/approved-events"
      routes={routes}
      colorVariant={colorVariant}
      signInPath={signInPath}
      pageDescription="Thông tin chi tiết sự kiện đã phê duyệt"
      infoText="Thông tin chi tiết sự kiện đã phê duyệt"
      showActions={false}
      showApprovedActions={true}
      showHostInfo={true}
    />
  );
}
