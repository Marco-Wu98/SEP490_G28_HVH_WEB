'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { User } from '@supabase/supabase-js';
import { ArrowLeft, Star, Camera, Edit } from 'lucide-react';
import { useUpdateOrgProfile } from '@/hooks/features/sys-admin/uc077-update-organization-profile/useUpdateOrgProfile';
import { useViewOrgDetails } from '@/hooks/features/sys-admin/uc076-view-org-details-by-admin/useViewOrgDetails';
import {
  EOrgType,
  ORG_TYPE_LABELS,
  ORG_TYPE_OPTIONS
} from '@/constants/org-type';
import { useUploadFiles } from '@/hooks/features/commons/bucket/useUploadFiles';
import { getFullSupabaseImageUrl } from '@/utils/helpers';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface Props {
  orgId: string;
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null;
}

const statusBadgeClass = (status: string) => {
  if (status === 'Hoạt động' || status === 'ACTIVE') {
    return 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100';
  }
  return 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100';
};

const mapApiStatusToDisplay = (status?: string) => {
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

export default function OrganizationEditPage({
  orgId,
  user,
  userDetails
}: Props) {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const { trigger, isMutating } = useUpdateOrgProfile({ id: orgId, baseUrl });
  const { data: orgData, isLoading } = useViewOrgDetails({
    id: orgId,
    baseUrl
  });

  const [formData, setFormData] = useState({
    name: '',
    orgType: '' as EOrgType,
    dhaRegistered: false,
    orgIntroduction: ''
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const { uploadFileToSignedUrl } = useUploadFiles();
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

  useEffect(() => {
    if (orgData) {
      setFormData({
        name: orgData.name || '',
        orgType: orgData.orgType || EOrgType.OTHER,
        dhaRegistered: orgData.dhaRegistered ?? false,
        orgIntroduction: orgData.orgIntroduction || ''
      });
      // Set initial avatar and cover previews from existing data
      if (orgData.avatarImageUrl) {
        setAvatarPreview(getFullSupabaseImageUrl(orgData.avatarImageUrl));
      }
      if (orgData.coverImageUrl) {
        setCoverPreview(getFullSupabaseImageUrl(orgData.coverImageUrl));
      }
    }
  }, [orgData]);

  const org = useMemo(() => {
    if (!orgData) return null;
    return {
      id: orgData.id,
      name: orgData.name,
      orgType: ORG_TYPE_LABELS[orgData.orgType] || orgData.orgType,
      status: mapApiStatusToDisplay(orgData.status),
      rating: orgData.avgRating ?? 0,
      reviews: orgData.hostedEventCount ?? 0,
      volunteers: orgData.totalHosts ?? 0,
      donations: orgData.creditHour ?? 0,
      location: 'N/A',
      basicInfo: {
        email: orgData.managerEmail || 'N/A',
        founded: orgData.dhaRegistered
          ? 'Đã đăng ký Sở Nội Vụ'
          : 'Chưa đăng ký Sở Nội Vụ',
        yearRegistered: new Date(orgData.createdAt).getFullYear().toString()
      },
      adminInfo: {
        name: orgData.managerName || 'N/A',
        phone: orgData.managerPhone || 'N/A',
        email: orgData.managerEmail || 'N/A',
        cccd: orgData.managerCID || 'N/A'
      }
    };
  }, [orgData]);

  if (isLoading) {
    return (
      <DashboardLayout
        user={user}
        userDetails={userDetails}
        title="Cập nhật tổ chức"
        description="Chỉnh sửa thông tin tổ chức"
      >
        <div className="flex items-center justify-center py-12">
          <p className="text-zinc-600">Đang tải dữ liệu...</p>
        </div>
      </DashboardLayout>
    );
  }

  const updateField = (
    key: keyof typeof formData,
    value: string | boolean | EOrgType
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      const avatarExtension = avatarFile
        ? `.${avatarFile.name.split('.').pop()}`
        : null;
      const coverExtension = coverFile
        ? `.${coverFile.name.split('.').pop()}`
        : null;

      // Prepare request data - send null if no file selected
      const requestData: any = {
        name: formData.name,
        dhaRegistered: formData.dhaRegistered,
        orgType: formData.orgType,
        orgIntroduction: formData.orgIntroduction,
        avatarImageExtension: avatarExtension,
        coverImageExtension: coverExtension
      };

      const response = (await trigger(requestData)) as any;

      // Upload avatar to Supabase ONLY if file is selected and upload URL is provided
      if (avatarFile && response?.avatarUploadUrl) {
        const uploadUrl = response.avatarUploadUrl.startsWith('http')
          ? response.avatarUploadUrl
          : `${SUPABASE_URL?.replace(/\/$/, '')}${response.avatarUploadUrl}`;

        const uploadResult = await uploadFileToSignedUrl(avatarFile, uploadUrl);

        if (!uploadResult?.success) {
          throw new Error(
            uploadResult?.error || 'Không thể upload ảnh đại diện'
          );
        }
      }

      // Upload cover to Supabase ONLY if file is selected and upload URL is provided
      if (coverFile && response?.coverUploadUrl) {
        const uploadUrl = response.coverUploadUrl.startsWith('http')
          ? response.coverUploadUrl
          : `${SUPABASE_URL?.replace(/\/$/, '')}${response.coverUploadUrl}`;

        const uploadResult = await uploadFileToSignedUrl(coverFile, uploadUrl);

        if (!uploadResult?.success) {
          throw new Error(uploadResult?.error || 'Không thể upload ảnh bìa');
        }
      }

      toast.success('Cập nhật thành công', {
        description: 'Thông tin tổ chức đã được cập nhật.'
      });

      // Redirect immediately - detail page will fetch fresh data
      router.push(`/dashboard/organizations/${orgId}`);
    } catch (error: any) {
      console.error('❌ [organizations/edit] Error:', error);

      let errorMessage = 'Đã có lỗi xảy ra khi cập nhật tổ chức.';

      if (error?.message) {
        errorMessage = error.message;
      }

      if (error?.moreInfo) {
        const validationErrors = Object.entries(error.moreInfo)
          .filter(([key]) => key !== 'business')
          .map(([, value]) => value)
          .join('. ');
        if (validationErrors) {
          errorMessage = validationErrors;
        }
      }

      toast.error('Cập nhật thất bại', {
        description: errorMessage
      });
    }
  };

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleCoverClick = () => {
    coverInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DashboardLayout
      user={user}
      userDetails={userDetails}
      title="Cập nhật tổ chức"
      description="Chỉnh sửa thông tin tổ chức"
    >
      <div className="w-full">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push(`/dashboard/organizations/${orgId}`)}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Quay lại chi tiết tổ chức</span>
          </button>
        </div>

        {/* Organization Header Card */}
        <Card className="mb-6 border-zinc-200 bg-white p-0 text-zinc-900 shadow-sm overflow-hidden">
          {/* Cover Image */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
            {coverPreview && (
              <img
                src={coverPreview}
                alt="Cover"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <button
              onClick={handleCoverClick}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-colors"
            >
              <Camera className="h-5 w-5 text-zinc-700" />
            </button>
            <input
              type="file"
              ref={coverInputRef}
              onChange={handleCoverChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Avatar and Info */}
          <div className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6 -mt-12 md:-mt-8">
              <div className="relative inline-block">
                <div
                  onClick={handleAvatarClick}
                  className="cursor-pointer h-32 w-32 md:h-40 md:w-40 rounded-2xl border-4 border-white shadow-lg bg-zinc-200 flex items-center justify-center overflow-hidden"
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const fallback = (
                          e.target as HTMLImageElement
                        ).parentElement?.querySelector('.avatar-fallback');
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <p
                    className={`text-3xl font-bold text-zinc-500 avatar-fallback ${avatarPreview ? 'hidden' : ''}`}
                  >
                    {getInitials(org?.name || '')}
                  </p>
                </div>
                <button
                  onClick={handleAvatarClick}
                  className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 rounded-full p-2 shadow-md transition-colors"
                >
                  <Camera className="h-4 w-4 text-white" />
                </button>
                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h1 className="text-2xl font-bold leading-snug tracking-tight text-zinc-900 md:text-3xl">
                      {org?.name}
                    </h1>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge className={statusBadgeClass(org?.status)}>
                        {org?.status}
                      </Badge>
                      <Badge className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">
                        {org?.location}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  {renderStars(org?.rating || 0)}
                  <span className="ml-2 text-sm font-medium text-zinc-600">
                    {org?.rating}
                  </span>
                  <span className="text-sm text-zinc-400">
                    ({formatNumberVi(org?.reviews || 0)} sự kiện đã tổ chức)
                  </span>
                </div>
              </div>

              <div className="w-full md:w-[260px] md:shrink-0 md:border-l md:border-zinc-200 md:pl-6 md:flex md:flex-col md:justify-center">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-1 md:gap-6">
                  <div className="text-center md:text-left">
                    <p className="text-xs text-zinc-500 md:text-sm">Số host</p>
                    <p className="mt-1 text-2xl font-bold leading-none text-zinc-900 md:text-3xl">
                      {formatNumberVi(org?.volunteers || 0)}
                    </p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-xs text-zinc-500 md:text-sm">
                      Số giờ uy tín
                    </p>
                    <p className="mt-1 text-2xl font-bold leading-none text-zinc-900 md:text-3xl">
                      {formatNumberVi(org?.donations || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Basic Info and Admin Info */}
        <div className="mb-6 grid gap-6 md:grid-cols-2">
          {/* Basic Info */}
          <Card className="border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold leading-snug tracking-tight text-zinc-900 md:text-2xl">
              Thông tin cơ bản
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <p className="mb-2 text-sm text-zinc-600">Tên tổ chức</p>
                <Input
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="border-zinc-200 bg-white text-zinc-900"
                />
              </div>
              <div>
                <p className="mb-2 text-sm text-zinc-600">Loại hình tổ chức</p>
                <Select
                  value={formData.orgType}
                  onValueChange={(value) =>
                    updateField('orgType', value as EOrgType)
                  }
                >
                  <SelectTrigger className="border-zinc-200 bg-white text-zinc-900">
                    <SelectValue placeholder="Chọn loại hình tổ chức" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORG_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-600">Đăng ký Sở Nội Vụ</p>
                <Switch
                  checked={formData.dhaRegistered}
                  onCheckedChange={(checked) =>
                    updateField('dhaRegistered', checked)
                  }
                />
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sm text-zinc-500">Email tổ chức:</span>
                <span className="text-sm text-zinc-700">
                  {org?.basicInfo.email}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sm text-zinc-500">Năm đăng ký:</span>
                <span className="text-sm text-zinc-700">
                  {org?.basicInfo.yearRegistered}
                </span>
              </div>
            </div>
          </Card>

          {/* Admin Info */}
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
                  {org?.adminInfo.name}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sm text-zinc-500">
                  Số giấy tờ tùy thân:
                </span>
                <span className="text-sm text-zinc-700">
                  {org?.adminInfo.cccd}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sm text-zinc-500">Số điện thoại:</span>
                <span className="text-sm text-zinc-700">
                  {org?.adminInfo.phone}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sm text-zinc-500">Email liên hệ:</span>
                <span className="text-sm text-zinc-700">
                  {org?.adminInfo.email}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Organization Introduction */}
        <Card className="mb-6 border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold leading-snug tracking-tight text-zinc-900 md:text-2xl">
            Giới thiệu tổ chức
          </h2>
          <div className="mt-4">
            <Textarea
              value={formData.orgIntroduction}
              onChange={(e) => updateField('orgIntroduction', e.target.value)}
              className="border-zinc-200 bg-white text-zinc-900 min-h-28"
              placeholder="Nhập giới thiệu về tổ chức..."
            />
          </div>
        </Card>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            className="border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50"
            onClick={() => router.push(`/dashboard/organizations/${orgId}`)}
          >
            Hủy
          </Button>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSave}
            disabled={isMutating}
          >
            {isMutating ? 'Đang lưu...' : 'Lưu cập nhật'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
