import useSWRMutation from 'swr/mutation';
import { swrFetcher } from '@/utils/swr-fetcher';
import { SendToTopicRequest } from '@/hooks/dto';

export function useSendToTopic(baseUrl?: string) {
  const apiBase = baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const url = `${apiBase}/notification/send-to-topic`;

  return useSWRMutation<any, Error, string, SendToTopicRequest>(
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
