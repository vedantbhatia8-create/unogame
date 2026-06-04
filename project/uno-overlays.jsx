// uno-overlays.jsx — modal/full-screen overlays: WildPicker, WinOverlay, PassScreen, UnoCallOverlay
const OV_HEX = window.UnoEngine.HEX;

function Backdrop({ children, blur = true, style = {} }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: 'rgba(8,8,14,0.72)',
      backdropFilter: blur ? 'blur(6px)' : 'none', WebkitBackdropFilter: blur ? 'blur(6px)' : 'none',
      display: 'grid', placeItems: 'center', padding: 22, boxSizing: 'border-box',
      animation: 'ovFade .22s ease', ...style,
    }}>{children}</div>
  );
}

function WildPicker({ onPick, onCancel, plusFour }) {
  const cells = [
    { c: 'red', label: 'Red' }, { c: 'blue', label: 'Blue' },
    { c: 'green', label: 'Green' }, { c: 'yellow', label: 'Yellow' },
  ];
  return (
    <Backdrop>
      <div style={{ width: '100%', maxWidth: 320, textAlign: 'center' }}>
        <div style={{
          fontFamily: "'Fredoka', sans-serif", fontWeight: 600, color: '#fff',
          fontSize: 24, marginBottom: 4,
        }}>Choose a colour</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Nunito', sans-serif", fontSize: 14, marginBottom: 18 }}>
          {plusFour ? 'Next player draws four.' : 'Play continues in this colour.'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {cells.map(({ c, label }) => (
            <button key={c} onClick={() => onPick(c)} style={{
              border: 'none', borderRadius: 22, height: 92, cursor: 'pointer',
              background: OV_HEX[c], color: '#fff', position: 'relative', overflow: 'hidden',
              boxShadow: '0 8px 20px rgba(0,0,0,0.4), 0 0 0 4px rgba(255,255,255,0.92) inset',
              fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 20,
              transition: 'transform .12s',
            }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >{label}</button>
          ))}
        </div>
        {onCancel && (
          <button onClick={onCancel} style={{
            marginTop: 16, background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.55)',
            fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 15, cursor: 'pointer',
          }}>Cancel</button>
        )}
      </div>
    </Backdrop>
  );
}

function WinOverlay({ winner, players, onPlayAgain, onExit, confetti = true }) {
  const ranked = players.slice().sort((a, b) => a.hand.length - b.hand.length);
  return (
    <Backdrop>
      <div style={{ width: '100%', maxWidth: 340, textAlign: 'center' }}>
        {confetti && <Confetti />}
        <div style={{ fontSize: 64, marginBottom: 4 }}>{winner.avatar.glyph}</div>
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, color: '#FFD166', fontSize: 16, letterSpacing: 2 }}>WINNER</div>
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, color: '#fff', fontSize: 34, marginBottom: 18 }}>{winner.name}</div>
        <div style={{
          background: 'rgba(255,255,255,0.06)', borderRadius: 18, padding: '8px 14px',
          textAlign: 'left', marginBottom: 20,
        }}>
          {ranked.map((p, i) => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 4px',
              borderBottom: i < ranked.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              fontFamily: "'Nunito', sans-serif",
            }}>
              <span style={{ width: 18, color: 'rgba(255,255,255,0.5)', fontWeight: 800, fontSize: 14 }}>{i + 1}</span>
              <span style={{
                width: 28, height: 28, borderRadius: '50%', background: p.avatar.bg,
                display: 'grid', placeItems: 'center', fontSize: 15,
              }}>{p.avatar.glyph}</span>
              <span style={{ flex: 1, color: '#fff', fontWeight: 700, fontSize: 15 }}>{p.name}</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 700 }}>
                {p.hand.length === 0 ? '🏆' : p.hand.length + ' left'}
              </span>
            </div>
          ))}
        </div>
        <button onClick={onPlayAgain} style={primaryBtn}>Play again</button>
        <button onClick={onExit} style={ghostBtn}>Back to lobby</button>
      </div>
    </Backdrop>
  );
}

