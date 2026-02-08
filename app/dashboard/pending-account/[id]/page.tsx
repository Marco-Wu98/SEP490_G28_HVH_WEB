import { redirect } from 'next/navigation';

interface PageProps {
  params: { id: string };
}

export default function PendingAccountDetailRedirectPage({
  params
}: PageProps) {
  return redirect(`/dashboard/pending-accounts/${params.id}`);
}
