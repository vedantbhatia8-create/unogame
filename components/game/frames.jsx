'use client';

import React from 'react';

// ── iOS Device Frame ──────────────────────────────────────────────────────────

function IOSStatusBar({ dark = false }) {
  const c = dark ? '#fff' : '#000';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '21px 24px 19px', boxSizing: 'border-box',
      position: 'relative', zIndex: 20, width: '100%',
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: '-apple-system,"SF Pro",system-ui', fontWeight: 590, fontSize: 17, color: c }}>9:41</span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 7 }}>
        <svg width="19" height="12" viewBox="0 0 19 12">
          <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill={c}/>
          <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill={c}/>
          <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill={c}/>
          <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill={c}/>
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12">
          <path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill={c}/>
          <path d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z" fill={c}/>
          <circle cx="8.5" cy="10.5" r="1.5" fill={c}/>
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={c} strokeOpacity="0.35" fill="none"/>
          <rect x="2" y="2" width="20" height="9" rx="2" fill={c}/>
          <path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5S25.8 4.8 25 4.5Z" fill={c} fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

export function IOSDevice({ children, width = 402, height = 874, dark = false }) {
  return (
    <div style={{
      width, height, borderRadius: 48, overflow: 'hidden', position: 'relative',
      background: dark ? '#000' : '#F2F2F7',
      boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
      fontFamily: '-apple-system, system-ui, sans-serif', WebkitFontSmoothing: 'antialiased',
    }}>
      {/* Dynamic island */}
      <div style={{
        position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
        width: 126, height: 37, borderRadius: 24, background: '#000', zIndex: 50,
      }} />
      {/* Status bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <IOSStatusBar dark={dark} />
      </div>
      {/* Content */}
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
      </div>
      {/* Home indicator */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 60,
        height: 34, display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
        paddingBottom: 8, pointerEvents: 'none',
      }}>
        <div style={{ width: 139, height: 5, borderRadius: 100, background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)' }} />
      </div>
    </div>
  );
}

// ── Chrome Browser Frame ──────────────────────────────────────────────────────

const CC = { barBg: '#202124', tabBg: '#35363a', text: '#e8eaed', dim: '#9aa0a6', urlBg: '#282a2d' };

function ChromeTab({ title = 'New Tab', active = false }) {
  const curve = (flip) => (
    <svg width="8" height="10" viewBox="0 0 8 10"
      style={{ position: 'absolute', bottom: 0, [flip ? 'right' : 'left']: -8, transform: flip ? 'scaleX(-1)' : 'none' }}>
      <path d="M0 10C2 9 6 8 8 0V10H0Z" fill={CC.tabBg}/>
    </svg>
  );
  return (
    <div style={{
      position: 'relative', height: 34, alignSelf: 'flex-end',
      padding: '0 12px', display: 'flex', alignItems: 'center', gap: 8,
      background: active ? CC.tabBg : 'transparent', borderRadius: '8px 8px 0 0',
      minWidth: 120, maxWidth: 220, fontFamily: 'system-ui, sans-serif', fontSize: 12,
      color: active ? CC.text : CC.dim,
    }}>
      {active && curve(false)}{active && curve(true)}
      <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#5f6368', flexShrink: 0 }} />
      <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
    </div>
  );
}

export function ChromeWindow({ tabs = [{ title: 'New Tab' }], activeIndex = 0, url = 'example.com', width = 900, height = 600, children }) {
  return (
    <div style={{
      width, height, borderRadius: 10, overflow: 'hidden',
      boxShadow: '0 24px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.1)',
      display: 'flex', flexDirection: 'column', background: CC.tabBg,
    }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', alignItems: 'center', height: 44, background: CC.barBg, paddingRight: 8 }}>
        <div style={{ display: 'flex', gap: 8, padding: '0 14px' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', paddingLeft: 4, flex: 1 }}>
          {tabs.map((t, i) => <ChromeTab key={i} title={t.title} active={i === activeIndex} />)}
        </div>
      </div>
      {/* Toolbar */}
      <div style={{ height: 40, background: CC.tabBg, display: 'flex', alignItems: 'center', gap: 4, padding: '0 8px' }}>
        <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: CC.dim, opacity: 0.4 }} />
        </div>
        <div style={{ flex: 1, height: 30, borderRadius: 15, background: CC.urlBg, display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', margin: '0 6px' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: CC.dim, opacity: 0.4 }} />
          <span style={{ flex: 1, color: CC.text, fontSize: 13, fontFamily: 'system-ui, sans-serif' }}>{url}</span>
        </div>
        <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: CC.dim, opacity: 0.4 }} />
        </div>
      </div>
      {/* Content */}
      <div style={{ flex: 1, background: '#fff', overflow: 'auto' }}>{children}</div>
    </div>
  );
}