function PassScreen({ player, onReady }) {
  return (
    <Backdrop blur={false} style={{ background: 'linear-gradient(160deg,#1b1530,#0d0a18)' }}>
      <div style={{ textAlign: 'center', width: '100%', maxWidth: 320 }}>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Nunito', sans-serif", fontWeight: 800, letterSpacing: 2, fontSize: 13 }}>PASS THE DEVICE TO</div>
        <div style={{ fontSize: 76, margin: '14px 0 2px' }}>{player.avatar.glyph}</div>
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, color: '#fff', fontSize: 36, marginBottom: 6 }}>{player.name}</div>
        <div style={{ color: 'rgba(255,255,255,0.55)', fontFamily: "'Nunito', sans-serif", fontSize: 14, marginBottom: 30 }}>
          Make sure no one else can see your hand.
        </div>
        <button onClick={onReady} style={primaryBtn}>I'm {player.name} — show my hand</button>
      </div>
    </Backdrop>
  );
}

// Pulsing UNO call window for the player who just hit one card.
function UnoCallOverlay({ name, onCall, remaining }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 150, zIndex: 210,
      display: 'grid', placeItems: 'center', pointerEvents: 'none',
    }}>
      <button onClick={onCall} style={{
        pointerEvents: 'auto', border: 'none', cursor: 'pointer',
        width: 132, height: 132, borderRadius: '50%',
        background: 'radial-gradient(circle at 38% 32%, #FF5A5A, #E4002B)',
        color: '#fff', fontFamily: "'Fredoka', sans-serif", fontWeight: 700,
        fontSize: 34, fontStyle: 'italic', letterSpacing: '-0.03em',
        boxShadow: '0 0 0 6px rgba(255,255,255,0.95) inset, 0 14px 34px rgba(228,0,43,0.6)',
        animation: 'unoPulse 0.7s ease-in-out infinite',
      }}>
        UNO!
        <div style={{ fontSize: 12, fontStyle: 'normal', fontWeight: 800, opacity: 0.85, marginTop: -2 }}>tap to call</div>
      </button>
      <div style={{
        marginTop: 12, height: 6, width: 132, borderRadius: 6, background: 'rgba(255,255,255,0.18)', overflow: 'hidden',
      }}>
        <div style={{ height: '100%', width: (remaining * 100) + '%', background: '#FFD166', transition: 'width .1s linear' }} />
      </div>
    </div>
  );
}

function Confetti() {
  const bits = React.useMemo(() => Array.from({ length: 36 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    dur: 1.6 + Math.random() * 1.4,
    c: [OV_HEX.red, OV_HEX.yellow, OV_HEX.green, OV_HEX.blue, '#fff'][i % 5],
    rot: Math.random() * 360,
    size: 7 + Math.random() * 7,
  })), []);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: -1 }}>
      {bits.map((b, i) => (
        <div key={i} style={{
          position: 'absolute', top: -20, left: b.left + '%', width: b.size, height: b.size * 1.4,
          background: b.c, borderRadius: 2, transform: `rotate(${b.rot}deg)`,
          animation: `confFall ${b.dur}s ${b.delay}s ease-in infinite`,
        }} />
      ))}
    </div>
  );
}

const primaryBtn = {
  display: 'block', width: '100%', border: 'none', borderRadius: 16, cursor: 'pointer',
  padding: '16px 18px', marginBottom: 10,
  background: 'linear-gradient(180deg,#FFD166,#F4A100)', color: '#3a2600',
  fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 18,
  boxShadow: '0 8px 22px rgba(244,161,0,0.4)',
};
const ghostBtn = {
  display: 'block', width: '100%', border: 'none', borderRadius: 16, cursor: 'pointer',
  padding: '13px 18px', background: 'rgba(255,255,255,0.08)', color: '#fff',
  fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 15,
};

Object.assign(window, { WildPicker, WinOverlay, PassScreen, UnoCallOverlay, Confetti, ovPrimaryBtn: primaryBtn, ovGhostBtn: ghostBtn });
