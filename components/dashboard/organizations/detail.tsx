/* eslint-disable @next/next/no-img-element */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { User } from '@supabase/supabase-js';
import { ArrowLeft, Check, Edit, Star, X } from 'lucide-react';
import { useViewOrgDetails } from '@/hooks/features/sys-admin/uc076-view-org-details-by-admin/useViewOrgDetails';
import { ORG_TYPE_LABELS } from '@/constants/org-type-labels';
import type { OrganizationDetail } from '@/hooks/entity';
import { getFullSupabaseImageUrl } from '@/utils/helpers';

interface Props {
  orgId: string;
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null;
}

const statusBadgeClass = (status: OrganizationDetail['status']) => {
  if (status === 'Hoạt động') {
    return 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100';
  }
  return 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100';
};

const mapApiStatusToDisplay = (
  status?: string
): OrganizationDetail['status'] => {
  return status === 'INACTIVE' ? 'Ngừng hoạt động' : 'Hoạt động';
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const GMAIL_AVATAR_BG = [
  'bg-[#1a73e8]',
  'bg-[#0b8043]',
  'bg-[#d93025]',
  'bg-[#f29900]',
  'bg-[#7b1fa2]',
  'bg-[#00897b]'
];

const getAvatarBgClass = (name: string) => {
  const value = (name || 'ORG').trim();
  const index = value.charCodeAt(0) % GMAIL_AVATAR_BG.length;
  return GMAIL_AVATAR_BG[index];
};

const renderStars = (rating: number) => {
  const fullStars = Math.round(rating);
  return Array.from({ length: 5 }).map((_, index) => (
    <Star
      key={`star-${index}`}
      className={`h-4 w-4 ${
        index < fullStars ? 'text-yellow-500' : 'text-zinc-300'
      }`}
      fill={index < fullStars ? 'currentColor' : 'none'}
    />
  ));
};

const formatNumberVi = (value: unknown) => {
  const numberValue =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number(value)
        : NaN;

  const safeValue = Number.isFinite(numberValue) ? numberValue : 0;
  return safeValue.toLocaleString('vi-VN');
};

export default function OrganizationDetailPage({
  orgId,
  user,
  userDetails
}: Props) {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;

  const {
    data: orgData,
    isLoading,
    error
  } = useViewOrgDetails({ id: orgId, baseUrl });

  const org = useMemo(() => {
    if (!orgData) return null;

    const legacyOrgData = orgData as {
      totalHonorHours?: number;
      creditHour?: number;
      avgRating?: number;
      hostedEventCount?: number;
      status?: string;
    };

    return {
      id: orgData.id,
      name: orgData.name,
      taxCode: orgData.managerCID || '',
      location: 'N/A',
      orgType: ORG_TYPE_LABELS[orgData.orgType] || orgData.orgType,
      status: mapApiStatusToDisplay(legacyOrgData.status),
      rating: legacyOrgData.avgRating ?? 0,
      reviews: legacyOrgData.hostedEventCount ?? 0,
      volunteers: orgData.totalHosts ?? 0,
      donations: legacyOrgData.creditHour ?? legacyOrgData.totalHonorHours ?? 0,
      imageUrl: getFullSupabaseImageUrl(orgData.avatarImageUrl),
      introduction: orgData.orgIntroduction || 'Chưa có thông tin giới thiệu.',
      applicationReason: '',
      basicInfo: {
        email: orgData.managerEmail || 'N/A',
        address: 'Không có thông tin',
        founded: orgData.dhaRegistered
          ? 'Đã đăng ký Sở Nội Vụ'
          : 'Chưa đăng ký Sở Nội Vụ',
        taxCode: orgData.managerCID || 'N/A',
        yearRegistered: new Date(orgData.createdAt).getFullYear().toString()
      },
      adminInfo: {
        name: orgData.managerName || 'N/A',
        position: 'Quản lý tổ chức',
        phone: orgData.managerPhone || 'N/A',
        email: orgData.managerEmail || 'N/A',
        cccd: orgData.managerCID || 'N/A'
      },
      registrationImages: (orgData.legalDocumentUrls || []).map((url) =>
        getFullSupabaseImageUrl(url)
      ),
      supportingDocuments: (orgData.otherEvidencesUrls || []).map((url) =>
        getFullSupabaseImageUrl(url)
      ),
      note: orgData.note || ''
    };
  }, [orgData]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  return (
    <DashboardLayout
      user={user}
      userDetails={userDetails}
      title="Chi tiết Tổ chức"
      description=""
    >
      <div className="w-full">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600 mx-auto"></div>
              <p className="text-zinc-600">Đang tải thông tin tổ chức...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Card className="border-red-200 bg-red-50 p-6">
            <p className="text-red-700">
              Không thể tải thông tin tổ chức. Vui lòng thử lại.
            </p>
            <Button
              className="mt-4 bg-red-600 hover:bg-red-700"
              onClick={() => window.location.reload()}
            >
              Tải lại
            </Button>
          </Card>
        )}

        {/* Content */}
        {!isLoading && org && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Chi tiết Tổ chức</span>
              </button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() =>
                  router.push(`/dashboard/organizations/${orgId}/edit`)
                }
              >
                <Edit className="mr-2 h-4 w-4" />
                Cập nhật
              </Button>
            </div>

            {/* Organization Header Card */}
            <Card className="mb-6 overflow-hidden border-zinc-200 bg-white p-0 text-zinc-900 shadow-sm">
              {/* Cover Image */}
              <div className="relative min-h-64 bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 md:min-h-80">
                {orgData.coverImageUrl ? (
                  <img
                    src={getFullSupabaseImageUrl(orgData.coverImageUrl)}
                    alt="Cover"
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
              </div>

              {/* Avatar and Info */}
              <div className="px-6 py-6 md:px-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-6">
                  <div className="relative -mt-16 md:-mt-24 md:shrink-0">
                    <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-zinc-200 shadow-lg md:h-40 md:w-40">
                      {org.imageUrl ? (
                        <img
                          src={org.imageUrl}
                          alt="Avatar"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              'none';
                            const fallback = (
                              e.target as HTMLImageElement
                            ).parentElement?.querySelector('.avatar-fallback');
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <p
                        className={`avatar-fallback absolute inset-0 flex items-center justify-center text-3xl font-semibold text-white ${getAvatarBgClass(org.name)} ${org.imageUrl ? 'hidden' : ''}`}
                      >
                        {getInitials(org.name)}
                      </p>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h1 className="text-2xl font-bold leading-snug tracking-tight text-zinc-900 md:text-3xl">
                          {org.name}
                        </h1>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <Badge className={statusBadgeClass(org?.status)}>
                            {org?.status}
                          </Badge>
                          <Badge className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">
                            {org.location}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {renderStars(org.rating)}
                      <span className="ml-1 text-sm font-medium text-zinc-600">
                        {org.rating}
                      </span>
                      <span className="text-sm text-zinc-400">
                        ({formatNumberVi(org.reviews)} sự kiện đã tổ chức)
                      </span>
                    </div>
                  </div>

                  <div className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 md:w-[260px] md:shrink-0 md:border-l md:border-zinc-200 md:bg-transparent md:px-6 md:py-2 md:pl-6 md:pr-0 md:flex md:flex-col md:justify-center">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-1 md:gap-6">
                      <div className="text-center md:text-left">
                        <p className="text-xs text-zinc-500 md:text-sm">
                          Số host
                        </p>
                        <p className="mt-1 text-2xl font-bold leading-none text-zinc-900 md:text-3xl">
                          {formatNumberVi(org.volunteers)}
                        </p>
                      </div>
                      <div className="text-center md:text-left">
                        <p className="text-xs text-zinc-500 md:text-sm">
                          Số giờ uy tín
                        </p>
                        <p className="mt-1 text-2xl font-bold leading-none text-zinc-900 md:text-3xl">
                          {formatNumberVi(org.donations)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Basic Info and Admin Info */}
            <div className="mb-6 grid gap-6 md:grid-cols-2">
              <Card className="border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold leading-snug tracking-tight text-zinc-900 md:text-2xl">
                  Thông tin cơ bản
                </h2>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-sm text-zinc-500">
                      Loại hình tổ chức:
                    </span>
                    <span className="text-sm text-zinc-700">{org.orgType}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-sm text-zinc-500">
                      Email tổ chức:
                    </span>
                    <span className="text-sm text-zinc-700">
                      {org.basicInfo.email}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-sm text-zinc-500">
                      Đăng ký Sở Nội Vụ:
                    </span>
                    <span className="text-sm text-zinc-700">
                      {org.basicInfo.founded}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-sm text-zinc-500">Năm đăng ký:</span>
                    <span className="text-sm text-zinc-700">
                      {org.basicInfo.yearRegistered}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold leading-snug tracking-tight text-zinc-900 md:text-2xl">
                  Thông tin quản trị viên
                </h2>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-sm text-zinc-500">
                      Tên quản trị viên:
                    </span>
                    <span className="text-sm text-zinc-700">
                      {org.adminInfo.name}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-sm text-zinc-500">
                      Số giấy tờ tùy thân:
                    </span>
                    <span className="text-sm text-zinc-700">
                      {org.adminInfo.cccd}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-sm text-zinc-500">
                      Số điện thoại:
                    </span>
                    <span className="text-sm text-zinc-700">
                      {org.adminInfo.phone}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-sm text-zinc-500">
                      Email liên hệ:
                    </span>
                    <span className="text-sm text-zinc-700">
                      {org.adminInfo.email}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="mb-6 border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold leading-snug tracking-tight text-zinc-900 md:text-2xl">
                Giới thiệu tổ chức
              </h2>
              <p className="mt-4 text-sm text-zinc-700 leading-relaxed">
                {org.introduction}
              </p>
            </Card>

            <Card className="mb-6 border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold leading-snug tracking-tight text-zinc-900 md:text-2xl">
                Giấy tờ pháp lý
              </h2>
              <div className="mt-4 relative">
                <Carousel className="w-full">
                  <CarouselContent>
                    {org.registrationImages.map((image, index) => (
                      <CarouselItem
                        key={index}
                        className="md:basis-1/3 lg:basis-1/4"
                      >
                        <div
                          onClick={() => {
                            setSelectedImage(image);
                            setSelectedImages(org.registrationImages);
                          }}
                          className="h-48 cursor-pointer overflow-hidden rounded-lg bg-zinc-100 transition-transform hover:scale-105"
                        >
                          <img
                            src={image}
                            alt={`Registration document ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
                </Carousel>
              </div>
            </Card>

            {/* Supporting Documents */}
            <Card className="border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold leading-snug tracking-tight text-zinc-900 md:text-2xl">
                Tài liệu liên quan khác
              </h2>
              <div className="mt-4 relative">
                <Carousel className="w-full">
                  <CarouselContent>
                    {org.supportingDocuments.map((doc, index) => (
                      <CarouselItem
                        key={index}
                        className="md:basis-1/3 lg:basis-1/4"
                      >
                        <div
                          onClick={() => {
                            setSelectedImage(doc);
                            setSelectedImages(org.supportingDocuments);
                          }}
                          className="h-48 cursor-pointer overflow-hidden rounded-lg bg-zinc-100 transition-transform hover:scale-105"
                        >
                          <img
                            src={doc}
                            alt={`Supporting document ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
                </Carousel>
              </div>
            </Card>

            {/* Note */}
            <Card className="mt-6 mb-6 border-l-4 border-amber-400 bg-amber-50 p-6 shadow-sm">
              <h2 className="text-xl font-semibold leading-snug tracking-tight text-amber-900 md:text-2xl">
                Ghi chú
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm font-medium leading-relaxed text-amber-900">
                {org.note?.trim() ? org.note : '_'}
              </p>
            </Card>

            {/* Image Zoom Dialog */}
            <Dialog
              open={selectedImage !== null}
              onOpenChange={(open) => !open && setSelectedImage(null)}
            >
              <DialogContent
                className="w-screen h-screen max-w-none bg-transparent p-0 border-none flex items-center justify-center cursor-pointer"
                onClick={() => setSelectedImage(null)}
              >
                <div
                  className="relative inline-block"
                  onClick={(e) => e.stopPropagation()}
                >
                  {selectedImage && (
                    <>
                      <img
                        src={selectedImage}
                        alt="Zoomed document"
                        className="max-h-[90vh] max-w-[90vw] w-auto h-auto object-contain"
                      />
                      <DialogClose className="absolute -right-4 -top-4 rounded-full bg-white p-2 text-black hover:bg-gray-200">
                        <X className="h-6 w-6" />
                      </DialogClose>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
