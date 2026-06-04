export const COLORS = ['red', 'yellow', 'green', 'blue'];

export const HEX = {
  red: '#E4002B',
  yellow: '#FFC400',
  green: '#1FA84C',
  blue: '#0095DA',
  wild: '#17171F',
};

export const BOT_NAMES = ['Maya', 'Leo', 'Priya', 'Sam', 'Jordan', 'Aisha', 'Marco', 'Nina', 'Theo'];
export const AVATARS = [
  { bg: '#FF6B6B', glyph: '🦊' },
  { bg: '#4ECDC4', glyph: '🐧' },
  { bg: '#FFD166', glyph: '🐯' },
  { bg: '#A78BFA', glyph: '🦄' },
  { bg: '#F78FB3', glyph: '🐰' },
  { bg: '#6EE7B7', glyph: '🐸' },
  { bg: '#FCA5A5', glyph: '🦁' },
  { bg: '#93C5FD', glyph: '🐳' },
  { bg: '#FBBF24', glyph: '🐥' },
];

let _idc = 0;
const uid = () => 'c' + (++_idc);

export function buildDeck() {
  const deck = [];
  for (const color of COLORS) {
    deck.push({ id: uid(), color, kind: 'number', value: 0 });
    for (let v = 1; v <= 9; v++) {
      deck.push({ id: uid(), color, kind: 'number', value: v });
      deck.push({ id: uid(), color, kind: 'number', value: v });
    }
    for (let i = 0; i < 2; i++) {
      deck.push({ id: uid(), color, kind: 'skip' });
      deck.push({ id: uid(), color, kind: 'reverse' });
      deck.push({ id: uid(), color, kind: 'draw2' });
    }
  }
  for (let i = 0; i < 4; i++) {
    deck.push({ id: uid(), color: 'wild', kind: 'wild' });
    deck.push({ id: uid(), color: 'wild', kind: 'wild4' });
  }
  return deck;
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function isWild(card) {
  return card.kind === 'wild' || card.kind === 'wild4';
}

export function canPlay(card, top, activeColor, pending, allowStack) {
  if (pending.draw > 0) {
    if (!allowStack) return false;
    if (pending.type === 'draw2') return card.kind === 'draw2' || card.kind === 'wild4';
    if (pending.type === 'draw4') return card.kind === 'wild4';
    return false;
  }
  if (isWild(card)) return true;
  if (card.color === activeColor) return true;
  if (card.kind === 'number' && top.kind === 'number' && card.value === top.value) return true;
  if (card.kind !== 'number' && card.kind === top.kind) return true;
  return false;
}

export function newGame(opts) {
  const { humanCount = 1, botCount = 3, mode = 'private', allowStack = true, names = [] } = opts;
  const total = Math.min(8, humanCount + botCount);
  const players = [];
  const avs = shuffle(AVATARS);
  const botPool = shuffle(BOT_NAMES);
  let bi = 0;
  for (let i = 0; i < total; i++) {
    const human = mode === 'passplay' ? true : (mode === 'spectate' ? false : i === 0);
    const name = human
      ? (names[i] || (mode === 'passplay' ? 'Player ' + (i + 1) : 'You'))
      : botPool[bi++];
    players.push({ id: 'p' + i, name, isHuman: human, hand: [], avatar: avs[i % avs.length], saidUno: false });
  }

  let deck = shuffle(buildDeck());
  for (const p of players) p.hand = deck.splice(0, 7);

  let first;
  do {
    first = deck.shift();
    if (isWild(first)) deck.push(first);
  } while (isWild(first));

  const state = {
    mode, allowStack, players,
    drawPile: deck, discardPile: [first],
    activeColor: first.color, current: 0, direction: 1,
    pending: { draw: 0, type: null }, status: 'playing', winner: null,
    hasDrawn: false, justDrew: null,
    log: [{ id: uid(), text: 'Game on! ' + players[0].name + ' starts.' }],
    flash: null, seq: 0, viewSeat: 0, catchTarget: null,
  };
  applyStartEffect(state, first);
  return state;
}

function applyStartEffect(state, first) {
  if (first.kind === 'skip') {
    state.current = (state.current + state.direction + state.players.length) % state.players.length;
  } else if (first.kind === 'reverse') {
    state.direction *= -1;
    state.current = 0;
  } else if (first.kind === 'draw2') {
    state.pending = { draw: 2, type: 'draw2' };
  }
}

export function top(state) {
  return state.discardPile[state.discardPile.length - 1];
}

function reshuffleIfNeeded(state) {
  if (state.drawPile.length === 0 && state.discardPile.length > 1) {
    const keep = state.discardPile.pop();
    state.drawPile = shuffle(state.discardPile);
    state.discardPile = [keep];
  }
}

function drawN(state, player, n) {
  for (let i = 0; i < n; i++) {
    reshuffleIfNeeded(state);
    if (state.drawPile.length === 0) break;
    player.hand.push(state.drawPile.shift());
  }
  player.saidUno = false;
}

function advance(state, steps) {
  const n = state.players.length;
  state.current = ((state.current + state.direction * steps) % n + n) % n;
}

function pushLog(state, text) {
  state.log.push({ id: uid(), text });
  if (state.log.length > 40) state.log.shift();
}

export function cardLabel(card) {
  const cl = card.color === 'wild' ? '' : (card.color[0].toUpperCase() + card.color.slice(1) + ' ');
  if (card.kind === 'number') return cl + card.value;
  if (card.kind === 'skip') return cl + 'Skip';
  if (card.kind === 'reverse') return cl + 'Reverse';
  if (card.kind === 'draw2') return cl + '+2';
  if (card.kind === 'wild') return 'Wild';
  if (card.kind === 'wild4') return 'Wild +4';
  return cl;
}

function clone(s) {
  return {
    ...s,
    players: s.players.map((p) => ({ ...p, hand: p.hand.slice() })),
    drawPile: s.drawPile.slice(),
    discardPile: s.discardPile.slice(),
    pending: { ...s.pending },
    log: s.log.slice(),
    flash: s.flash ? { ...s.flash } : null,
  };
}

export function playCard(state, playerIndex, cardId, chosenColor, botForget) {
  const s = clone(state);
  s.seq++;
  const p = s.players[playerIndex];
  const idx = p.hand.findIndex((c) => c.id === cardId);
  if (idx < 0) return s;
  const card = p.hand[idx];
  if (!canPlay(card, top(s), s.activeColor, s.pending, s.allowStack)) return s;

  p.hand.splice(idx, 1);
  s.discardPile.push(card);
  s.hasDrawn = false; s.justDrew = null;
  s.flash = { playerId: p.id, type: 'play' };
  const n = s.players.length;
  const label = cardLabel(card);

  if (isWild(card)) {
    s.activeColor = chosenColor || COLORS[Math.floor(Math.random() * 4)];
  } else {
    s.activeColor = card.color;
  }

  if (p.hand.length === 1) {
    if (p.isHuman && s.mode !== 'spectate') {
      s.catchTarget = p.id; p.saidUno = false;
      pushLog(s, p.name + ' plays ' + label + '.');
    } else if (botForget && s.mode !== 'spectate' && Math.random() < 0.4) {
      p.saidUno = false; s.catchTarget = p.id;
      pushLog(s, p.name + ' plays ' + label + '…');
    } else {
      p.saidUno = true;
      pushLog(s, p.name + ' plays ' + label + ' — UNO!');
    }
  } else {
    pushLog(s, p.name + ' plays ' + label + '.');
  }

  if (p.hand.length === 0) {
    s.status = 'won'; s.winner = p.id;
    pushLog(s, '🏆 ' + p.name + ' wins!');
    return s;
  }

  switch (card.kind) {
    case 'skip':
      advance(s, 1);
      pushLog(s, s.players[s.current].name + ' is skipped!');
      advance(s, 1);
      break;
    case 'reverse':
      s.direction *= -1;
      if (n === 2) advance(s, 2); else advance(s, 1);
      break;
    case 'draw2':
      s.pending.draw += 2; s.pending.type = 'draw2';
      advance(s, 1);
      break;
    case 'wild4':
      s.pending.draw += 4; s.pending.type = 'draw4';
      advance(s, 1);
      break;
    default:
      advance(s, 1);
  }
  return s;
}

export function drawAction(state, playerIndex) {
  const s = clone(state);
  s.seq++;
  const p = s.players[playerIndex];
  if (s.pending.draw > 0) {
    const n = s.pending.draw;
    drawN(s, p, n);
    pushLog(s, p.name + ' draws ' + n + ' and loses a turn.');
    s.pending = { draw: 0, type: null };
    advance(s, 1);
    s.hasDrawn = false; s.justDrew = null;
  } else {
    drawN(s, p, 1);
    const drawn = p.hand[p.hand.length - 1];
    s.justDrew = drawn ? drawn.id : null;
    s.hasDrawn = true;
    pushLog(s, p.name + ' draws a card.');
    if (!drawn || !canPlay(drawn, top(s), s.activeColor, s.pending, s.allowStack)) {
      advance(s, 1);
      s.hasDrawn = false; s.justDrew = null;
    }
  }
  return s;
}

export function passAfterDraw(state) {
  const s = clone(state);
  s.seq++;
  s.hasDrawn = false; s.justDrew = null;
  advance(s, 1);
  return s;
}

export function callUno(state, playerIndex) {
  const s = clone(state);
  const p = s.players[playerIndex];
  if (p.hand.length <= 2) {
    p.saidUno = true;
    if (s.catchTarget === p.id) s.catchTarget = null;
    s.flash = { playerId: p.id, type: 'uno' };
    pushLog(s, p.name + ': UNO!');
  }
  return s;
}

export function catchPlayer(state, playerId) {
  const s = clone(state);
  const p = s.players.find((x) => x.id === playerId);
  if (!p || p.saidUno || p.hand.length !== 1) { s.catchTarget = null; return s; }
  drawN(s, p, 2);
  s.catchTarget = null;
  s.flash = { playerId: p.id, type: 'caught' };
  pushLog(s, '👮 ' + p.name + ' forgot to say UNO! +2 cards.');
  return s;
}

export function botDecide(state) {
  const p = state.players[state.current];
  const t = top(state);
  const playable = p.hand.filter((c) => canPlay(c, t, state.activeColor, state.pending, state.allowStack));
  if (state.pending.draw > 0) {
    if (playable.length && Math.random() < 0.72) return { type: 'play', card: pickBest(p, playable, state) };
    return { type: 'draw' };
  }
  if (playable.length === 0) return { type: 'draw' };
  return { type: 'play', card: pickBest(p, playable, state) };
}

function pickBest(p, playable, state) {
  const counts = { red: 0, yellow: 0, green: 0, blue: 0 };
  for (const c of p.hand) if (c.color in counts) counts[c.color]++;
  const bestColor = COLORS.slice().sort((a, b) => counts[b] - counts[a])[0];
  const nonWild = playable.filter((c) => !isWild(c));
  const pool = nonWild.length ? nonWild : playable;
  const scored = pool.slice().sort((a, b) => rank(b) - rank(a));
  const card = scored[0];
  return { id: card.id, color: isWild(card) ? bestColor : undefined };
}

function rank(c) {
  if (c.kind === 'draw2') return 30;
  if (c.kind === 'skip') return 28;
  if (c.kind === 'reverse') return 26;
  if (c.kind === 'number') return 10 + c.value;
  return 5;
}
