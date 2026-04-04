import DashboardLayout from '@/components/layout';
import PostsManagement from '@/components/dashboard/posts';
import { getUser, getUserDetails } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/server';

export default async function PostsPage() {
  const supabase = await createClient();
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
  ]);

  return (
    <DashboardLayout
      user={user}
      userDetails={userDetails}
      title="Quản lý bài đăng"
      description="Xem và quản lý bài đăng công động"
    >
      <PostsManagement />
    </DashboardLayout>
  );
}
