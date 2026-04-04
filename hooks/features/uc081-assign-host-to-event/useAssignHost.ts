import useSWRMutation from 'swr/mutation';
import { swrFetcher } from '@/utils/swr-fetcher';

interface Params {
  id: string;
  baseUrl?: string;
}

interface AssignHostPayload {
  hostId: string;
}

export const useAssignHost = ({ id, baseUrl = '' }: Params) => {
  const path = `/org-manager/events/${id}/assign-host`;
  const url = id ? (baseUrl ? `${baseUrl}${path}` : path) : null;

  return useSWRMutation(url, (url, { arg }: { arg?: AssignHostPayload }) =>
    swrFetcher(url, {
      method: 'PUT',
      ...(arg ? { body: JSON.stringify(arg) } : {})
    })
  );
};
