'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { User } from '@supabase/supabase-js';
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import {
  EOrgType,
  ORG_TYPE_LABELS,
  ORG_TYPE_OPTIONS
} from '@/constants/org-type';
import { useSearchAndViewOrgs } from '@/hooks/features/uc039+uc041-search-org-and-view-org-list-by-admin/useSearchAndViewOrgs';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null;
}

const PAGE_SIZE = 20;

const getAvatarBgColor = () => {
  return 'bg-blue-400';
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export default function OrganizationsPage({ user, userDetails }: Props) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [selectedOrgType, setSelectedOrgType] = useState<'all' | EOrgType>(
    'all'
  );
  const [currentPage, setCurrentPage] = useState(0);

  const selectedOrgTypes = useMemo(
    () => (selectedOrgType === 'all' ? [] : [selectedOrgType]),
    [selectedOrgType]
  );

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;

  const { data, error, isLoading } = useSearchAndViewOrgs({
    pageNumber: currentPage,
    pageSize: PAGE_SIZE,
    name: searchValue,
    orgTypes: selectedOrgTypes,
    baseUrl,
    enabled: true
  });

  const organizations = data?.content ?? [];
  const totalPages = data?.page.totalPages ?? 0;
  const totalElements = data?.page.totalElements ?? 0;

  return (
    <DashboardLayout
      user={user}
      userDetails={userDetails}
      title="Quản lý tổ chức"
      description="Danh sách các tổ chức"
    >
      <div className="w-full">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid flex-1 gap-4 sm:grid-cols-[minmax(0,1fr)_240px]">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">
                Tìm theo tên tổ chức
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setCurrentPage(0);
                  }}
                  placeholder="Tổ chức"
                  className="h-10 border-zinc-200 bg-white pl-9 text-zinc-900 placeholder:text-zinc-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">
                Loại hình tổ chức
              </label>
              <Select
                value={selectedOrgType}
                onValueChange={(value) => {
                  setSelectedOrgType(value as 'all' | EOrgType);
                  setCurrentPage(0);
                }}
              >
                <SelectTrigger className="h-10 border-zinc-200 bg-white text-zinc-900">
                  <SelectValue placeholder="Tất cả loại hình" />
                </SelectTrigger>
                <SelectContent className="border border-zinc-200 bg-white text-zinc-900 shadow-lg">
                  <SelectItem value="all">Tất cả</SelectItem>
                  {ORG_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => router.push('/dashboard/organizations/create')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm mới
            </Button>
            <Button
              variant="outline"
              className="border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50"
              onClick={() => {
                setSearchValue('');
                setSelectedOrgType('all');
                setCurrentPage(0);
              }}
            >
              Đặt lại
            </Button>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-zinc-700">
                Kết quả tìm kiếm
              </p>
              <p className="text-sm text-zinc-500">
                {isLoading
                  ? 'Đang tải dữ liệu...'
                  : `${totalElements} tổ chức được tìm thấy`}
              </p>
            </div>
            {error && (
              <p className="text-sm text-red-500">
                Không thể tải danh sách tổ chức.
              </p>
            )}
          </div>

          <div className="mt-5 grid gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`org-skeleton-${index}`}
                  className="h-28 animate-pulse rounded-xl border border-dashed border-zinc-200 bg-zinc-50"
                />
              ))
            ) : organizations.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-8 text-center text-zinc-500">
                Không có tổ chức nào phù hợp với bộ lọc hiện tại.
              </div>
            ) : (
              organizations.map((org, index) => (
                <Card
                  key={org.id}
                  className="cursor-pointer border-zinc-200 bg-white p-6 text-zinc-900 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md"
                  onClick={() =>
                    router.push(`/dashboard/organizations/${org.id}`)
                  }
                >
                  <div className="flex gap-6">
                    {/* Left and middle section - 3 parts */}
                    <div className="flex gap-6 basis-3/4">
                      {/* Avatar */}
                      <div
                        className={`h-28 w-28 flex-shrink-0 rounded-lg ${getAvatarBgColor()} flex items-center justify-center`}
                      >
                        <p className="text-3xl font-bold text-white">
                          {getInitials(org.name)}
                        </p>
                      </div>

                      {/* Main content */}
                      <div className="min-w-0 flex-1">
                        {/* Organization name */}
                        <p className="text-xl font-bold text-zinc-900">
                          {org.name}
                        </p>

                        {/* Badges row 1 */}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <Badge className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700 text-xs">
                            {org.orgType
                              ? ORG_TYPE_LABELS[org.orgType]
                              : 'Chưa xác định'}
                          </Badge>
                          {org.status && (
                            <Badge className="border-green-200 bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700 text-xs">
                              {org.status === 'ACTIVE'
                                ? 'Hoạt động'
                                : org.status}
                            </Badge>
                          )}
                        </div>

                        {/* ID */}
                        <p className="mt-2 text-xs text-zinc-500">
                          ID: {org.id}
                        </p>

                        {/* Rating */}
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${
                                  i < Math.round(org.avgRating ?? 0)
                                    ? 'text-yellow-400'
                                    : 'text-zinc-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <p className="text-sm font-medium text-zinc-900">
                            {(org.avgRating ?? 0).toFixed(1)}
                          </p>
                        </div>

                        {/* Activity subdomains */}
                        {org.activitySubDomains &&
                          org.activitySubDomains.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {org.activitySubDomains.map((subdomain, idx) => (
                                <Badge
                                  key={idx}
                                  className="border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-100 hover:text-gray-700 text-xs"
                                >
                                  {subdomain}
                                </Badge>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Right side stats - 1 part */}
                    <div className="flex flex-col gap-6 border-l border-zinc-200 pl-6 text-left self-start basis-1/4">
                      <div>
                        <p className="text-sm font-semibold text-zinc-600">
                          Số thành viên
                        </p>
                        <p className="mt-2 text-3xl font-bold text-zinc-900">
                          {(org.hostedEventCount ?? 0).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-600">
                          Số giờ uy tín
                        </p>
                        <p className="mt-2 text-3xl font-bold text-zinc-900">
                          {(org.creditHour ?? 0).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-zinc-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-500">
              Trang {currentPage + 1} / {Math.max(totalPages, 1)}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 0 || isLoading}
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage + 1 >= totalPages || isLoading}
                onClick={() =>
                  setCurrentPage((prev) =>
                    totalPages > 0
                      ? Math.min(totalPages - 1, prev + 1)
                      : prev + 1
                  )
                }
              >
                Sau
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
