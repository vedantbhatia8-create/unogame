// uno-app.jsx — root app: screen routing, bot loop, UNO windows, pass handoff, tweaks.
const E = window.UnoEngine;

const THEMES = {
  night: 'radial-gradient(120% 80% at 50% 18%, #2a2150 0%, #1a1430 45%, #0d0a18 100%)',
  felt: 'radial-gradient(120% 80% at 50% 18%, #1c6b43 0%, #0f4d2e 45%, #06351e 100%)',
  charcoal: 'radial-gradient(120% 80% at 50% 18%, #3a3a44 0%, #232329 45%, #141418 100%)',
  ocean: 'radial-gradient(120% 80% at 50% 18%, #1b4a6b 0%, #103a52 45%, #07202f 100%)',
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "night",
  "turnSpeed": 850,
  "confetti": true,
  "botForget": true
}/*EDITMODE-END*/;

function App({ layout = 'mobile' }) {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = React.useState('lobby'); // lobby | pass | table
  const [gs, setGs] = React.useState(null);
  const [opts, setOpts] = React.useState(null);
  const [shownSeat, setShownSeat] = React.useState(0);
  const [passTarget, setPassTarget] = React.useState(0);
  const [wildCard, setWildCard] = React.useState(null);
  const [unoWindow, setUnoWindow] = React.useState(null);

  // ---- start / restart ----
  function start(o) {
    setOpts(o);
    const n = o.players;
    let cfg;
    if (o.mode === 'passplay') cfg = { humanCount: n, botCount: 0, mode: 'passplay' };
    else if (o.mode === 'spectate') cfg = { humanCount: 0, botCount: n, mode: 'spectate' };
    else cfg = { humanCount: 1, botCount: n - 1, mode: 'private' };
    cfg.allowStack = o.stack;
    const state = E.newGame(cfg);
    setGs(state);
    setUnoWindow(null);
    setWildCard(null);
    if (o.mode === 'passplay') { setShownSeat(0); setPassTarget(0); setScreen('pass'); }
    else { setShownSeat(0); setScreen('table'); }
  }

  // ---- bot loop ----
  React.useEffect(() => {
    if (!gs || gs.status !== 'playing' || screen !== 'table') return;
    const cur = gs.players[gs.current];
    if (cur.isHuman && gs.mode !== 'spectate') return; // human acts manually
    const delay = Math.max(220, t.turnSpeed);
    const id = setTimeout(() => {
      setGs((prev) => {
        if (!prev || prev.status !== 'playing') return prev;
        const c = prev.players[prev.current];
        if (c.isHuman && prev.mode !== 'spectate') return prev;
        const dec = E.botDecide(prev, t.botForget);
        if (dec.type === 'draw') return E.drawAction(prev, prev.current);
        return E.playCard(prev, prev.current, dec.card.id, dec.card.color, t.botForget);
      });
    }, delay);
    return () => clearTimeout(id);
  }, [gs && gs.seq, gs && gs.current, gs && gs.status, screen, t.turnSpeed, t.botForget]);

  // ---- catch / UNO window ----
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
          if (isHuman) return E.catchPlayer(prev, target.id); // penalty for forgetting
          return E.callUno(prev, idx); // bot belatedly calls — no penalty
        });
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [gs && gs.catchTarget]);

  // ---- pass-and-play handoff ----
  React.useEffect(() => {
    if (!gs || gs.mode !== 'passplay' || gs.status !== 'playing' || screen !== 'table') return;
    const ct = gs.catchTarget && gs.players.find((p) => p.id === gs.catchTarget);
    if (ct && ct.isHuman) return; // let the mover's UNO window resolve first
    if (shownSeat !== gs.current) {
      setPassTarget(gs.current);
      setScreen('pass');
    }
  }, [gs && gs.seq, gs && gs.current, gs && gs.catchTarget, shownSeat, screen, gs && gs.mode, gs && gs.status]);

  if (!gs || screen === 'lobby') {
    return (<><Lobby onStart={start} tweaks={t} layout={layout} /><GameTweaks t={t} setTweak={setTweak} /></>);
  }

  const viewSeat = gs.mode === 'passplay' ? shownSeat : 0;
  const spectating = gs.mode === 'spectate';
  const isMyTurn = screen === 'table' && !spectating && gs.current === viewSeat && gs.status === 'playing';

  // ---- human actions ----
  const seatNow = () => gs.current; // acting human is always the current player
  const onCardTap = (card) => {
    if (E.isWild(card)) { setWildCard(card); return; }
    setGs((prev) => E.playCard(prev, prev.current, card.id, undefined, t.botForget));
  };
  const pickWild = (color) => {
    const c = wildCard; setWildCard(null);
    setGs((prev) => E.playCard(prev, prev.current, c.id, color, t.botForget));
  };
  const onDraw = () => setGs((prev) => E.drawAction(prev, prev.current));
  const onPass = () => setGs((prev) => E.passAfterDraw(prev));
  const onCallUno = () => setGs((prev) => E.callUno(prev, viewSeat));
  const onCatch = (id) => setGs((prev) => E.catchPlayer(prev, id));
  const onExit = () => { setScreen('lobby'); setGs(null); };

  const winner = gs.status === 'won' ? gs.players.find((p) => p.id === gs.winner) : null;

  return (
    <>
      <Table
        state={gs}
        view={viewSeat}
        isMyTurn={isMyTurn}
        spectating={spectating}
        onCardTap={onCardTap}
        onDraw={onDraw}
        onPass={onPass}
        onCallUno={onCallUno}
        onCatch={onCatch}
        onExit={onExit}
        unoWindow={isMyTurn || gs.mode !== 'passplay' ? unoWindow : null}
        tweaks={{ tableBg: THEMES[t.theme] }}
        layout={layout}
      />

      {wildCard && (
        <WildPicker plusFour={wildCard.kind === 'wild4'} onPick={pickWild} onCancel={() => setWildCard(null)} />
      )}

      {screen === 'pass' && gs.status === 'playing' && (
        <PassScreen player={gs.players[passTarget]} onReady={() => { setShownSeat(passTarget); setScreen('table'); }} />
      )}

      {winner && (
        <WinOverlay winner={winner} players={gs.players} confetti={t.confetti}
          onPlayAgain={() => start(opts)} onExit={onExit} />
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
      <TweakSlider label="Bot speed" value={t.turnSpeed} min={300} max={1600} step={50} unit="ms"
        onChange={(v) => setTweak('turnSpeed', v)} />
      <TweakToggle label="Bots may forget UNO" value={t.botForget}
        onChange={(v) => setTweak('botForget', v)} />
      <TweakToggle label="Winner confetti" value={t.confetti}
        onChange={(v) => setTweak('confetti', v)} />
    </TweaksPanel>
  );
}

window.UnoApp = App;
