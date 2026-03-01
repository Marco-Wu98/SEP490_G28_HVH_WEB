import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getErrorRedirect, getStatusRedirect } from '@/utils/helpers';

export async function GET(request: NextRequest) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the `@supabase/ssr` package. It exchanges an auth code for the user's session.
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const nextParam = requestUrl.searchParams.get('next');
  const nextPath =
    nextParam === '/dashboard/signin/update_password' ||
    nextParam === '/signin/update_password'
      ? nextParam
      : '/signin/update_password';
  const forgotPath = nextPath.startsWith('/dashboard/')
    ? '/dashboard/signin/forgot_password'
    : '/signin/forgot_password';

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        getErrorRedirect(
          `${requestUrl.origin}${forgotPath}`,
          'Xác thực thất bại.',
          'Không thể xác thực yêu cầu đặt lại mật khẩu. Vui lòng thử lại.'
        )
      );
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(
    getStatusRedirect(
      `${requestUrl.origin}${nextPath}`,
      'Xác thực thành công.',
      'Vui lòng nhập mật khẩu mới cho tài khoản của bạn.'
    )
  );
}
