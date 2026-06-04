'use client';

import React from 'react';
import * as E from './engine';
import { Table } from './table';
import { Lobby } from './lobby';
import { WildPicker, WinOverlay, PassScreen } from './overlays';
import { useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakToggle, TweakSelect } from './tweaks';
import { IOSDevice } from './frames';

const THEMES = {
  night:    'radial-gradient(120% 80% at 50% 18%, #2a2150 0%, #1a1430 45%, #0d0a18 100%)',
  felt:     'radial-gradient(120% 80% at 50% 18%, #1c6b43 0%, #0f4d2e 45%, #06351e 100%)',
  charcoal: 'radial-gradient(120% 80% at 50% 18%, #3a3a44 0%, #232329 45%, #141418 100%)',
  ocean:    'radial-gradient(120% 80% at 50% 18%, #1b4a6b 0%, #103a52 45%, #07202f 100%)',
};

const TWEAK_DEFAULTS = { theme: 'night', turnSpeed: 3000, confetti: true, botForget: true };

// ── Game state machine ────────────────────────────────────────────────────────

function UnoApp({ layout }) {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = React.useState('lobby'); // lobby | table | pass
  const [gs, setGs] = React.useState(null);
  const [opts, setOpts] = React.useState(null);
  const [shownSeat, setShownSeat] = React.useState(0);
  const [passTarget, setPassTarget] = React.useState(0);
  const [wildCard, setWildCard] = React.useState(null);
  const [unoWindow, setUnoWindow] = React.useState(null);

  function start(o) {
    setOpts(o);
    let cfg;
    if (o.mode === 'passplay') cfg = { humanCount: o.players, botCount: 0, mode: 'passplay' };
    else if (o.mode === 'spectate') cfg = { humanCount: 0, botCount: o.players, mode: 'spectate' };
    else cfg = { humanCount: 1, botCount: o.players - 1, mode: 'private' };
    cfg.allowStack = o.stack;
    const state = E.newGame(cfg);
    setGs(state);
    setUnoWindow(null);
    setWildCard(null);
    if (o.mode === 'passplay') { setShownSeat(0); setPassTarget(0); setScreen('pass'); }
    else { setShownSeat(0); setScreen('table'); }
  }

  // Bot loop
  React.useEffect(() => {
    if (!gs || gs.status !== 'playing' || screen !== 'table') return;
    const cur = gs.players[gs.current];
    if (cur.isHuman && gs.mode !== 'spectate') return;
    const id = setTimeout(() => {
      setGs((prev) => {
        if (!prev || prev.status !== 'playing') return prev;
        const c = prev.players[prev.current];
        if (c.isHuman && prev.mode !== 'spectate') return prev;
        const dec = E.botDecide(prev);
        if (dec.type === 'draw') return E.drawAction(prev, prev.current);
        return E.playCard(prev, prev.current, dec.card.id, dec.card.color, t.botForget);
      });
    }, Math.max(3000, t.turnSpeed));
    return () => clearTimeout(id);
  }, [gs?.seq, gs?.current, gs?.status, screen, t.turnSpeed, t.botForget]);

  // UNO call window
  React.useEffect(() => {
    if (!gs || !gs.catchTarget) { setUnoWindow(null); return; }
    const target = gs.players.find((p) => p.id === gs.catchTarget);
    if (!target) { setUnoWindow(null); return; }
    const isHuman = target.isHuman;
    const DUR = isHuman ? 3400 : 4200;
    const startT = Date.now();
    if (isHuman) setUnoWindow({ remaining: 1 }); else setUnoWindow(null);
    let raf;
    const tick = () => {
      const el = Date.now() - startT;
      if (isHuman) setUnoWindow({ remaining: Math.max(0, 1 - el / DUR) });
      if (el >= DUR) {
        setGs((prev) => {
          if (!prev || prev.catchTarget !== target.id) return prev;
          const idx = prev.players.findIndex((p) => p.id === target.id);
          return isHuman ? E.catchPlayer(prev, target.id) : E.callUno(prev, idx);
        });
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [gs?.catchTarget]);

  // Pass-and-play handoff
  React.useEffect(() => {
    if (!gs || gs.mode !== 'passplay' || gs.status !== 'playing' || screen !== 'table') return;
    const ct = gs.catchTarget && gs.players.find((p) => p.id === gs.catchTarget);
    if (ct && ct.isHuman) return;
    if (shownSeat !== gs.current) { setPassTarget(gs.current); setScreen('pass'); }
  }, [gs?.seq, gs?.current, gs?.catchTarget, shownSeat, screen, gs?.mode, gs?.status]);

  if (!gs || screen === 'lobby') {
    return (
      <>
        <Lobby onStart={start} layout={layout} />
        <GameTweaks t={t} setTweak={setTweak} />
      </>
    );
  }

  const viewSeat = gs.mode === 'passplay' ? shownSeat : 0;
  const spectating = gs.mode === 'spectate';
  const isMyTurn = screen === 'table' && !spectating && gs.current === viewSeat && gs.status === 'playing';

  const onCardTap = (card) => {
    if (E.isWild(card)) { setWildCard(card); return; }
    setGs((prev) => E.playCard(prev, prev.current, card.id, undefined, t.botForget));
  };
  const pickWild = (color) => {
    const c = wildCard; setWildCard(null);
    setGs((prev) => E.playCard(prev, prev.current, c.id, color, t.botForget));
  };
  const onDraw     = () => setGs((prev) => E.drawAction(prev, prev.current));
  const onPass     = () => setGs((prev) => E.passAfterDraw(prev));
  const onCallUno  = () => setGs((prev) => E.callUno(prev, viewSeat));
  const onCatch    = (id) => setGs((prev) => E.catchPlayer(prev, id));
  const onExit     = () => { setScreen('lobby'); setGs(null); };
  const winner     = gs.status === 'won' ? gs.players.find((p) => p.id === gs.winner) : null;

  return (
    <>
      <Table
        state={gs} view={viewSeat} isMyTurn={isMyTurn} spectating={spectating}
        onCardTap={onCardTap} onDraw={onDraw} onPass={onPass}
        onCallUno={onCallUno} onCatch={onCatch} onExit={onExit}
        unoWindow={isMyTurn || gs.mode !== 'passplay' ? unoWindow : null}
        tweaks={{ tableBg: THEMES[t.theme] }}
        layout={layout}
      />

      {wildCard && (
        <WildPicker plusFour={wildCard.kind === 'wild4'} onPick={pickWild} onCancel={() => setWildCard(null)} />
      )}

      {screen === 'pass' && gs.status === 'playing' && (
        <PassScreen
          player={gs.players[passTarget]}
          onReady={() => { setShownSeat(passTarget); setScreen('table'); }}
        />
      )}

      {winner && (
        <WinOverlay
          winner={winner} players={gs.players} confetti={t.confetti}
          onPlayAgain={() => start(opts)} onExit={onExit}
        />
      )}

      <GameTweaks t={t} setTweak={setTweak} />
    </>
  );
}

function GameTweaks({ t, setTweak }) {
  return (
    <TweaksPanel>
      <TweakSection label="Table" />
      <TweakSelect label="Felt theme" value={t.theme}
        options={['night', 'felt', 'charcoal', 'ocean']}
        onChange={(v) => setTweak('theme', v)} />
      <TweakSection label="Gameplay" />
      <TweakSlider label="Bot speed" value={t.turnSpeed} min={3000} max={8000} step={250} unit="ms"
        onChange={(v) => setTweak('turnSpeed', v)} />
      <TweakToggle label="Bots may forget UNO" value={t.botForget} onChange={(v) => setTweak('botForget', v)} />
      <TweakToggle label="Winner confetti" value={t.confetti} onChange={(v) => setTweak('confetti', v)} />
    </TweaksPanel>
  );
}

// ── Layout toggle ─────────────────────────────────────────────────────────────

function LayoutToggle({ layout, onChange }) {
  const opt = (id, icon, label) => (
    <button onClick={() => onChange(id)} style={{
      display: 'flex', alignItems: 'center', gap: 7, border: 'none', cursor: 'pointer',
      padding: '8px 16px', borderRadius: 11,
      background: layout === id ? '#fff' : 'transparent',
      color: layout === id ? '#17171F' : 'rgba(255,255,255,0.65)',
      fontFamily: "'Nunito', system-ui, sans-serif", fontWeight: 800, fontSize: 13,
      boxShadow: layout === id ? '0 2px 8px rgba(0,0,0,0.25)' : 'none',
      transition: 'all .15s',
    }}>
      <span style={{ fontSize: 15 }}>{icon}</span>{label}
    </button>
  );
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
      <div style={{
        display: 'flex', gap: 4, padding: 4, borderRadius: 14,
        background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(8px)',
      }}>
        {opt('mobile',  '📱', 'Mobile')}
        {opt('desktop', '🖥️', 'Desktop')}
      </div>
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────

export default function UnoGame() {
  const [layout, setLayout] = React.useState('mobile');
  const [scale, setScale] = React.useState(1);

  // Read persisted layout after mount (localStorage not available during SSR)
  React.useEffect(() => {
    const saved = localStorage.getItem('uno_layout');
    if (saved === 'mobile' || saved === 'desktop') setLayout(saved);
  }, []);

  const isDesk = layout === 'desktop';
  const W = isDesk ? 1200 : 402;
  const H = isDesk ? 780  : 874;
  const cap = isDesk ? 1.0 : 1.18;

  React.useEffect(() => {
    const fit = () => {
      const sw = window.innerWidth - 24;
      const sh = window.innerHeight - 76;
      setScale(Math.min(sw / W, sh / H, cap));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [W, H, cap]);

  const change = (l) => {
    setLayout(l);
    localStorage.setItem('uno_layout', l);
  };

  const inner = (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <UnoApp layout={layout} />
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <LayoutToggle layout={layout} onChange={change} />
      <div style={{ flex: 1, display: 'grid', placeItems: 'center', minHeight: 0, overflow: 'hidden' }}>
        <div style={{ width: W * scale, height: H * scale }}>
          <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            {isDesk ? inner : <IOSDevice dark width={W} height={H}>{inner}</IOSDevice>}
          </div>
        </div>
      </div>
    </div>
  );
}
