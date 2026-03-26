import ApprovedEventDetailContainer from '@/components/dashboard/approved-events/detail-container';
import { organizerRoutes } from '@/components/routes';
import { getUser, getUserDetails } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function OrganizerApprovedEventDetailPage({
  params
}: {
  params: Promise<{ id: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const eventId = Array.isArray(id) ? id[0] : id;
  if (!eventId) {
    return redirect('/organizer/approved-events');
  }

  const supabase = await createClient();
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
  ]);

  if (!user) {
    return redirect('/signin/password_signin');
  }

  return (
    <ApprovedEventDetailContainer
      user={user}
      userDetails={userDetails}
      id={eventId}
      routes={organizerRoutes}
      colorVariant="organizer"
    />
  );
}
