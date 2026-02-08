import { redirect } from 'next/navigation';

export default function PendingAccountRedirectPage() {
  return redirect('/dashboard/pending-accounts');
}
