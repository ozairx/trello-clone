'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { env } from '@/env';
import { useRouter } from 'next/navigation';

export default function AccountSetupRequiredPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Account Setup Required</h1>
      <p>Your account is missing a username. Please contact support to have a username assigned to your account.</p>
      {env.NEXT_PUBLIC_ENABLE_TEST_LOGIN && (
        <div className="mt-4">
          <Button onClick={handleSignOut} className='cursor-pointer'>
            Clear Session and Go to Login
          </Button>
        </div>
      )}
    </div>
  );
}
