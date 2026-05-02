'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  OpenContext,
  UserContext,
  UserDetailsContext
} from '@/contexts/layout';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { FiAlignJustify } from 'react-icons/fi';
import { FiBell } from 'react-icons/fi';
import {
  HiOutlineInformationCircle,
  HiOutlineArrowRightOnRectangle
} from 'react-icons/hi2';
import { useSupabase } from '@/app/supabase-provider';
import { useUnregisterToken } from '@/hooks/features/commons/notification/useUnregisterToken';
import { useGetSysAdmAccountInfo } from '@/hooks/features/sys-admin/uc088-view-profile-by-admin/useGetSysAdmAccountInfo';
import { useGetOrgManagerAccInfo } from '@/hooks/features/org-manager/uc087-view-profile-by-org-manager/useGetOrgManagerAccInfo';
import {
  clearStoredNotificationToken,
  getStoredNotificationToken
} from '@/hooks/use-notification-permission';
import { getFullSupabaseImageUrl } from '@/utils/helpers';
import { useGetNotiUser } from '@/hooks/features/commons/notification/useGetNotiUser';
import { useGetNotiUserTopic } from '@/hooks/features/commons/notification/useGetNotiUserTopic';

export default function HeaderLinks(props: {
  colorVariant?: 'admin' | 'organizer';
  signInPath?: string;
  settingsPath?: string;
  [x: string]: any;
}) {
  const { open, setOpen } = useContext(OpenContext);
  const user = useContext(UserContext);
  const userDetails = useContext(UserDetailsContext);
  const [mounted, setMounted] = useState(false);
  const { supabase } = useSupabase();
  const { trigger: unregisterToken } = useUnregisterToken();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const colorVariant = props.colorVariant ?? 'admin';
  const signInPath =
    props.signInPath ??
    (colorVariant === 'organizer'
      ? '/signin/password_signin'
      : '/dashboard/signin/password_signin');
  const settingsPath = props.settingsPath ?? '/dashboard/settings';
  const onOpen = () => {
    setOpen(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: sysAdmAccountInfo } = useGetSysAdmAccountInfo({
    baseUrl: apiBaseUrl,
    enabled: colorVariant === 'admin'
  });
  const { data: orgManagerAccountInfo } = useGetOrgManagerAccInfo({
    baseUrl: apiBaseUrl,
    enabled: colorVariant === 'organizer'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  
  // Call hooks unconditionally (required by React Hook Rules)
  const notiUserTopicResult = useGetNotiUserTopic({
    baseUrl: apiBaseUrl,
    pageNumber: currentPage,
    pageSize: 5,
    enabled: mounted && isOpen && colorVariant === 'admin'
  });
  const notiUserResult = useGetNotiUser({
    baseUrl: apiBaseUrl,
    pageNumber: currentPage,
    pageSize: 5,
    enabled: mounted && isOpen && colorVariant === 'organizer'
  });
  
  const swrResult = colorVariant === 'admin' 
    ? notiUserTopicResult 
    : notiUserResult;
  const { data: notificationsData } = swrResult;

  
  const profileInfo =
    colorVariant === 'admin' ? sysAdmAccountInfo : orgManagerAccountInfo;

  const rawAvatarUrl =
    profileInfo?.avatarUrl ??
    userDetails?.avatarUrl ??
    userDetails?.avatar_url ??
    userDetails?.avatar ??
    user?.user_metadata?.avatar_url ??
    user?.user_metadata?.avatarUrl ??
    user?.user_metadata?.picture ??
    user?.user_metadata?.avatar ??
    user?.app_metadata?.avatar_url ??
    user?.app_metadata?.picture ??
    '';
  const avatarSrc = rawAvatarUrl
    ? getFullSupabaseImageUrl(String(rawAvatarUrl)) || '/default-avatar.png'
    : '/default-avatar.png';

  const fullName =
    profileInfo?.fullName ??
    userDetails?.fullName ??
    userDetails?.full_name ??
    user?.user_metadata?.full_name ??
    user?.user_metadata?.fullName ??
    user?.user_metadata?.name ??
    user?.user_metadata?.display_name ??
    '';
  const fallbackInitial = fullName
    ? String(fullName).trim().charAt(0).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  const handleSignOut = async (e) => {
    e.preventDefault();

    const token = getStoredNotificationToken();
    if (token) {
      unregisterToken(token)
        .then(() => {
          clearStoredNotificationToken();
        })
        .catch((error) => {
          console.error('Failed to unregister notification token:', error);
        });
    }

    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) {
        console.error('[HeaderLinks] Supabase sign out failed:', error);
      }
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      window.location.assign(signInPath);
    }
  };
  if (!mounted) return null;
  const notiList = notificationsData?.content ?? [];
  const notiCount = notificationsData?.page?.totalElements ?? notiList.length;
  const hasNextPage = (notificationsData?.page?.number ?? 0) < (notificationsData?.page?.totalPages ?? 1);
  const isLastPage = (notificationsData?.page?.number ?? 0) >= (notificationsData?.page?.totalPages ?? 1);

  const handleLoadMore = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleResetPage = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setCurrentPage(1);
    }
  };

  const iconButtonClassName =
    colorVariant === 'organizer'
      ? 'flex h-9 min-w-9 cursor-pointer rounded-full border-[#BFDBFE] bg-[#EFF6FF]/95 p-0 text-xl text-[#1E3A8A] hover:bg-[#DBEAFE] hover:text-[#1D4ED8] md:min-h-10 md:min-w-10'
      : 'flex h-9 min-w-9 cursor-pointer rounded-full border-[#1E2939] bg-[#1A2434]/90 p-0 text-xl text-slate-200 hover:bg-[#1D2737] hover:text-white md:min-h-10 md:min-w-10';
  const menuButtonClassName =
    colorVariant === 'organizer'
      ? `${iconButtonClassName} xl:hidden`
      : `${iconButtonClassName} xl:hidden`;
  const signOutIconClassName =
    colorVariant === 'organizer'
      ? 'h-4 w-4 stroke-2 text-[#1E3A8A]'
      : 'h-4 w-4 stroke-2 text-[#E5ECF5]';

  return (
    <div className="relative flex min-w-max max-w-max flex-grow items-center justify-around gap-1 rounded-lg md:px-2 md:py-2 md:pl-3 xl:gap-2">
      <Button
        variant="outline"
        className={menuButtonClassName}
        onClick={onOpen}
      >
        <FiAlignJustify className="h-4 w-4" />
      </Button>

      <Button
        onClick={(e) => handleSignOut(e)}
        variant="outline"
        className={iconButtonClassName}
      >
        <HiOutlineArrowRightOnRectangle className={signOutIconClassName} />
      </Button>
      <DropdownMenu onOpenChange={handleResetPage}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={iconButtonClassName}>
            <div className="relative">
              <FiBell className="h-4 w-4" />
              {notiCount > 0 && (
                <span className="absolute -top-5 -right-4 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
                  {notiCount > 99 ? '99+' : notiCount}
                </span>
              )}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-[80] w-[320px] max-w-[90vw] bg-white border-gray-200" align="end" sideOffset={5}>
          <DropdownMenuGroup className="max-h-96">
            {notiList.length === 0 ? (
              <DropdownMenuItem>
                <p className="text-sm text-gray-600">Không có thông báo</p>
              </DropdownMenuItem>
            ) : (
              <>
                {notiList.map((n) => (
                  <DropdownMenuItem key={n.notificationId}>
                    <div className="flex w-full flex-col px-1 py-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{n.title ?? 'Thông báo'}</p>
                        <p className="ml-2 text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                      {n.body && <p className="mt-1 text-xs text-gray-700">{n.body}</p>}
                    </div>
                  </DropdownMenuItem>
                ))}
                {hasNextPage && (
                  <DropdownMenuItem>
                    <Button 
                      onClick={handleLoadMore}
                      variant="ghost" 
                      size="sm"
                      className="w-full text-sm text-gray-600 hover:text-gray-900"
                    >
                      Xem thông báo cũ hơn
                    </Button>
                  </DropdownMenuItem>
                )}
                {isLastPage && currentPage > 1 && (
                  <DropdownMenuItem>
                    <p className="text-sm text-gray-500 text-center w-full">Đã hiển thị tất cả thông báo</p>
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Link className="w-full" href={settingsPath}>
        <Avatar className="h-9 min-w-9 md:min-h-10 md:min-w-10">
          <AvatarImage src={avatarSrc} />
          <AvatarFallback className="font-bold">
            {fallbackInitial}
          </AvatarFallback>
        </Avatar>
      </Link>
    </div>
  );
}
