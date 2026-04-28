import useSWRMutation from 'swr/mutation';
import { swrFetcher } from '@/utils/swr-fetcher';
import type {
  UpdateOrganizationBySystemAdminRequest,
  OrganizationDetailsResponseForSystemAdmin
} from '@/hooks/dto';

interface Params {
  id: string;
  baseUrl?: string;
}

export const useUpdateOrgProfile = ({ id, baseUrl = '' }: Params) => {
  const path = `/sys-admin/organizations/${id}/update-profile`;
  const url = baseUrl ? `${baseUrl}${path}` : path;

  return useSWRMutation<
    OrganizationDetailsResponseForSystemAdmin | null,
    Error,
    string,
    UpdateOrganizationBySystemAdminRequest
  >(url, (url, { arg }) =>
    swrFetcher(url, {
      method: 'PUT',
      body: JSON.stringify(arg)
    })
  );
};
