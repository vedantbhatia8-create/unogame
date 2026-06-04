import { createClient } from '@/lib/supabase/server';
import AuthButton from '@/components/auth/AuthButton';
import SignInButton from '@/components/auth/SignInButton';
import UnoGame from '@/components/game';

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div style={{
        position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(120% 70% at 50% 0%, #2a2150 0%, #16112b 50%, #0d0a18 100%)',
      }}>
        <div style={{ textAlign: 'center', padding: '0 24px' }}>
          <div style={{ display: 'inline-flex', gap: 6, transform: 'rotate(-4deg)', marginBottom: 32 }}>
            {[['U', '#E4002B'], ['N', '#1FA84C'], ['O', '#0095DA']].map(([l, c], i) => (
              <span key={i} style={{
                fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontStyle: 'italic',
                fontSize: 58, color: '#fff', lineHeight: 1,
                width: 52, height: 64, display: 'grid', placeItems: 'center',
                background: c, borderRadius: 14, transform: `rotate(${(i - 1) * 5}deg)`,
                boxShadow: '0 0 0 4px rgba(255,255,255,0.92) inset, 0 8px 18px rgba(0,0,0,0.4)',
              }}>{l}</span>
            ))}
          </div>
          <div style={{
            fontFamily: "'Nunito',sans-serif", fontWeight: 800, color: '#FFC400',
            fontSize: 13, letterSpacing: 3, marginBottom: 40,
          }}>PLAY TOGETHER</div>
          <SignInButton />
        </div>
      </div>
    );
  }

  return (
    <>
      <UnoGame />
      <div style={{ position: 'fixed', top: 12, right: 16, zIndex: 9999 }}>
        <AuthButton user={user} />
      </div>
    </>
  );
}
