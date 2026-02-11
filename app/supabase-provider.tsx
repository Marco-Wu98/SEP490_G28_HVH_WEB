'use client';

import type { Database } from '@/types/types_db';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { SWRConfig } from 'swr';

type SupabaseContext = {
  supabase: SupabaseClient<Database>;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createPagesBrowserClient());
  const router = useRouter();

  const getCookieValue = (name: string) => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(
      new RegExp(
        `(?:^|; )${name.replace(/([.$?*|{}()\[\]\\/+^])/g, '\\$1')}=([^;]*)`
      )
    );
    return match ? decodeURIComponent(match[1]) : null;
  };

  const swrFetcher = async <T,>(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<T> => {
    const cookieKey = process.env.NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_NAME!;
    const rawCookie = getCookieValue(cookieKey);

    let token = null;

    if (rawCookie && rawCookie.startsWith('base64-')) {
      try {
        const base64Data = rawCookie.replace('base64-', '');
        const decodedData = JSON.parse(atob(base64Data));
        token = decodedData.access_token;
      } catch (e) {
        console.error('Error decoding Supabase auth cookie:', e);
      }
    }

    if (!token) {
      const { data } = await supabase.auth.getSession();
      token = data.session?.access_token;
    }

    const headers = new Headers(init?.headers || {});
    headers.set('Accept', 'application/json');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(input, {
      ...init,
      headers,
      credentials: 'same-origin'
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message);
    }

    return response.json() as Promise<T>;
  };

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <Context.Provider value={{ supabase }}>
      <SWRConfig
        value={{
          fetcher: swrFetcher,
          shouldRetryOnError: false,
          revalidateOnFocus: false
        }}
      >
        {children}
      </SWRConfig>
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider');
  }

  return context;
};
