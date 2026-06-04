'use client';

import React from 'react';
import { top, canPlay } from './engine';
import { Card, CardBack } from './cards';
import { UnoCallOverlay } from './overlays';

function colorGlow(color) {
  return ({ red: '#E4002B', yellow: '#FFC400', green: '#1FA84C', blue: '#0095DA', wild: '#9b8cff' }[color]) || '#9b8cff';
}

function OpponentPod({ player, active, color, big }) {
  const count = player.hand.length;
  const glow = colorGlow(color);
  const fan = Math.min(count, 5);
  const av = big ? 62 : 46;
  const fanW = big ? 17 : 13, fanH = big ? 26 : 20;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: big ? 5 : 3,
      width: big ? 100 : 70, transition: 'transform .2s', transform: active ? 'scale(1.06)' : 'scale(1)',
    }}>
      <div style={{ position: 'relative' }}>
        <div style={{
          width: av, height: av, borderRadius: '50%', background: player.avatar.bg,
          display: 'grid', placeItems: 'center', fontSize: big ? 32 : 24,
          boxShadow: active ? `0 0 0 3px ${glow}, 0 0 20px ${glow}` : '0 2px 6px rgba(0,0,0,0.4)',
          transition: 'box-shadow .2s',
        }}>{player.avatar.glyph}</div>
        <div style={{
          position: 'absolute', bottom: -4, right: big ? -10 : -8,
          minWidth: big ? 24 : 20, height: big ? 24 : 20, padding: '0 5px',
          borderRadius: 12, background: '#17171F', color: '#fff', boxSizing: 'border-box',
          fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: big ? 14 : 12,
          display: 'grid', placeItems: 'center', boxShadow: '0 0 0 2px rgba(255,255,255,0.85)',
        }}>{count}</div>
        {count === 1 && player.saidUno && (
          <div style={{
            position: 'absolute', top: big ? -13 : -10, left: '50%', transform: 'translateX(-50%) rotate(-8deg)',
            background: '#E4002B', color: '#fff', fontFamily: "'Fredoka',sans-serif", fontWeight: 700,
            fontStyle: 'italic', fontSize: big ? 12 : 10, padding: '1px 7px', borderRadius: 6,
            boxShadow: '0 0 0 1.5px #fff', letterSpacing: '-0.02em',
          }}>UNO</div>
        )}
      </div>
      <div style={{ display: 'flex', height: fanH + 2, alignItems: 'center', justifyContent: 'center' }}>
        {Array.from({ length: fan }).map((_, i) => (
          <div key={i} style={{
            width: fanW, height: fanH, borderRadius: 3, background: '#17171F',
            marginLeft: i ? -(fanW * 0.55) : 0,
            boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.85)',
            transform: `rotate(${(i - (fan - 1) / 2) * 10}deg)`,
          }} />
        ))}
      </div>
      <div style={{
        fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: big ? 13 : 11,
        color: active ? '#fff' : 'rgba(255,255,255,0.62)', maxWidth: big ? 100 : 70,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{player.name}</div>
    </div>
  );
}

