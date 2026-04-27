import type { HostInfoResponseForSystemAdmin } from '@/hooks/dto';
import { useMemo } from 'react';
import useSWR from 'swr';

interface Params {
  id?: string;
  baseUrl?: string;
  enabled?: boolean;
}

export const useGetHostInfobySysAdmin = ({
  id,
  baseUrl = '',
  enabled = true
}: Params = {}) => {
  const url = useMemo(() => {
    const trimmedId = id?.trim();
    if (!enabled || !trimmedId) {
      return null;
    }

    const path = `/sys-admin/hosts/${trimmedId}/info`;
    return baseUrl ? `${baseUrl}${path}` : path;
  }, [baseUrl, enabled, id]);

  return useSWR<HostInfoResponseForSystemAdmin>(url);
};
