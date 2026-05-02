import type { NotificationsResponse } from '@/hooks/dto/notification';
import { useMemo } from 'react';
import useSWR from 'swr';

interface Params {
  pageNumber?: number;
  pageSize?: number;
  baseUrl?: string;
  enabled?: boolean;
}

export const useGetNotiUserTopic = ({
  pageNumber = 1,
  pageSize = 10,
  baseUrl = '',
  enabled = true
}: Params) => {
  const url = useMemo(() => {
    if (!enabled) return null;

    const qp = new URLSearchParams({
      pageNumber: String(Math.max(1, pageNumber)),
      pageSize: String(pageSize)
    });

    const path = `/notifications/user-topics?${qp.toString()}`;

    return baseUrl ? `${baseUrl}${path}` : path;
  }, [baseUrl, enabled, pageNumber, pageSize]);

  return useSWR<NotificationsResponse>(url);
};

export default useGetNotiUserTopic;
