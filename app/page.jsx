import { createClient } from '@/lib/supabase/server';
import AuthButton from '@/components/auth/AuthButton';
import SignInButton from '@/components/auth/SignInButton';
import UnoGame from '@/components/game';

const CARDS = [
  { color: '#E4002B', label: '7', r: '-18deg', x: '8%',  y: '12%', delay: '0s'    },
  { color: '#0095DA', label: '+2',r: '12deg',  x: '78%', y: '8%',  delay: '0.4s'  },
  { color: '#1FA84C', label: '🔄',r: '-8deg',  x: '85%', y: '62%', delay: '0.8s'  },
  { color: '#F4A100', label: '0', r: '22deg',  x: '5%',  y: '68%', delay: '0.2s'  },
  { color: '#E4002B', label: 'W', r: '-14deg', x: '60%', y: '80%', delay: '1.0s'  },
  { color: '#0095DA', label: '3', r: '6deg',   x: '30%', y: '88%', delay: '0.6s'  },
];

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div style={{
        position: 'fixed', inset: 0, overflow: 'hidden',
        background: 'radial-gradient(ellipse 120% 80% at 50% -10%, #1a0d2e 0%, #0a0810 60%)',
      }}>
        {/* Colour orbs */}
        <div style={{
          position: 'absolute', width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(228,0,43,0.18) 0%, transparent 65%)',
          top: '-20%', left: '-15%',
          animation: 'orbDrift1 14s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,149,218,0.16) 0%, transparent 65%)',
          bottom: '-15%', right: '-10%',
          animation: 'orbDrift2 18s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: 450, height: 450, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(31,168,76,0.14) 0%, transparent 65%)',
          top: '30%', right: '5%',
          animation: 'orbDrift3 11s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: 350, height: 350, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244,161,0,0.12) 0%, transparent 65%)',
          bottom: '10%', left: '5%',
          animation: 'orbDrift1 16s ease-in-out infinite reverse',
        }} />

        {/* Floating background cards */}
        {CARDS.map((c, i) => (
          <div key={i} style={{
            position: 'absolute', left: c.x, top: c.y,
            '--r': c.r,
            width: 54, height: 76, borderRadius: 10,
            background: c.color,
            boxShadow: `0 0 0 3px rgba(255,255,255,0.85) inset, 0 8px 24px rgba(0,0,0,0.5)`,
            display: 'grid', placeItems: 'center',
            fontSize: 20, fontWeight: 700, color: '#fff',
            fontFamily: "'Fredoka', sans-serif",
            opacity: 0.25,
            transform: `rotate(${c.r})`,
            animation: `cardFloat 4s ${c.delay} ease-in-out infinite`,
          }}>{c.label}</div>
        ))}

        {/* Sign-in card */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 24px',
        }}>
          <div style={{
            animation: 'signInFadeUp 0.5s ease both',
            textAlign: 'center', padding: '44px 36px 40px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 28,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            maxWidth: 360, width: '100%',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset',
          }}>
            {/* UNO logo */}
            <div style={{ display: 'inline-flex', gap: 7, transform: 'rotate(-4deg)', marginBottom: 24 }}>
              {[['U', '#E4002B'], ['N', '#1FA84C'], ['O', '#0095DA']].map(([l, c], i) => (
                <span key={i} style={{
                  fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontStyle: 'italic',
                  fontSize: 60, color: '#fff', lineHeight: 1,
                  width: 54, height: 66, display: 'grid', placeItems: 'center',
                  background: c, borderRadius: 14, transform: `rotate(${(i - 1) * 5}deg)`,
                  boxShadow: `0 0 0 4px rgba(255,255,255,0.92) inset, 0 12px 28px ${c}80`,
                }}>{l}</span>
              ))}
            </div>

            <div style={{
              fontFamily: "'Nunito',sans-serif", fontWeight: 800, color: '#FFC400',
              fontSize: 11, letterSpacing: 4, marginBottom: 6,
            }}>PLAY TOGETHER</div>

            <div style={{
              fontFamily: "'Nunito',sans-serif", fontWeight: 700,
              color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 32,
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
