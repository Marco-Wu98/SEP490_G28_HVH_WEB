import PendingAccounts from '@/components/dashboard/pending-accounts';
import { createClient } from '@/utils/supabase/server';
import { getUser, getUserDetails } from '@/utils/supabase/queries';
import { redirect } from 'next/navigation';

export default async function PendingAccountsPage() {
  const supabase = await createClient();
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
  ]);

  if (!user) {
    return redirect('/dashboard/signin');
  }

  const { data: verifications } = await supabase
    .from('identity_verifications')
    .select('id, email, phone, cid, status, created_at, volunteer_id')
    .eq('status', 'PENDING')
    .order('created_at', { ascending: false });

  const volunteerIds = (verifications || [])
    .map((item) => item.volunteer_id)
    .filter(Boolean) as string[];

  const { data: volunteers } = volunteerIds.length
    ? await supabase
        .from('volunteers')
        .select('id, full_name')
        .in('id', volunteerIds)
    : { data: [] };

  const volunteerMap = new Map(
    (volunteers || []).map((volunteer) => [volunteer.id, volunteer.full_name])
  );

  const accounts = (verifications || []).map((item) => ({
    id: item.id,
    fullName: item.volunteer_id
      ? (volunteerMap.get(item.volunteer_id) ?? null)
      : null,
    email: item.email ?? null,
    phone: item.phone ?? null,
    cid: item.cid ?? null,
    status: item.status ?? null,
    createdAt: item.created_at ?? null
  }));

  return (
    <PendingAccounts
      user={user}
      userDetails={userDetails}
      accounts={accounts}
    />
  );
}
