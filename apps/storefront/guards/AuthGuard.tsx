import { PropsWithChildren } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { redirect } from 'next/navigation';
import { Spinner } from '@couture-next/ui';

export default function AuthGuard({
  adminOnly,
  children,
}: PropsWithChildren<{
  adminOnly?: boolean;
}>) {
  const { user, isAdmin, fetchingUser, fetchingIsAdmin } = useAuth();
  if (fetchingUser || (adminOnly && fetchingIsAdmin))
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Spinner className="w-8 h-8" />
      </div>
    );
  if (!user) return redirect('/connexion');
  if (adminOnly && !isAdmin) return redirect('/');
  return <>{children}</>;
}