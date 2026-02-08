'use client';

import DashboardLayout from '@/components/layout';
import { User } from '@supabase/supabase-js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null;
}

const mockPendingAccounts = [
  {
    id: 1,
    fullName: 'Nguyễn Thị Mai',
    email: 'mai.nguyen@example.com',
    role: 'Tình nguyện viên',
    submittedDate: '10/02/2026',
    status: 'Chờ phê duyệt'
  },
  {
    id: 2,
    fullName: 'Trần Minh Quân',
    email: 'quan.tran@example.com',
    role: 'Người tổ chức',
    submittedDate: '08/02/2026',
    status: 'Chờ phê duyệt'
  },
  {
    id: 3,
    fullName: 'Lê Ngọc Anh',
    email: 'anh.le@example.com',
    role: 'Tình nguyện viên',
    submittedDate: '05/02/2026',
    status: 'Chờ phê duyệt'
  }
];

export default function PendingAccount({ user, userDetails }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredAccounts = useMemo(() => {
    const searchTerm = searchQuery.toLowerCase();
    return mockPendingAccounts.filter((account) => {
      const matchesSearch =
        account.fullName.toLowerCase().includes(searchTerm) ||
        account.email.toLowerCase().includes(searchTerm) ||
        account.role.toLowerCase().includes(searchTerm);
      return account.status === 'Chờ phê duyệt' && matchesSearch;
    });
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / pageSize));
  const paginatedAccounts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAccounts.slice(startIndex, startIndex + pageSize);
  }, [currentPage, filteredAccounts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <DashboardLayout
      user={user}
      userDetails={userDetails}
      title="Tài khoản chờ phê duyệt"
      description="Danh sách các tài khoản đang chờ phê duyệt"
    >
      <div className="w-full max-w-none">
        <div className="mb-6"></div>

        <div className="mb-6">
          <Input
            placeholder="Tìm kiếm tài khoản..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-blue-200 bg-blue-50"
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 bg-gray-50">
                <TableHead className="text-gray-700">Họ tên</TableHead>
                <TableHead className="text-gray-700">Email</TableHead>
                <TableHead className="text-gray-700">Vai trò</TableHead>
                <TableHead className="text-gray-700">Ngày nộp</TableHead>
                <TableHead className="text-gray-700">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAccounts.length > 0 ? (
                paginatedAccounts.map((account) => (
                  <TableRow
                    key={account.id}
                    className="cursor-pointer border-b border-gray-200 hover:bg-blue-50"
                    onClick={() =>
                      router.push(`/dashboard/pending-accounts/${account.id}`)
                    }
                  >
                    <TableCell className="font-medium text-gray-900">
                      {account.fullName}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {account.email}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {account.role}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {account.submittedDate}
                    </TableCell>
                    <TableCell>
                      <Badge className="border-blue-200 bg-blue-50 text-blue-700">
                        {account.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-gray-500"
                  >
                    Không có tài khoản chờ phê duyệt
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-zinc-500">
            Trang {currentPage} / {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            >
              Trước
            </Button>
            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;
              const isActive = page === currentPage;
              return (
                <Button
                  key={page}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
            >
              Sau
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
