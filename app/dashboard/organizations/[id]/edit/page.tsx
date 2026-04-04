import { redirect } from 'next/navigation';
import OrganizationEditPage from '@/components/dashboard/organizations/edit';
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
    <OrganizationEditPage orgId={orgId} user={user} userDetails={userDetails} />
  );
}
