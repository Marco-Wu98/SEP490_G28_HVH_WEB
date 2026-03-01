import PendingAccountDetailContainer from '@/components/dashboard/pending-accounts/detail-container';
import { createClient } from '@/utils/supabase/server';
import { getUser, getUserDetails } from '@/utils/supabase/queries';
import { redirect } from 'next/navigation';

export default async function PendingAccountDetailPage({
  params
}: {
  params: Promise<{ id: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const pendingAccountId = Array.isArray(id) ? id[0] : id;
  if (!pendingAccountId) {
    return redirect('/dashboard/pending-accounts');
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
    <PendingAccountDetailContainer
      user={user}
      userDetails={userDetails}
      id={pendingAccountId}
    />
  );
}
