import PendingAccountDetail from '@/components/dashboard/pending-accounts/detail';
import { createClient } from '@/utils/supabase/server';
import { getUser, getUserDetails } from '@/utils/supabase/queries';
import { redirect } from 'next/navigation';

interface PageProps {
  params: { id: string };
}

export default async function PendingAccountDetailPage({ params }: PageProps) {
  const supabase = await createClient();
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
  ]);

  if (!user) {
    return redirect('/dashboard/signin');
  }

  if (params.id.startsWith('mock-')) {
    const mockDetails = {
      'mock-1': {
        verification: {
          id: 'mock-1',
          cid: '012345678901',
          email: 'mai.nguyen@example.com',
          phone: '0912345678',
          cid_front: null,
          cid_back: null,
          cid_holding: null,
          status: 'PENDING',
          rejection_reason: null,
          created_at: '2026-02-10T08:30:00Z',
          reviewed_by: null,
          reviewed_at: null,
          volunteer_id: 'mock-vol-1'
        },
        volunteer: {
          id: 'mock-vol-1',
          vid: 'VOL-0001',
          cid: '012345678901',
          email: 'mai.nguyen@example.com',
          phone: '0912345678',
          phone_verified: true,
          nickname: 'Mai',
          full_name: 'Nguyễn Thị Mai',
          bio: 'Tham gia các hoạt động môi trường.',
          gender: false,
          dob: '2001-04-12',
          level: 1,
          avatar_url: null,
          address: 'Quận 1, TP.HCM',
          detail_address: '12 Nguyễn Huệ',
          employ_status: 'STUDENT',
          work_address: null,
          education_level: 'UNDERGRADUATE',
          sid: 'SV001',
          created_by: null,
          created_at: '2026-02-10T08:30:00Z',
          updated_at: '2026-02-10T08:30:00Z'
        }
      },
      'mock-2': {
        verification: {
          id: 'mock-2',
          cid: '098765432109',
          email: 'quan.tran@example.com',
          phone: '0987654321',
          cid_front: null,
          cid_back: null,
          cid_holding: null,
          status: 'PENDING',
          rejection_reason: null,
          created_at: '2026-02-08T09:00:00Z',
          reviewed_by: null,
          reviewed_at: null,
          volunteer_id: 'mock-vol-2'
        },
        volunteer: {
          id: 'mock-vol-2',
          vid: 'VOL-0002',
          cid: '098765432109',
          email: 'quan.tran@example.com',
          phone: '0987654321',
          phone_verified: false,
          nickname: 'Quân',
          full_name: 'Trần Minh Quân',
          bio: 'Quan tâm tổ chức sự kiện cộng đồng.',
          gender: true,
          dob: '1998-09-21',
          level: 2,
          avatar_url: null,
          address: 'Quận 7, TP.HCM',
          detail_address: '88 Nguyễn Hữu Thọ',
          employ_status: 'EMPLOYED',
          work_address: 'Khu chế xuất Tân Thuận',
          education_level: 'COLLEGE',
          sid: null,
          created_by: null,
          created_at: '2026-02-08T09:00:00Z',
          updated_at: '2026-02-08T09:00:00Z'
        }
      },
      'mock-3': {
        verification: {
          id: 'mock-3',
          cid: '123456789012',
          email: 'anh.le@example.com',
          phone: '0901222333',
          cid_front: null,
          cid_back: null,
          cid_holding: null,
          status: 'PENDING',
          rejection_reason: null,
          created_at: '2026-02-05T14:20:00Z',
          reviewed_by: null,
          reviewed_at: null,
          volunteer_id: 'mock-vol-3'
        },
        volunteer: {
          id: 'mock-vol-3',
          vid: 'VOL-0003',
          cid: '123456789012',
          email: 'anh.le@example.com',
          phone: '0901222333',
          phone_verified: true,
          nickname: 'Anh',
          full_name: 'Lê Ngọc Anh',
          bio: 'Tham gia hoạt động giáo dục.',
          gender: false,
          dob: '2000-01-15',
          level: 1,
          avatar_url: null,
          address: 'Hà Nội',
          detail_address: '20 Tràng Tiền',
          employ_status: 'STUDENT',
          work_address: null,
          education_level: 'UNDERGRADUATE',
          sid: 'SV099',
          created_by: null,
          created_at: '2026-02-05T14:20:00Z',
          updated_at: '2026-02-05T14:20:00Z'
        }
      }
    } as const;

    const mock = mockDetails[params.id as keyof typeof mockDetails];

    return (
      <PendingAccountDetail
        user={user}
        userDetails={userDetails}
        verification={mock?.verification ?? null}
        volunteer={mock?.volunteer ?? null}
      />
    );
  }

  const { data: verification } = await supabase
    .from('identity_verifications')
    .select(
      'id, cid, email, phone, cid_front, cid_back, cid_holding, status, rejection_reason, created_at, reviewed_by, reviewed_at, volunteer_id'
    )
    .eq('id', params.id)
    .single();

  const { data: volunteer } = verification?.volunteer_id
    ? await supabase
        .from('volunteers')
        .select(
          'id, vid, cid, email, phone, phone_verified, nickname, full_name, bio, gender, dob, level, avatar_url, address, detail_address, employ_status, work_address, education_level, sid, created_by, created_at, updated_at'
        )
        .eq('id', verification.volunteer_id)
        .single()
    : { data: null };

  return (
    <PendingAccountDetail
      user={user}
      userDetails={userDetails}
      verification={verification || null}
      volunteer={volunteer || null}
    />
  );
}
