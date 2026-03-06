'use client';

import PendingEvents from '@/components/dashboard/pending-events';
import { organizerRoutes } from '@/components/routes';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotificationPermission } from '@/hooks/use-notification-permission';

export default function OrganizerPendingEventsPage() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const router = useRouter();
  const { permission, requestPermission, isLoading, isMounted } =
    useNotificationPermission();

  const handleNotificationRequest = async () => {
    console.log('🔔 Requesting notification permission...');
    const result = await requestPermission();

    console.log('📋 Permission result:', result.permission);

    if (result.permission === 'granted') {
      console.log('✅ User ALLOWED notification permission!');
      if (result.token) {
        console.log('🎯 Firebase Token:', result.token);
        // TODO: Gửi token lên server để lưu trữ
      } else {
        console.log('⚠️ Permission granted but no token received');
      }
    } else if (result.permission === 'denied') {
      console.log('❌ User DENIED notification permission');
    } else {
      console.log('⏸️ Permission status:', result.permission);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: user } = await supabase.auth.getUser();
      const { data: userDetails } = await supabase
        .from('user_details')
        .select('*')
        .single();

      if (!user) {
        router.push('/signin/password_signin');
        return;
      }

      setUser(user);
      setUserDetails(userDetails);
    };

    fetchUserData();
  }, [supabase, router]);

  return (
    <div>
      <PendingEvents
        user={user}
        userDetails={userDetails}
        detailBasePath="/organizer/pending-events"
        routes={organizerRoutes}
        colorVariant="organizer"
        signInPath="/signin/password_signin"
        notificationButton={{
          permission,
          isLoading,
          isMounted,
          onRequest: handleNotificationRequest
        }}
      />
    </div>
  );
}