function CenterPiles({ state, onDraw, canDraw, big }) {
  const t = top(state);
  const glow = colorGlow(state.activeColor);
  const pending = state.pending;
  const dirIcon = state.direction === 1 ? '↻' : '↺';
  const drawW = big ? 90 : 66, discW = big ? 108 : 78;
  const halo = big ? 320 : 230, ring = big ? 286 : 196;
  return (
    <div style={{ position: 'relative', display: 'grid', placeItems: 'center', flex: 1, minHeight: 0 }}>
      <div style={{
        position: 'absolute', width: halo, height: halo, borderRadius: '50%',
        background: `radial-gradient(circle, ${glow}44, transparent 68%)`, filter: 'blur(2px)', transition: 'background .35s',
      }} />
      <div style={{ position: 'absolute', width: ring, height: ring, borderRadius: '50%', border: `2px dashed ${glow}55` }} />
      <div style={{ position: 'absolute', width: ring, height: ring, pointerEvents: 'none' }}>
        <span style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', color: glow, fontSize: big ? 32 : 26, fontWeight: 700 }}>{dirIcon}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: big ? 42 : 26, position: 'relative' }}>
        {/* Draw pile */}
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: drawW + 4, height: drawW * 1.5 + 5 }}>
            <CardBack w={drawW} style={{ position: 'absolute', top: 4, left: 6, opacity: 0.5 }} />
            <CardBack w={drawW} style={{ position: 'absolute', top: 2, left: 3, opacity: 0.75 }} />
            <CardBack w={drawW} onClick={canDraw ? onDraw : undefined} style={{
              position: 'absolute', top: 0, left: 0, cursor: canDraw ? 'pointer' : 'default',
              outline: canDraw ? '3px solid rgba(255,209,102,0.9)' : 'none', outlineOffset: 2,
              animation: canDraw ? 'drawHint 1.4s ease-in-out infinite' : 'none',
            }} />
          </div>
          <div style={{ marginTop: 8, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: big ? 13 : 11, color: 'rgba(255,255,255,0.5)' }}>
            DRAW · {state.drawPile.length}
          </div>
        </div>
        {/* Discard pile */}
        <div style={{ position: 'relative', width: discW + 6, height: discW * 1.5 + 6 }}>
          {state.discardPile.slice(-3, -1).map((c, i) => (
            <Card key={c.id} card={c} w={discW} style={{
              position: 'absolute', top: 0, left: 0,
              transform: `rotate(${(i - 1) * 8}deg) translate(${(i - 1) * 4}px,0)`, opacity: 0.9,
            }} />
          ))}
          <Card key={t.id} card={t} w={discW} style={{
            position: 'absolute', top: 0, left: 3, transform: 'rotate(4deg)',
            animation: 'playLand .28s cubic-bezier(.2,1.3,.5,1)',
          }} />
        </div>
      </div>
      {pending.draw > 0 && (
        <div style={{
          position: 'absolute', bottom: big ? 0 : 6, background: '#E4002B', color: '#fff',
          fontFamily: "'Fredoka',sans-serif", fontWeight: 600, fontSize: big ? 17 : 15,
          padding: '6px 16px', borderRadius: 20,
          boxShadow: '0 0 0 3px rgba(255,255,255,0.92), 0 6px 16px rgba(228,0,43,0.5)',
          animation: 'pendPulse 1s ease-in-out infinite',
        }}>⚠ Stack or draw +{pending.draw}</div>
      )}
    </div>
  );
}

function HandRow({ player, cardPlayable, onCardTap, disabled, big }) {
  const hand = player.hand;
  const n = hand.length;
  const w = big ? (n > 11 ? 78 : n > 8 ? 90 : 104) : (n > 9 ? 60 : n > 7 ? 66 : 74);
  const overlap = big ? (n > 11 ? -24 : -10) : (n > 9 ? -22 : n > 7 ? -16 : -8);
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
      overflowX: 'auto', overflowY: 'visible',
      padding: big ? '30px 24px 24px' : '26px 16px 34px', gap: 0, minHeight: w * 1.5 + 30,
      WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
    }}>
      {hand.map((c, i) => {
        const playable = !disabled && cardPlayable(c);
        return (
          <Card key={c.id} card={c} w={w}
            onClick={playable ? () => onCardTap(c) : undefined}
            playable={playable} dim={!disabled && !playable}
            style={{
              marginLeft: i ? overlap : 0,
              transform: playable ? `translateY(${big ? -20 : -14}px)` : 'translateY(0)',
              zIndex: playable ? 10 + i : i,
            }}
          />
        );
      })}
    </div>
  );
}

function actionBtn(c, big) {
  return {
    border: 'none', cursor: 'pointer', padding: big ? '11px 22px' : '9px 16px', borderRadius: 14,
    fontFamily: "'Fredoka',sans-serif", fontWeight: 600, fontSize: big ? 17 : 15, color: '#fff',
    background: c, boxShadow: '0 0 0 3px rgba(255,255,255,0.85) inset, 0 5px 14px rgba(0,0,0,0.35)',
  };
}

