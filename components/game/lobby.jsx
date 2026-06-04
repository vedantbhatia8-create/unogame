'use client';

import React from 'react';

function genCode() {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 5 }, () => a[Math.floor(Math.random() * a.length)]).join('');
}

function ModeCard({ icon, title, desc, active, onClick, accent }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
      padding: 14, borderRadius: 18, cursor: 'pointer', marginBottom: 10,
      border: active ? `2px solid ${accent}` : '2px solid rgba(255,255,255,0.08)',
      background: active ? `${accent}22` : 'rgba(255,255,255,0.03)',
      transition: 'all .15s',
      boxShadow: active ? `0 0 20px ${accent}30` : 'none',
    }}>
      <div style={{
        width: 46, height: 46, borderRadius: 13, background: active ? accent : `${accent}55`, flex: '0 0 auto',
        display: 'grid', placeItems: 'center', fontSize: 22,
        boxShadow: active ? `0 0 0 3px rgba(255,255,255,0.85) inset, 0 4px 12px ${accent}60` : '0 0 0 3px rgba(255,255,255,0.15) inset',
        transition: 'all .15s',
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 600, color: active ? '#fff' : 'rgba(255,255,255,0.8)', fontSize: 17, lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 600, color: 'rgba(255,255,255,0.45)', fontSize: 12.5, marginTop: 2 }}>{desc}</div>
      </div>
      <div style={{
        width: 22, height: 22, borderRadius: '50%', flex: '0 0 auto',
        border: active ? 'none' : '2px solid rgba(255,255,255,0.2)',
        background: active ? accent : 'transparent', display: 'grid', placeItems: 'center',
        color: '#fff', fontSize: 13, fontWeight: 900,
        boxShadow: active ? `0 0 8px ${accent}80` : 'none',
      }}>{active ? '✓' : ''}</div>
    </button>
  );
}

export function Lobby({ onStart, layout = 'mobile' }) {
  const [mode, setMode] = React.useState('private');
  const [players, setPlayers] = React.useState(4);
  const [stack, setStack] = React.useState(true);
  const [code] = React.useState(genCode);
  const big = layout === 'desktop';

  const modes = [
    { id: 'private',  icon: '🎟️', title: 'Private room',  desc: 'Play with friends using a code', accent: '#0095DA' },
    { id: 'passplay', icon: '🤝', title: 'Pass & play',    desc: 'Share one device, pass each turn', accent: '#1FA84C' },
    { id: 'spectate', icon: '👁️', title: 'Spectate',       desc: 'Watch a table play out',          accent: '#A78BFA' },
  ];

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'auto',
      background: 'radial-gradient(ellipse 160% 90% at 50% -5%, #251644 0%, #120d24 45%, #080612 100%)',
      padding: big ? '48px 20px' : '56px 20px 40px', boxSizing: 'border-box',
      display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
    }}>
      {/* Background glow blobs */}
      <div style={{ position: 'fixed', top: '-10%', left: '-5%', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(228,0,43,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '0%', right: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,149,218,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', top: '40%', right: '0%', width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(31,168,76,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: big ? 460 : 'none', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div style={{ display: 'inline-flex', gap: 6, transform: 'rotate(-4deg)' }}>
            {[['U', '#E4002B'], ['N', '#1FA84C'], ['O', '#0095DA']].map(([l, c], i) => (
              <span key={i} style={{
                fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontStyle: 'italic',
                fontSize: 58, color: '#fff', lineHeight: 1,
                width: 52, height: 64, display: 'grid', placeItems: 'center',
                background: c, borderRadius: 14, transform: `rotate(${(i - 1) * 5}deg)`,
                boxShadow: `0 0 0 4px rgba(255,255,255,0.92) inset, 0 10px 24px ${c}70`,
              }}>{l}</span>
            ))}
          </div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, color: '#FFC400', fontSize: 11, letterSpacing: 3, marginTop: 14 }}>
            PLAY TOGETHER
          </div>
        </div>

        {modes.map((m) => (
          <ModeCard key={m.id} {...m} active={mode === m.id} onClick={() => setMode(m.id)} />
        ))}

        {mode === 'private' && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(0,149,218,0.08)', border: '1px solid rgba(0,149,218,0.2)',
            borderRadius: 16, padding: '12px 16px', marginTop: 4, marginBottom: 6,
            boxShadow: '0 0 20px rgba(0,149,218,0.08)',
          }}>
            <div>
              <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, color: 'rgba(255,255,255,0.45)', fontSize: 10, letterSpacing: 1.5 }}>ROOM CODE</div>
              <div style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, color: '#fff', fontSize: 28, letterSpacing: 5 }}>{code}</div>
            </div>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 12, color: '#0095DA', background: 'rgba(0,149,218,0.15)', border: '1px solid rgba(0,149,218,0.25)', padding: '8px 14px', borderRadius: 12 }}>
              Share 🔗
            </div>
          </div>
        )}

        <div style={{ marginTop: 14, padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>Players</span>
            <span style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, color: '#FFC400', fontSize: 22 }}>{players}</span>
          </div>
          <input type="range" min={2} max={8} step={1} value={players}
            onChange={(e) => setPlayers(+e.target.value)}
            style={{ width: '100%', accentColor: '#FFC400' }} />
          <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 6 }}>
            {mode === 'passplay' ? `${players} people on this device` :
              mode === 'spectate' ? `${players} bots at the table` :
              `You + ${players - 1} friend${players - 1 > 1 ? 's' : ''}`}
          </div>
        </div>

        <button onClick={() => setStack(!stack)} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
          marginTop: 10, padding: '13px 16px', borderRadius: 16, cursor: 'pointer',
          background: stack ? 'rgba(31,168,76,0.08)' : 'rgba(255,255,255,0.03)',
          border: stack ? '1px solid rgba(31,168,76,0.2)' : '1px solid rgba(255,255,255,0.07)',
          textAlign: 'left', transition: 'all .15s',
          boxShadow: stack ? '0 0 20px rgba(31,168,76,0.08)' : 'none',
        }}>
          <div>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, color: '#fff', fontSize: 14 }}>Stacking +2 / +4</div>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 600, color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Pile penalties onto the next player</div>
          </div>
          <div style={{ width: 46, height: 27, borderRadius: 14, background: stack ? '#1FA84C' : 'rgba(255,255,255,0.15)', position: 'relative', transition: 'background .2s', flex: '0 0 auto', boxShadow: stack ? '0 0 10px rgba(31,168,76,0.5)' : 'none' }}>
            <div style={{ position: 'absolute', top: 3, left: stack ? 22 : 3, width: 21, height: 21, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
          </div>
        </button>

        <button onClick={() => onStart({ mode, players, stack })} style={{
          width: '100%', marginTop: 20, border: 'none', borderRadius: 18, cursor: 'pointer', padding: '17px',
          background: 'linear-gradient(160deg, #FFD166, #F4A100)',
          color: '#3a2600',
          fontFamily: "'Fredoka',sans-serif", fontWeight: 600, fontSize: 20,
          boxShadow: '0 12px 32px rgba(244,161,0,0.5), 0 0 0 1px rgba(255,255,255,0.15) inset',
        }}>
          {mode === 'spectate' ? 'Watch game' : 'Start game'} →
        </button>
      </div>
    </div>
  );
}
