import { redirect } from 'next/navigation';
import OrganizationDetailPage from '@/components/dashboard/organizations/detail';
import { createClient } from '@/utils/supabase/server';
import { getUser, getUserDetails } from '@/utils/supabase/queries';

export default async function Page({
  params
}: {
  params: Promise<{ id: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const orgId = Array.isArray(id) ? id[0] : id;
  if (!orgId) {
    return redirect('/dashboard/organizations');
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
    <OrganizationDetailPage
      orgId={orgId}
      user={user}
      userDetails={userDetails}
    />
  );
}
