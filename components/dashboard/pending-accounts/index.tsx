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

interface PendingAccountItem {
  id: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  cid: string | null;
  status: string | null;
  createdAt: string | null;
}

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null;
  accounts: PendingAccountItem[];
}

const mockPendingAccounts: PendingAccountItem[] = [
  {
    id: 'mock-1',
    fullName: 'Nguyễn Thị Mai',
    email: 'mai.nguyen@example.com',
    phone: '0912345678',
    cid: '012345678901',
    status: 'PENDING',
    createdAt: '2026-02-10T08:30:00Z'
  },
  {
    id: 'mock-2',
    fullName: 'Trần Minh Quân',
    email: 'quan.tran@example.com',
    phone: '0987654321',
    cid: '098765432109',
    status: 'PENDING',
    createdAt: '2026-02-08T09:00:00Z'
  },
  {
    id: 'mock-3',
    fullName: 'Lê Ngọc Anh',
    email: 'anh.le@example.com',
    phone: '0901222333',
    cid: '123456789012',
    status: 'PENDING',
    createdAt: '2026-02-05T14:20:00Z'
  }
];

const formatDate = (value?: string | null) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('vi-VN');
};

export default function PendingAccounts({
  user,
  userDetails,
  accounts
}: Props) {
  const effectiveAccounts =
    accounts.length > 0 ? accounts : mockPendingAccounts;
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredAccounts = useMemo(() => {
    const searchTerm = searchQuery.toLowerCase();
    return effectiveAccounts.filter((account) => {
      const matchesSearch =
        (account.fullName || '').toLowerCase().includes(searchTerm) ||
        (account.email || '').toLowerCase().includes(searchTerm) ||
        (account.phone || '').toLowerCase().includes(searchTerm) ||
        (account.cid || '').toLowerCase().includes(searchTerm);
      return account.status === 'PENDING' && matchesSearch;
    });
  }, [effectiveAccounts, searchQuery]);

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
                <TableHead className="text-gray-700">Số CCCD</TableHead>
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
                      {account.fullName || 'Chưa cập nhật'}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {account.email || '-'}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {account.cid || '-'}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      Tình nguyện viên
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {formatDate(account.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge className="border-blue-200 bg-blue-50 text-blue-700">
                        {account.status === 'PENDING'
                          ? 'Chờ phê duyệt'
                          : account.status || '-'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
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
