import { createClient } from '@/lib/supabase/server';
import AuthButton from '@/components/auth/AuthButton';
import SignInButton from '@/components/auth/SignInButton';
import UnoGame from '@/components/game';

const SPLATS = [
  // red
  { color: '#E4002B', top: '-18%',  left: '-12%', w: 680, h: 620, r: '45% 55% 40% 60% / 55% 45% 60% 40%', rot: '-15deg' },
  { color: '#C8001A', top: '50%',   left: '-8%',  w: 420, h: 480, r: '60% 40% 55% 45% / 40% 65% 35% 60%', rot: '20deg'  },
  // blue
  { color: '#0095DA', top: '-10%',  left: '55%',  w: 560, h: 520, r: '40% 60% 55% 45% / 60% 40% 55% 45%', rot: '10deg'  },
  { color: '#007BB8', top: '55%',   left: '62%',  w: 480, h: 440, r: '55% 45% 40% 60% / 45% 55% 65% 35%', rot: '-8deg'  },
  // green
  { color: '#1FA84C', top: '30%',   left: '20%',  w: 500, h: 460, r: '50% 50% 40% 60% / 60% 40% 55% 45%', rot: '30deg'  },
  { color: '#178A3C', top: '-5%',   left: '28%',  w: 320, h: 360, r: '65% 35% 50% 50% / 40% 60% 45% 55%', rot: '-20deg' },
  // yellow
  { color: '#F4A100', top: '60%',   left: '25%',  w: 540, h: 400, r: '45% 55% 60% 40% / 55% 45% 40% 60%', rot: '12deg'  },
  { color: '#FFC400', top: '72%',   left: '-5%',  w: 360, h: 320, r: '55% 45% 35% 65% / 50% 50% 60% 40%', rot: '-25deg' },
];

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#111' }}>
        {/* Paint splats */}
        {SPLATS.map((s, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: s.top, left: s.left,
            width: s.w, height: s.h,
            background: s.color,
            borderRadius: s.r,
            transform: `rotate(${s.rot})`,
            opacity: 0.92,
            filter: 'blur(2px)',
          }} />
        ))}

        {/* Dark vignette to make card readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)',
        }} />

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
