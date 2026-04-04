'use client';

import PendingEventDetail from '@/components/dashboard/pending-events/detail';
import { useViewEventDetailsBySysAdmin } from '@/hooks/features/view-event-details-by-system-admin/useViewEventDetailsBySysAdmin';
import DashboardLayout from '@/components/layout';
import { Card } from '@/components/ui/card';
import { User } from '@supabase/supabase-js';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null;
  id: string;
}

export default function PendingEventDetailContainer({
  user,
  userDetails,
  id
}: Props) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const {
    data,
    error,
    isLoading,
    mutate: refetchEventDetails
  } = useViewEventDetailsBySysAdmin({
    id,
    baseUrl: apiBaseUrl
  });

  if (isLoading) {
    return (
      <DashboardLayout
        user={user}
        userDetails={userDetails}
        title="Chi tiết sự kiện"
        description="Thông tin chi tiết sự kiện chờ phê duyệt"
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
        description="Thông tin chi tiết sự kiện chờ phê duyệt"
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
      onRefetchEventDetails={() => refetchEventDetails()}
    />
  );
}
