import { createClient } from '@/lib/supabase/server';
import AuthButton from '@/components/auth/AuthButton';
import SignInButton from '@/components/auth/SignInButton';
import UnoGame from '@/components/game';
import { PaintBackground } from '@/components/game/PaintBackground';

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#0d0208' }}>
        <PaintBackground />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.42)' }} />

        {/* Sign-in card */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 24px',
        }}>
          <div style={{
            animation: 'signInFadeUp 0.5s ease both',
            textAlign: 'center', padding: '44px 36px 40px',
            background: 'rgba(0,0,0,0.55)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 28,
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            maxWidth: 360, width: '100%',
            boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
          }}>
            <div style={{ display: 'inline-flex', gap: 7, transform: 'rotate(-4deg)', marginBottom: 24 }}>
              {[['U', '#E4002B'], ['N', '#1FA84C'], ['O', '#0095DA']].map(([l, c], i) => (
                <span key={i} style={{
                  fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontStyle: 'italic',
                  fontSize: 60, color: '#fff', lineHeight: 1,
                  width: 54, height: 66, display: 'grid', placeItems: 'center',
                  background: c, borderRadius: 14, transform: `rotate(${(i - 1) * 5}deg)`,
                  boxShadow: `0 0 0 4px rgba(255,255,255,0.92) inset, 0 12px 28px ${c}90`,
                }}>{l}</span>
              ))}
            </div>

            <div style={{
              fontFamily: "'Nunito',sans-serif", fontWeight: 800, color: '#FFC400',
              fontSize: 11, letterSpacing: 4, marginBottom: 6,
            }}>PLAY TOGETHER</div>

            <div style={{
              fontFamily: "'Nunito',sans-serif", fontWeight: 700,
              color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 32,
            }}>Challenge friends. Call UNO. Win.</div>

            <SignInButton />
          </div>
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
