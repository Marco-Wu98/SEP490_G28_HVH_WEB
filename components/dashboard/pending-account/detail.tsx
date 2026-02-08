'use client';

import DashboardLayout from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null;
  accountId: string;
}

const mockPendingAccounts = [
  {
    id: '1',
    fullName: 'Nguyễn Thị Mai',
    email: 'mai.nguyen@example.com',
    role: 'Tình nguyện viên',
    phone: '0912 345 678',
    submittedDate: '10/02/2026',
    status: 'Chờ phê duyệt',
    address: 'Quận 1, TP.HCM',
    notes: 'Đăng ký tham gia các chương trình môi trường.'
  },
  {
    id: '2',
    fullName: 'Trần Minh Quân',
    email: 'quan.tran@example.com',
    role: 'Người tổ chức',
    phone: '0987 654 321',
    submittedDate: '08/02/2026',
    status: 'Chờ phê duyệt',
    address: 'Quận 7, TP.HCM',
    notes: 'Cần phê duyệt tổ chức mới.'
  },
  {
    id: '3',
    fullName: 'Lê Ngọc Anh',
    email: 'anh.le@example.com',
    role: 'Tình nguyện viên',
    phone: '0901 222 333',
    submittedDate: '05/02/2026',
    status: 'Chờ phê duyệt',
    address: 'Hà Nội',
    notes: 'Quan tâm đến các hoạt động giáo dục.'
  }
];

export default function PendingAccountDetail({
  user,
  userDetails,
  accountId
}: Props) {
  const router = useRouter();
  const account = mockPendingAccounts.find((item) => item.id === accountId);

  return (
    <DashboardLayout
      user={user}
      userDetails={userDetails}
      title="Chi tiết tài khoản"
      description="Thông tin chi tiết tài khoản chờ phê duyệt"
    >
      <div className="w-full">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mt-2 text-gray-600">
              Thông tin chi tiết tài khoản chờ phê duyệt
            </p>
          </div>
          <Button
            variant="outline"
            className="border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
            onClick={() => router.push('/dashboard/pending-accounts')}
          >
            Quay lại
          </Button>
        </div>

        {!account ? (
          <Card className="border-zinc-200 bg-white p-6 dark:border-zinc-800">
            <p className="text-gray-600">Không tìm thấy tài khoản.</p>
          </Card>
        ) : (
          <Card className="border-zinc-200 p-6 dark:border-zinc-800">
            <div className="grid gap-6">
              <div className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 md:grid-cols-2">
                <div className="md:col-span-2">
                  <p className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                    Thông tin chung
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600">Họ tên</p>
                  <p className="mt-1 text-gray-700">{account.fullName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600">Email</p>
                  <p className="mt-1 text-gray-700">{account.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600">Vai trò</p>
                  <p className="mt-1 text-gray-700">{account.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600">
                    Số điện thoại
                  </p>
                  <p className="mt-1 text-gray-700">{account.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600">Địa chỉ</p>
                  <p className="mt-1 text-gray-700">{account.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600">Ngày nộp</p>
                  <p className="mt-1 text-gray-700">{account.submittedDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600">Trạng thái</p>
                  <Badge className="mt-1 border-zinc-200 bg-blue-50 text-blue-700 dark:border-zinc-800">
                    {account.status}
                  </Badge>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-red-600">Ghi chú</p>
                  <p className="mt-1 text-gray-700">{account.notes}</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                <Button variant="outline">Từ chối</Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Phê duyệt
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
