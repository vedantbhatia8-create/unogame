// uno-cards.jsx — scalable playing-card visuals. Exports Card, CardBack, glyphFor.
// A card is sized by its width `w`; everything else scales from it.

const UNO_HEX = window.UnoEngine.HEX;

// The corner/center symbol for a card kind.
function Symbol({ kind, value, size, color, stroke }) {
  const s = size;
  const sw = Math.max(1.2, s * 0.13);
  if (kind === 'number') {
    return (
      <span style={{
        fontFamily: "'Fredoka', system-ui, sans-serif", fontWeight: 700,
        fontSize: s, lineHeight: 1, color,
        WebkitTextStroke: stroke ? `${sw}px ${stroke}` : undefined,
        paintOrder: 'stroke fill',
      }}>{value}</span>
    );
  }
  if (kind === 'skip') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="3.4" />
        <line x1="5.5" y1="5.5" x2="18.5" y2="18.5" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
        {stroke && <>
          <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="6.2" opacity="0" />
        </>}
      </svg>
    );
  }
  if (kind === 'reverse') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M7 8.5 4 11.5 7 14.5" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.6 11.5H14a4 4 0 0 1 4 4v.4" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 15.5 20 12.5 17 9.5" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19.4 12.5H10a4 4 0 0 1-4-4v-.4" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === 'draw2' || kind === 'draw4') {
    const n = kind === 'draw2' ? '+2' : '+4';
    return (
      <span style={{
        fontFamily: "'Fredoka', system-ui, sans-serif", fontWeight: 700,
        fontSize: s * 0.82, lineHeight: 1, color,
        WebkitTextStroke: stroke ? `${Math.max(0.8, s * 0.07)}px ${stroke}` : undefined,
        paintOrder: 'stroke fill',
        letterSpacing: '-0.04em',
      }}>{n}</span>
    );
  }
  return null;
}

// The big centre artwork sitting inside the white oval.
function CenterArt({ card, w }) {
  const { kind, value, color } = card;
  if (kind === 'wild' || kind === 'wild4') {
    // four-colour pie inside the oval
    return (
      <div style={{ position: 'relative', width: w * 0.62, height: w * 0.92, display: 'grid', placeItems: 'center' }}>
        <div style={{
          width: w * 0.46, height: w * 0.46, borderRadius: '50%', overflow: 'hidden',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr',
          transform: 'rotate(0deg)', boxShadow: 'inset 0 0 0 ' + (w * 0.02) + 'px rgba(0,0,0,0.12)',
        }}>
          <div style={{ background: UNO_HEX.red }} />
          <div style={{ background: UNO_HEX.blue }} />
          <div style={{ background: UNO_HEX.green }} />
          <div style={{ background: UNO_HEX.yellow }} />
        </div>
        {kind === 'wild4' && (
          <span style={{
            position: 'absolute', fontFamily: "'Fredoka', sans-serif", fontWeight: 700,
            fontSize: w * 0.3, color: '#fff', WebkitTextStroke: `${w * 0.03}px #17171F`,
            paintOrder: 'stroke fill', transform: 'translateY(' + (w * 0.0) + 'px)',
          }}>+4</span>
        )}
      </div>
    );
  }
  const stroke = '#17171F';
  return <Symbol kind={kind} value={value} size={w * 0.62} color={UNO_HEX[color]} stroke={stroke} />;
}

function Card({ card, w = 92, faceDown = false, onClick, playable = false, dim = false, raised = false, style = {}, className = '' }) {
  const h = w * 1.5;
  if (!card && !faceDown) return null;

  if (faceDown || !card) {
    return <CardBack w={w} style={style} onClick={onClick} className={className} />;
  }

  const bg = card.color === 'wild' ? UNO_HEX.wild : UNO_HEX[card.color];
  const cornerColor = '#fff';
  const cornerStroke = card.color === 'wild' ? '#000' : 'rgba(0,0,0,0.0)';

  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        width: w, height: h, borderRadius: w * 0.13, position: 'relative',
        background: bg, flex: '0 0 auto', cursor: onClick ? 'pointer' : 'default',
        boxShadow: raised
          ? `0 ${w * 0.18}px ${w * 0.34}px rgba(0,0,0,0.45), 0 0 0 ${w * 0.04}px rgba(255,255,255,0.9) inset`
          : `0 ${w * 0.05}px ${w * 0.12}px rgba(0,0,0,0.32), 0 0 0 ${w * 0.04}px rgba(255,255,255,0.9) inset`,
        opacity: dim ? 0.46 : 1,
        filter: dim ? 'saturate(0.7)' : 'none',
        transition: 'transform .16s ease, box-shadow .16s ease, opacity .16s',
        outline: playable ? `${Math.max(2, w * 0.035)}px solid #fff` : 'none',
        outlineOffset: playable ? w * 0.03 : 0,
        ...style,
      }}
    >
      {/* white tilted oval */}
      <div style={{
        position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', overflow: 'hidden',
        borderRadius: w * 0.13,
      }}>
        <div style={{
          width: w * 0.74, height: h * 0.82, background: '#fff',
          borderRadius: '50%', transform: 'rotate(-32deg)',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.04)',
        }} />
      </div>
      {/* centre artwork (upright) */}
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
        <CenterArt card={card} w={w} />
      </div>
      {/* corner indices */}
      <div style={{ position: 'absolute', top: w * 0.07, left: w * 0.1, lineHeight: 1, pointerEvents: 'none' }}>
        <Symbol kind={card.kind} value={card.value} size={w * 0.26} color={cornerColor} stroke={cornerStroke} />
      </div>
      <div style={{ position: 'absolute', bottom: w * 0.07, right: w * 0.1, transform: 'rotate(180deg)', lineHeight: 1, pointerEvents: 'none' }}>
        <Symbol kind={card.kind} value={card.value} size={w * 0.26} color={cornerColor} stroke={cornerStroke} />
      </div>
    </div>
  );
}

function CardBack({ w = 92, style = {}, onClick, className = '' }) {
  const h = w * 1.5;
  return (
    <div onClick={onClick} className={className} style={{
      width: w, height: h, borderRadius: w * 0.13, position: 'relative', overflow: 'hidden',
      background: UNO_HEX.wild, flex: '0 0 auto', cursor: onClick ? 'pointer' : 'default',
      boxShadow: `0 ${w * 0.05}px ${w * 0.12}px rgba(0,0,0,0.32), 0 0 0 ${w * 0.04}px rgba(255,255,255,0.9) inset`,
      ...style,
    }}>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <div style={{
          width: w * 0.74, height: h * 0.82, background: UNO_HEX.red,
          borderRadius: '50%', transform: 'rotate(-32deg)',
          boxShadow: 'inset 0 0 0 ' + (w * 0.03) + 'px rgba(255,255,255,0.92)',
        }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <span style={{
          fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontStyle: 'italic',
          fontSize: w * 0.34, color: '#fff', letterSpacing: '-0.04em',
          transform: 'rotate(-12deg)', textShadow: '0 2px 0 rgba(0,0,0,0.25)',
        }}>UNO</span>
      </div>
    </div>
  );
}

Object.assign(window, { Card, CardBack });
