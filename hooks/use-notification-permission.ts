'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { requestFirebaseToken } from '@/lib/firebase';
import { useRegisterToken } from '@/hooks/features/commons/notification/use-register-token';

type NotificationPermission = 'granted' | 'denied' | 'default' | 'unsupported';

interface UseNotificationPermissionResult {
  permission: NotificationPermission;
  isSupported: boolean;
  requestPermission: () => Promise<{
    permission: NotificationPermission;
    token: string | null;
  }>;
  isLoading: boolean;
  isMounted: boolean;
}

const NOTIFICATION_DEVICE_ID_KEY = 'notification_device_id';

const getOrCreateDeviceId = (): string => {
  if (typeof window === 'undefined') {
    return '';
  }

  const existingDeviceId = window.localStorage.getItem(
    NOTIFICATION_DEVICE_ID_KEY
  );
  if (existingDeviceId) {
    return existingDeviceId;
  }

  const newDeviceId =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  window.localStorage.setItem(NOTIFICATION_DEVICE_ID_KEY, newDeviceId);
  return newDeviceId;
};

/**
 * Hook để yêu cầu quyền thông báo và lấy Firebase token
 */
export function useNotificationPermission(): UseNotificationPermissionResult {
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { trigger: registerToken } = useRegisterToken();

  const permission = useMemo((): NotificationPermission => {
    if (
      !isMounted ||
      typeof window === 'undefined' ||
      !('Notification' in window)
    ) {
      return 'unsupported';
    }
    return Notification.permission;
  }, [isMounted]);

  const isSupported = useMemo(
    () =>
      isMounted && typeof window !== 'undefined' && 'Notification' in window,
    [isMounted]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      return {
        permission: 'unsupported' as NotificationPermission,
        token: null
      };
    }

    setIsLoading(true);

    try {
      let currentPermission = Notification.permission;

      // Yêu cầu quyền nếu chưa có
      if (currentPermission === 'default') {
        currentPermission = await Notification.requestPermission();
      }

      let token: string | null = null;

      // Lấy Firebase token nếu được cấp quyền
      if (currentPermission === 'granted') {
        console.log('🔥 Getting Firebase token...');
        token = await requestFirebaseToken();
        if (token) {
          console.log('✅ Firebase token obtained successfully!');

          try {
            await registerToken({
              token,
              platform: 'WEB',
              deviceId: getOrCreateDeviceId()
            });
            console.log('✅ Notification token registered successfully!');
          } catch (registerError) {
            console.error(
              '❌ Failed to register notification token:',
              registerError
            );
          }
        } else {
          console.log('❌ Failed to get Firebase token');
        }
      }

      return {
        permission: currentPermission as NotificationPermission,
        token
      };
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return {
        permission: 'denied' as NotificationPermission,
        token: null
      };
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, registerToken]);

  return {
    permission,
    isSupported,
    requestPermission,
    isLoading,
    isMounted
  };
}
