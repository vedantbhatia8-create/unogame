import { createClient } from '@/lib/supabase/server';
import AuthButton from '@/components/auth/AuthButton';
import UnoGame from '@/components/game';

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <UnoGame />
      <div
        style={{
          position: 'fixed',
          top: 12,
          right: 16,
          zIndex: 9999,
        }}
      >
        <AuthButton user={user} />
      </div>
    </>
  );
}
