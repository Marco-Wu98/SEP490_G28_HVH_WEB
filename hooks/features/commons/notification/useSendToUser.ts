import useSWRMutation from 'swr/mutation';
import { swrFetcher } from '@/utils/swr-fetcher';
import { SendToUserRequest } from '@/hooks/dto';

export function useSendToUser(baseUrl?: string) {
  const apiBase = baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const url = `${apiBase}/notification/send-to-user`;

  return useSWRMutation<any, Error, string, SendToUserRequest>(
    url,
    (url, { arg }) =>
      swrFetcher(url, {
        method: 'POST',
        body: JSON.stringify(arg),
        headers: {
          'Content-Type': 'application/json'
        }
      })
  );
}
