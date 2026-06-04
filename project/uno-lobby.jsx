// uno-lobby.jsx — start screen: mode, players, house rules, room code.
function genCode() {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 5 }, () => a[Math.floor(Math.random() * a.length)]).join('');
}

function ModeCard({ icon, title, desc, active, onClick, accent }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
      padding: 14, borderRadius: 18, cursor: 'pointer', marginBottom: 10,
      border: active ? `2px solid ${accent}` : '2px solid rgba(255,255,255,0.1)',
      background: active ? `${accent}22` : 'rgba(255,255,255,0.04)',
      transition: 'all .15s',
    }}>
      <div style={{
        width: 46, height: 46, borderRadius: 13, background: accent, flex: '0 0 auto',
        display: 'grid', placeItems: 'center', fontSize: 24,
        boxShadow: '0 0 0 3px rgba(255,255,255,0.85) inset',
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 600, color: '#fff', fontSize: 17, lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 600, color: 'rgba(255,255,255,0.55)', fontSize: 12.5, marginTop: 2 }}>{desc}</div>
      </div>
      <div style={{
        width: 22, height: 22, borderRadius: '50%', flex: '0 0 auto',
        border: active ? 'none' : '2px solid rgba(255,255,255,0.25)',
        background: active ? accent : 'transparent', display: 'grid', placeItems: 'center',
        color: '#fff', fontSize: 13, fontWeight: 900,
      }}>{active ? '✓' : ''}</div>
    </button>
  );
}

function Lobby({ onStart, tweaks, layout = 'mobile' }) {
  const [mode, setMode] = React.useState('private');
  const [players, setPlayers] = React.useState(4);
  const [stack, setStack] = React.useState(true);
  const [code] = React.useState(genCode());
  const big = layout === 'desktop';

  const modes = [
    { id: 'private', icon: '🎟️', title: 'Private room', desc: 'Play with friends using a code', accent: '#0095DA' },
    { id: 'passplay', icon: '🤝', title: 'Pass & play', desc: 'Share one device, pass each turn', accent: '#1FA84C' },
    { id: 'spectate', icon: '👁️', title: 'Spectate', desc: 'Watch a table play out', accent: '#A78BFA' },
  ];

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'auto',
      background: 'radial-gradient(120% 70% at 50% 0%, #2a2150 0%, #16112b 50%, #0d0a18 100%)',
      padding: big ? '48px 20px 48px' : '64px 20px 40px', boxSizing: 'border-box',
      display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
    }}>
     <div style={{ width: '100%', maxWidth: big ? 460 : 'none' }}>
      {/* logo */}
      <div style={{ textAlign: 'center', marginBottom: 22 }}>
        <div style={{ display: 'inline-flex', gap: 6, transform: 'rotate(-4deg)' }}>
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
        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, color: '#FFC400', fontSize: 13, letterSpacing: 3, marginTop: 12 }}>
          PLAY TOGETHER
        </div>
      </div>

      {modes.map((m) => (
        <ModeCard key={m.id} icon={m.icon} title={m.title} desc={m.desc} accent={m.accent}
          active={mode === m.id} onClick={() => setMode(m.id)} />
      ))}

      {/* room code for private */}
      {mode === 'private' && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '12px 16px', marginTop: 4, marginBottom: 6,
        }}>
          <div>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: 1 }}>ROOM CODE</div>
            <div style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, color: '#fff', fontSize: 28, letterSpacing: 4 }}>{code}</div>
          </div>
          <div style={{
            fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 13, color: '#0095DA',
            background: 'rgba(0,149,218,0.15)', padding: '8px 14px', borderRadius: 12,
          }}>Share 🔗</div>
        </div>
      )}

      {/* players slider */}
      <div style={{ marginTop: 14, padding: '0 2px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, color: '#fff', fontSize: 14 }}>Players</span>
          <span style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, color: '#FFC400', fontSize: 20 }}>{players}</span>
        </div>
        <input type="range" min={2} max={8} step={1} value={players}
          onChange={(e) => setPlayers(+e.target.value)}
          style={{ width: '100%', accentColor: '#FFC400' }} />
        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4 }}>
          {mode === 'passplay' ? `${players} people on this device` :
            mode === 'spectate' ? `${players} bots at the table` :
            `You + ${players - 1} friend${players - 1 > 1 ? 's' : ''}`}
        </div>
      </div>

      {/* stacking toggle */}
      <button onClick={() => setStack(!stack)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
        marginTop: 16, padding: '13px 16px', borderRadius: 16, cursor: 'pointer', border: 'none',
        background: 'rgba(255,255,255,0.05)', textAlign: 'left',
      }}>
        <div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, color: '#fff', fontSize: 14 }}>Stacking +2 / +4</div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 600, color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>Pile penalties onto the next player</div>
        </div>
        <div style={{
          width: 46, height: 27, borderRadius: 14, background: stack ? '#1FA84C' : 'rgba(255,255,255,0.18)',
          position: 'relative', transition: 'background .15s', flex: '0 0 auto',
        }}>
          <div style={{
            position: 'absolute', top: 3, left: stack ? 22 : 3, width: 21, height: 21, borderRadius: '50%',
            background: '#fff', transition: 'left .15s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }} />
        </div>
      </button>

      <button onClick={() => onStart({ mode, players, stack })} style={{
        width: '100%', marginTop: 22, border: 'none', borderRadius: 18, cursor: 'pointer',
        padding: '17px', background: 'linear-gradient(180deg,#FFD166,#F4A100)', color: '#3a2600',
        fontFamily: "'Fredoka',sans-serif", fontWeight: 600, fontSize: 20,
        boxShadow: '0 10px 26px rgba(244,161,0,0.45)',
      }}>
        {mode === 'spectate' ? 'Watch game' : 'Start game'}
      </button>
     </div>
    </div>
  );
}

Object.assign(window, { Lobby });
