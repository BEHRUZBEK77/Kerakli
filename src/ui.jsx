import React from 'react';

export const C = {
  bg: '#000000',
  panel: '#0A0A0A',
  panelAlt: '#111111',
  border: '#2A2A2A',
  borderLight: '#1A1A1A',
  text: '#F2F2F0',
  muted: '#7A7A7A',
  mutedLight: '#9A9A9A',
  good: '#00FF66',
  warn: '#FFB800',
  bad: '#FF3B3B',
};

export const Mono = ({ children, style, ...p }) => (
  <span style={{ fontFamily: "'JetBrains Mono','SF Mono',ui-monospace,monospace", ...style }} {...p}>{children}</span>
);

export function StatusDot({ state }) {
  const color = state === 'good' ? C.good : state === 'warn' ? C.warn : state === 'bad' ? C.bad : C.muted;
  return (
    <span style={{
      display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
      background: color, boxShadow: state === 'good' ? `0 0 8px ${C.good}` : 'none',
      flexShrink: 0,
    }} />
  );
}

export function ModuleHeader({ index, title, sub, scanning }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        {index != null && <Mono style={{ fontSize: 12, color: C.muted, letterSpacing: '0.08em' }}>{index}</Mono>}
        <h2 style={{ margin: 0, fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em', fontFamily: "'Inter',system-ui,sans-serif" }}>{title}</h2>
      </div>
      {sub !== undefined && (
        <Mono style={{ fontSize: 11, color: scanning ? C.good : C.muted, letterSpacing: '0.05em' }}>
          {scanning ? '● ISHLAMOQDA' : sub}
        </Mono>
      )}
    </div>
  );
}

export function Row({ label, value, valueColor, mono = true }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 0', borderBottom: `1px solid ${C.borderLight}`, gap: 12,
    }}>
      <span style={{ fontSize: 12.5, color: C.mutedLight, fontFamily: "'Inter',system-ui,sans-serif" }}>{label}</span>
      {mono
        ? <Mono style={{ fontSize: 12.5, color: valueColor || C.text, textAlign: 'right' }}>{value}</Mono>
        : <span style={{ fontSize: 12.5, color: valueColor || C.text, textAlign: 'right' }}>{value}</span>}
    </div>
  );
}

export function Panel({ children, style }) {
  return (
    <div style={{
      background: C.panel, border: `1px solid ${C.border}`,
      padding: '22px 22px', ...style,
    }}>
      {children}
    </div>
  );
}

export function Grid2({ children, min = 220 }) {
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit,minmax(${min}px,1fr))`, gap: '0 32px' }}>{children}</div>;
}

export function Bar({ value, max, color }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ height: 4, background: C.borderLight, width: '100%', marginTop: 10 }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, transition: 'width 0.3s ease' }} />
    </div>
  );
}

export function BigStat({ label, value, unit, color }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: C.muted, letterSpacing: '0.08em', marginBottom: 6, fontFamily: "'Inter',system-ui,sans-serif", textTransform: 'uppercase' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <Mono style={{ fontSize: 38, fontWeight: 600, color: color || C.text, lineHeight: 1 }}>{value}</Mono>
        {unit && <Mono style={{ fontSize: 14, color: C.muted }}>{unit}</Mono>}
      </div>
    </div>
  );
}

export function TextField({ label, value, onChange, placeholder, type = 'text', suffix, autoFocus }) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      <div style={{ fontSize: 11, color: C.muted, letterSpacing: '0.05em', marginBottom: 6, textTransform: 'uppercase', fontFamily: "'Inter',sans-serif" }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${C.border}`, background: C.panelAlt }}>
        <input
          autoFocus={autoFocus}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: C.text, padding: '10px 12px', fontSize: 14,
            fontFamily: "'JetBrains Mono',monospace",
          }}
        />
        {suffix && <span style={{ padding: '0 12px', color: C.muted, fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }}>{suffix}</span>}
      </div>
    </label>
  );
}

export function Slider({ label, value, onChange, min, max, step = 1, suffix }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: C.muted, letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif" }}>{label}</span>
        <Mono style={{ fontSize: 12.5, color: C.text }}>{value}{suffix}</Mono>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={onChange} style={{ width: '100%' }} />
    </div>
  );
}

export function Select({ label, value, onChange, options }) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      <div style={{ fontSize: 11, color: C.muted, letterSpacing: '0.05em', marginBottom: 6, textTransform: 'uppercase', fontFamily: "'Inter',sans-serif" }}>{label}</div>
      <select value={value} onChange={onChange} style={{
        width: '100%', background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text,
        padding: '10px 12px', fontSize: 13, fontFamily: "'JetBrains Mono',monospace", outline: 'none',
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

export function Toggle({ label, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', cursor: 'pointer', borderBottom: `1px solid ${C.borderLight}` }}>
      <span style={{ fontSize: 12.5, fontFamily: "'Inter',sans-serif", color: C.mutedLight }}>{label}</span>
      <span
        onClick={onChange}
        style={{
          width: 36, height: 20, borderRadius: 10, background: checked ? C.good : C.border,
          position: 'relative', transition: 'background 0.15s', flexShrink: 0,
        }}
      >
        <span style={{
          position: 'absolute', top: 2, left: checked ? 18 : 2, width: 16, height: 16,
          borderRadius: '50%', background: checked ? '#000' : C.mutedLight, transition: 'left 0.15s',
        }} />
      </span>
    </label>
  );
}

export function Button({ children, onClick, variant = 'default', disabled, style }) {
  const base = {
    fontSize: 11.5, padding: '9px 16px', cursor: disabled ? 'default' : 'pointer',
    fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.04em', border: `1px solid ${C.border}`,
    background: 'transparent', color: disabled ? C.muted : C.text, transition: 'border-color 0.15s',
  };
  const variants = {
    default: {},
    primary: { background: C.text, color: C.bg, border: `1px solid ${C.text}`, fontWeight: 600 },
    good: { borderColor: C.good, color: C.good },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

export function CopyButton({ text, label = 'NUSXALASH' }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <Button onClick={copy} variant={copied ? 'good' : 'default'}>
      {copied ? '✓ NUSXALANDI' : label}
    </Button>
  );
}