export function Table({ state, view, isMyTurn, spectating, onCardTap, onDraw, onPass, onCallUno, unoWindow, onCatch, onExit, tweaks, layout }) {
  const big = layout === 'desktop';
  const me = state.players[view];
  const t = top(state);
  const opponents = state.players.filter((_, i) => i !== view);

  const cardPlayable = (c) => {
    if (!isMyTurn) return false;
    if (state.hasDrawn && state.justDrew) {
      return c.id === state.justDrew && canPlay(c, t, state.activeColor, state.pending, state.allowStack);
    }
    return canPlay(c, t, state.activeColor, state.pending, state.allowStack);
  };

  const anyPlayable = isMyTurn && me.hand.some(cardPlayable);
  const canDrawNow = isMyTurn && !state.hasDrawn && !spectating;
  const showPass = isMyTurn && state.hasDrawn && !spectating;
  const curName = state.players[state.current].name;
  const catchable = state.catchTarget && state.players.find((p) => p.id === state.catchTarget && p.id !== me.id);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: tweaks.tableBg || 'radial-gradient(120% 80% at 50% 18%, #2a2150 0%, #1a1430 45%, #0d0a18 100%)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: big ? '18px 30px 8px' : '52px 16px 4px', position: 'relative', zIndex: 5,
      }}>
        <button onClick={onExit} style={{
          width: big ? 40 : 34, height: big ? 40 : 34, borderRadius: 12, border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: big ? 22 : 18, lineHeight: 1,
        }}>‹</button>
        <div style={{
          fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: big ? 14 : 12, letterSpacing: 1,
          color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase',
        }}>
          {spectating ? '👁 Spectating' : (isMyTurn ? 'Your turn' : curName + "'s turn")}
        </div>
        <div style={{
          minWidth: big ? 40 : 34, height: big ? 40 : 34, borderRadius: 12, padding: '0 11px',
          boxSizing: 'border-box', background: 'rgba(255,255,255,0.1)', color: '#fff',
          display: 'flex', alignItems: 'center', gap: 5,
          fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: big ? 14 : 13,
        }}>
          <span>🃏</span>{state.players.length}
        </div>
      </div>

      {/* Opponents */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: big ? '16px 14px' : '10px 6px',
        padding: big ? '14px 24px 4px' : '8px 10px 2px', position: 'relative', zIndex: 4,
      }}>
        {opponents.map((p) => {
          const idx = state.players.indexOf(p);
          return (
            <div key={p.id} style={{ position: 'relative' }}>
              <OpponentPod player={p} active={idx === state.current} color={state.activeColor} big={big} />
              {catchable && catchable.id === p.id && (
                <button onClick={() => onCatch(p.id)} style={{
                  position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                  background: '#FFD166', color: '#3a2600', border: 'none', cursor: 'pointer',
                  fontFamily: "'Fredoka',sans-serif", fontWeight: 600, fontSize: big ? 12 : 11,
                  padding: '3px 9px', borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  whiteSpace: 'nowrap', zIndex: 30, animation: 'unoPulse .7s ease-in-out infinite',
                }}>Catch!</button>
              )}
            </div>
          );
        })}
      </div>

      <CenterPiles state={state} onDraw={onDraw} canDraw={canDrawNow} big={big} />

      {/* Player row */}
      <div style={{ position: 'relative', zIndex: 6, maxWidth: big ? 980 : 'none', width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: big ? '0 30px' : '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, opacity: isMyTurn ? 1 : 0.7 }}>
            <div style={{
              width: big ? 42 : 34, height: big ? 42 : 34, borderRadius: '50%', background: me.avatar.bg,
              display: 'grid', placeItems: 'center', fontSize: big ? 22 : 18,
              boxShadow: isMyTurn ? `0 0 0 2.5px ${colorGlow(state.activeColor)}` : 'none',
            }}>{me.avatar.glyph}</div>
            <div>
              <div style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 600, color: '#fff', fontSize: big ? 17 : 15, lineHeight: 1.1 }}>
                {spectating ? 'Watching ' + me.name : me.name}
              </div>
              <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontSize: big ? 12 : 11 }}>
                {me.hand.length} cards
              </div>
            </div>
          </div>

          {!spectating && (
            <button onClick={onCallUno} disabled={me.hand.length > 2} style={{
              border: 'none', cursor: me.hand.length > 2 ? 'default' : 'pointer',
              padding: big ? '11px 24px' : '9px 18px', borderRadius: 14,
              fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontStyle: 'italic',
              fontSize: big ? 19 : 17, letterSpacing: '-0.03em',
              background: me.hand.length <= 2 ? 'linear-gradient(180deg,#FF5A5A,#E4002B)' : 'rgba(255,255,255,0.08)',
              color: me.hand.length <= 2 ? '#fff' : 'rgba(255,255,255,0.3)',
              boxShadow: me.hand.length <= 2 ? '0 0 0 3px rgba(255,255,255,0.9) inset, 0 6px 16px rgba(228,0,43,0.45)' : 'none',
              animation: (me.hand.length === 1 && !me.saidUno) ? 'unoPulse .7s ease-in-out infinite' : 'none',
            }}>UNO!</button>
          )}

          {showPass ? (
            <button onClick={onPass} style={actionBtn('#0095DA', big)}>Pass</button>
          ) : (
            <button onClick={canDrawNow ? onDraw : undefined} disabled={!canDrawNow} style={{
              ...actionBtn('#1FA84C', big), opacity: canDrawNow ? 1 : 0.35, cursor: canDrawNow ? 'pointer' : 'default',
            }}>Draw</button>
          )}
        </div>

        {isMyTurn && !spectating && !anyPlayable && !state.hasDrawn && (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontFamily: "'Nunito',sans-serif", fontSize: 12, fontWeight: 700, marginTop: 6 }}>
            No playable card — tap the deck to draw
          </div>
        )}

        <HandRow player={me} cardPlayable={cardPlayable} onCardTap={onCardTap} disabled={spectating || !isMyTurn} big={big} />
      </div>

      {unoWindow && <UnoCallOverlay onCall={onCallUno} remaining={unoWindow.remaining} />}
    </div>
  );
}
