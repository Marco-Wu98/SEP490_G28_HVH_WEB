import type { HostListResponseForSystemAdmin } from '@/hooks/dto';
import { useMemo } from 'react';
import useSWR from 'swr';

interface Params {
  pageNumber?: number;
  pageSize?: number;
  baseUrl?: string;
  enabled?: boolean;
}

export const useGetHostsofOrgsbySysAdmin = ({
  pageNumber = 0,
  pageSize = 10,
  baseUrl = '',
  enabled = true
}: Params = {}) => {
  const url = useMemo(() => {
    if (!enabled) {
      return null;
    }

    const queryParams = new URLSearchParams({
      pageNumber: String(Math.max(0, pageNumber)),
      pageSize: String(pageSize)
    });

    const path = `/sys-admin/hosts?${queryParams.toString()}`;
    return baseUrl ? `${baseUrl}${path}` : path;
  }, [baseUrl, enabled, pageNumber, pageSize]);

  return useSWR<HostListResponseForSystemAdmin>(url);
};
