'use client';

import { useEffect, useRef } from 'react';
import { useNotificationPermission } from '@/hooks/use-notification-permission';
import { useSupabase } from '@/app/supabase-provider';

const NOTIFICATION_REGISTERED_USER_KEY = 'notification_registered_user_id';

export default function NotificationManager() {
  const { supabase } = useSupabase();
  const { requestPermission } = useNotificationPermission();
  const hasTriggeredRef = useRef(false);
  const isProcessingRef = useRef(false);
  const lastRegisteredUserIdRef = useRef<string | null>(null);
  const requestPermissionRef = useRef(requestPermission);

  // Always keep the latest requestPermission function
  requestPermissionRef.current = requestPermission;

  const getStoredRegisteredUserId = () => {
    if (typeof window === 'undefined') {
      return null;
    }

    return sessionStorage.getItem(NOTIFICATION_REGISTERED_USER_KEY);
  };

  const resetRegistrationState = (reason: string) => {
    hasTriggeredRef.current = false;
    isProcessingRef.current = false;
    lastRegisteredUserIdRef.current = null;

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(NOTIFICATION_REGISTERED_USER_KEY);
    }
  };

  const syncRegistrationState = (
    session: { user?: { id?: string } } | null
  ) => {
    const currentUserId = session?.user?.id ?? null;
    const storedUserId = getStoredRegisteredUserId();

    if (!currentUserId) {
      resetRegistrationState('no active session');
      return null;
    }

    if (storedUserId && storedUserId !== currentUserId) {
      resetRegistrationState(
        `stored user changed from ${storedUserId} to ${currentUserId}`
      );
    }

    if (
      lastRegisteredUserIdRef.current &&
      lastRegisteredUserIdRef.current !== currentUserId
    ) {
      resetRegistrationState(
        `ref user changed from ${lastRegisteredUserIdRef.current} to ${currentUserId}`
      );
    }

    if (storedUserId === currentUserId) {
      hasTriggeredRef.current = true;
      lastRegisteredUserIdRef.current = currentUserId;
    }

    return currentUserId;
  };

  const markUserAsRegistered = (userId: string) => {
    hasTriggeredRef.current = true;
    lastRegisteredUserIdRef.current = userId;
    sessionStorage.setItem(NOTIFICATION_REGISTERED_USER_KEY, userId);
  };

  useEffect(() => {
    const triggerNotificationRegistration = async (
      incomingSession?: { user?: { id?: string } } | null
    ) => {
      const activeSession =
        incomingSession ?? (await supabase.auth.getSession()).data.session;
      const currentUserId = syncRegistrationState(activeSession);

      if (!currentUserId) {
        return;
      }

      if (isProcessingRef.current) {
        return;
      }

      if (
        hasTriggeredRef.current &&
        lastRegisteredUserIdRef.current === currentUserId
      ) {
        return;
      }

      isProcessingRef.current = true;

      try {
        const result = await requestPermissionRef.current();

        if (result.permission === 'granted' && !result.token) {
          return;
        }

        markUserAsRegistered(currentUserId);
      } finally {
        isProcessingRef.current = false;
      }
    };

    let isMounted = true;

    // Immediate session check
    const checkSessionImmediately = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      syncRegistrationState(session);

      if (session && isMounted) {
        await triggerNotificationRegistration();
      }
    };

    // Auth state listener
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) {
        return;
      }

      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        const currentUserId = syncRegistrationState(session);

        if (!currentUserId) {
          return;
        }

        setTimeout(async () => {
          if (isMounted) {
            await triggerNotificationRegistration(session);
          }
        }, 1000);
      } else if (event === 'SIGNED_OUT') {
        resetRegistrationState('signed out');
      }
    });

    // Start immediate check
    setTimeout(() => {
      if (isMounted) {
        checkSessionImmediately();
      }
    }, 500);

    // Polling backup
    let pollCount = 0;
    const maxPolls = 10;

    const pollInterval = setInterval(async () => {
      if (!isMounted) {
        clearInterval(pollInterval);
        return;
      }

      pollCount++;
      const {
        data: { session }
      } = await supabase.auth.getSession();
      const currentUserId = syncRegistrationState(session);

      if (session && currentUserId && !hasTriggeredRef.current) {
        clearInterval(pollInterval);
        await triggerNotificationRegistration(session);
      } else if (pollCount >= maxPolls) {
        clearInterval(pollInterval);
      }
    }, 2000);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearInterval(pollInterval);
    };
  }, [supabase]);

  return null;
}
