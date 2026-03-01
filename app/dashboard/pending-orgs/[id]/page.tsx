import PendingOrgDetailContainer from '@/components/dashboard/pending-orgs/detail-container';
import { createClient } from '@/utils/supabase/server';
import { getUser, getUserDetails } from '@/utils/supabase/queries';
import { redirect } from 'next/navigation';

export default async function PendingOrgDetailPage({
  params
}: {
  params: Promise<{ id: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const orgId = Array.isArray(id) ? id[0] : id;
  if (!orgId) {
    return redirect('/dashboard/pending-orgs');
  }

  const supabase = await createClient();
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
  ]);

  if (!user) {
    return redirect('/dashboard/signin');
  }

  return (
    <PendingOrgDetailContainer
      user={user}
      userDetails={userDetails}
      id={orgId}
    />
  );
}
