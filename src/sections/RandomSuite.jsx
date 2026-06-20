import React, { useState, useMemo, useCallback } from 'react';
import { C, Mono, Panel, ModuleHeader, Row, BigStat, TextField, Select, Slider, Toggle, Button, CopyButton, Grid2, StatusDot } from '../ui.jsx';

function randInt(min, max) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return min + (arr[0] % (max - min + 1));
}

/* ---------------- Zar (dice) ---------------- */

function ZarCard() {
  const [count, setCount] = useState(2);
  const [sides, setSides] = useState(6);
  const [results, setResults] = useState([4, 6]);

  const roll = useCallback(() => {
    setResults(Array.from({ length: count }, () => randInt(1, sides)));
  }, [count, sides]);

  const sum = results.reduce((a, b) => a + b, 0);

  return (
    <Panel>
      <ModuleHeader title="Zar tashlash" sub="QUR'A" />
      <Grid2>
        <Slider label="Zarlar soni" value={count} onChange={e => setCount(+e.target.value)} min={1} max={10} />
        <Select label="Zar turi" value={sides} onChange={e => setSides(+e.target.value)} options={[
          { value: 4, label: 'D4 (4 qirrali)' }, { value: 6, label: 'D6 (6 qirrali)' },
          { value: 8, label: 'D8 (8 qirrali)' }, { value: 10, label: 'D10 (10 qirrali)' },
          { value: 12, label: 'D12 (12 qirrali)' }, { value: 20, label: 'D20 (20 qirrali)' },
        ]} />
      </Grid2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '18px 0' }}>
        {results.map((r, i) => (
          <div key={i} style={{
            width: 52, height: 52, border: `1px solid ${C.border}`, background: C.panelAlt,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Mono style={{ fontSize: 20, color: C.good, fontWeight: 600 }}>{r}</Mono>
          </div>
        ))}
      </div>
      <Row label="Jami" value={sum} />
      <div style={{ marginTop: 14 }}>
        <Button onClick={roll} variant="primary" style={{ width: '100%' }}>🎲 ZAR TASHLASH</Button>
      </div>
    </Panel>
  );
}

/* ---------------- Tanga ---------------- */

function TangaCard() {
  const [result, setResult] = useState('Old');
  const [history, setHistory] = useState([]);

  const flip = useCallback(() => {
    const r = randInt(0, 1) === 0 ? 'Old' : 'Old emas';
    setResult(r);
    setHistory(h => [r, ...h].slice(0, 12));
  }, []);

  return (
    <Panel>
      <ModuleHeader title="Tanga otish" sub="50/50" />
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100,
        background: C.panelAlt, border: `1px solid ${C.border}`, marginBottom: 16,
      }}>
        <Mono style={{ fontSize: 28, color: C.good, fontWeight: 700 }}>{result.toUpperCase()}</Mono>
      </div>
      <Button onClick={flip} variant="primary" style={{ width: '100%', marginBottom: 14 }}>🪙 TANGA OTISH</Button>
      {history.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {history.map((h, i) => (
            <Mono key={i} style={{ fontSize: 10.5, color: i === 0 ? C.good : C.muted, border: `1px solid ${C.borderLight}`, padding: '3px 7px' }}>
              {h === 'Old' ? 'OLD' : 'YOZ'}
            </Mono>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ---------------- Tasodifiy son ---------------- */

function TasodifiySonCard() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [unique, setUnique] = useState(false);
  const [count, setCount] = useState(1);
  const [results, setResults] = useState([]);

  const generate = useCallback(() => {
    const lo = Math.min(Number(min), Number(max));
    const hi = Math.max(Number(min), Number(max));
    if (unique) {
      const range = hi - lo + 1;
      const n = Math.min(count, range);
      const pool = Array.from({ length: range }, (_, i) => lo + i);
      const picked = [];
      for (let i = 0; i < n; i++) {
        const idx = randInt(0, pool.length - 1);
        picked.push(pool[idx]);
        pool.splice(idx, 1);
      }
      setResults(picked);
    } else {
      setResults(Array.from({ length: count }, () => randInt(lo, hi)));
    }
  }, [min, max, unique, count]);

  return (
    <Panel>
      <ModuleHeader title="Tasodifiy son generatori" sub="RANDOM" />
      <Grid2>
        <TextField label="Minimum" type="number" value={min} onChange={e => setMin(e.target.value)} />
        <TextField label="Maksimum" type="number" value={max} onChange={e => setMax(e.target.value)} />
      </Grid2>
      <Slider label="Nechta son" value={count} onChange={e => setCount(+e.target.value)} min={1} max={20} />
      <Toggle label="Takrorlanmasin (har xil sonlar)" checked={unique} onChange={() => setUnique(v => !v)} />
      {results.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '14px 0' }}>
          {results.map((r, i) => (
            <Mono key={i} style={{ fontSize: 16, color: C.good, border: `1px solid ${C.border}`, padding: '6px 12px', background: C.panelAlt }}>{r}</Mono>
          ))}
        </div>
      )}
      <Button onClick={generate} variant="primary" style={{ width: '100%' }}>↻ GENERATSIYA</Button>
    </Panel>
  );
}

/* ---------------- Ro'yxatdan tasodifiy tanlash ---------------- */

function RoyxatTanlashCard() {
  const [text, setText] = useState("Osh\nLagman\nManti\nShashlik\nSomsa");
  const [picked, setPicked] = useState(null);
  const items = text.split('\n').map(s => s.trim()).filter(Boolean);

  const pick = useCallback(() => {
    if (items.length === 0) return;
    setPicked(items[randInt(0, items.length - 1)]);
  }, [items]);

  return (
    <Panel>
      <ModuleHeader title="Ro'yxatdan tasodifiy tanlash" sub={`${items.length} ELEMENT`} />
      <label style={{ display: 'block', marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: C.muted, letterSpacing: '0.05em', marginBottom: 6, textTransform: 'uppercase', fontFamily: "'Inter',sans-serif" }}>
          Ro'yxat (har bir qatorda bitta narsa)
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={5}
          style={{
            width: '100%', background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text,
            padding: '10px 12px', fontSize: 13, fontFamily: "'JetBrains Mono',monospace", outline: 'none', resize: 'vertical',
          }}
        />
      </label>
      {picked && (
        <div style={{ background: C.panelAlt, border: `1px solid ${C.border}`, padding: '18px', textAlign: 'center', marginBottom: 16 }}>
          <Mono style={{ fontSize: 22, color: C.good }}>{picked}</Mono>
        </div>
      )}
      <Button onClick={pick} variant="primary" style={{ width: '100%' }} disabled={items.length === 0}>🎯 TANLASH</Button>
    </Panel>
  );
}

/* ---------------- QR kod generatori (tashqi API) ---------------- */

function QrKodCard() {
  const [text, setText] = useState('https://kerakli.sys');
  const [size, setSize] = useState(240);

  const qrUrl = useMemo(() => {
    if (!text) return null;
    const encoded = encodeURIComponent(text);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`;
  }, [text, size]);

  return (
    <Panel>
      <ModuleHeader title="QR kod generatori" sub="API ORQALI" />
      <TextField label="Matn yoki havola" value={text} onChange={e => setText(e.target.value)} placeholder="https://..." />
      <Slider label="O'lcham" value={size} onChange={e => setSize(+e.target.value)} min={120} max={400} step={20} suffix=" px" />
      {qrUrl && (
        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <img
            src={qrUrl}
            alt="QR kod"
            width={size}
            height={size}
            style={{ background: '#fff', padding: 8, border: `1px solid ${C.border}`, maxWidth: '100%' }}
          />
        </div>
      )}
      <Mono style={{ fontSize: 10, color: C.muted, display: 'block', marginBottom: 14 }}>
        QR kod tashqi servis (api.qrserver.com) orqali generatsiya qilinadi — internet aloqasi talab qilinadi.
      </Mono>
      {qrUrl && (
        <Button onClick={() => window.open(qrUrl, '_blank')} style={{ width: '100%' }}>↓ TO'LIQ O'LCHAMDA OCHISH</Button>
      )}
    </Panel>
  );
}

/* ---------------- Rang tanlash / palette generatori ---------------- */

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = x => Math.round(255 * x).toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function RangTanlashCard() {
  const [baseHue, setBaseHue] = useState(210);
  const [palette, setPalette] = useState([]);

  const generate = useCallback(() => {
    const hue = randInt(0, 359);
    setBaseHue(hue);
    const colors = [0, 1, 2, 3, 4].map(i => {
      const h = (hue + i * 35) % 360;
      const s = 55 + randInt(0, 30);
      const l = 35 + i * 8;
      return hslToHex(h, s, l);
    });
    setPalette(colors);
  }, []);

  React.useEffect(() => { generate(); }, []); // eslint-disable-line

  return (
    <Panel>
      <ModuleHeader title="Rang palitra generatori" sub="RANDOM" />
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, border: `1px solid ${C.border}` }}>
        {palette.map((hex, i) => (
          <div key={i} style={{ flex: 1, height: 90, background: hex, position: 'relative' }}>
            <Mono
              onClick={() => navigator.clipboard?.writeText(hex)}
              style={{
                position: 'absolute', bottom: 6, left: 0, right: 0, textAlign: 'center',
                fontSize: 10.5, color: '#000', background: 'rgba(255,255,255,0.75)', cursor: 'pointer', padding: '2px 0',
              }}
              title="Nusxalash uchun bosing"
            >{hex}</Mono>
          </div>
        ))}
      </div>
      <Button onClick={generate} variant="primary" style={{ width: '100%' }}>🎨 YANGI PALITRA</Button>
    </Panel>
  );
}

/* ---------------- Tasodifiy parol/PIN (qisqa) ---------------- */

function IsmGeneratorCard() {
  const ISMLAR = ['Aziz', 'Malika', 'Botir', 'Nilufar', 'Sardor', 'Dilnoza', 'Jasur', 'Gulnora', 'Otabek', 'Madina', 'Sherzod', 'Zarina', 'Davron', 'Kamola', 'Farrux', 'Sevinch'];
  const FAMILIYALAR = ['Karimov', 'Yusupova', 'Rashidov', 'Tosheva', 'Aliyev', 'Nazarova', 'Saidov', 'Ergasheva'];
  const SHAHARLAR = ['Toshkent', 'Samarqand', 'Buxoro', 'Andijon', 'Farg\'ona', 'Namangan', 'Qarshi', 'Nukus'];

  const [results, setResults] = useState([]);
  const [count, setCount] = useState(5);

  const generate = useCallback(() => {
    setResults(Array.from({ length: count }, () => ({
      ism: ISMLAR[randInt(0, ISMLAR.length - 1)],
      familiya: FAMILIYALAR[randInt(0, FAMILIYALAR.length - 1)],
      shahar: SHAHARLAR[randInt(0, SHAHARLAR.length - 1)],
      yosh: randInt(18, 65),
    })));
  }, [count]);

  React.useEffect(() => { generate(); }, []); // eslint-disable-line

  return (
    <Panel>
      <ModuleHeader title="Tasodifiy shaxs generatori" sub="TEST MA'LUMOT" />
      <Slider label="Nechta" value={count} onChange={e => setCount(+e.target.value)} min={1} max={15} />
      <div style={{ marginBottom: 16 }}>
        {results.map((p, i) => (
          <div key={i} style={{ padding: '9px 0', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
            <span style={{ fontSize: 12.5, fontFamily: "'Inter',sans-serif" }}>{p.ism} {p.familiya}</span>
            <Mono style={{ fontSize: 12, color: C.muted }}>{p.shahar}, {p.yosh} yosh</Mono>
          </div>
        ))}
      </div>
      <Button onClick={generate} variant="primary" style={{ width: '100%' }}>↻ YANGI RO'YXAT</Button>
    </Panel>
  );
}

/* ---------------- Rang formatlari konvertori (HEX/RGB/HSL) ---------------- */

function hexToRgb(hex) {
  const m = hex.replace('#', '').match(/^([0-9a-f]{6})$/i);
  if (!m) return null;
  const num = parseInt(m[1], 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function RangFormatlariCard() {
  const [hex, setHex] = useState('#3B82F6');

  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = useMemo(() => rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null, [rgb]);

  return (
    <Panel>
      <ModuleHeader title="Rang formatlari konvertori" sub="HEX / RGB / HSL" />
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', marginBottom: 16 }}>
        <input type="color" value={rgb ? hex : '#000000'} onChange={e => setHex(e.target.value)}
          style={{ width: 52, height: 40, border: `1px solid ${C.border}`, background: 'transparent', cursor: 'pointer' }} />
        <div style={{ flex: 1 }}>
          <TextField label="HEX kod" value={hex} onChange={e => setHex(e.target.value)} placeholder="#RRGGBB" />
        </div>
      </div>
      {rgb ? (
        <>
          <Row label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
          <Row label="HSL" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
          <Row label="HEX" value={hex.toUpperCase()} />
        </>
      ) : (
        <Mono style={{ fontSize: 12, color: C.bad }}>Noto'g'ri HEX format (masalan: #3B82F6)</Mono>
      )}
    </Panel>
  );
}

/* ---------------- Kupon / promo kod generatori ---------------- */

function KuponKodCard() {
  const [prefix, setPrefix] = useState('SAVE');
  const [length, setLength] = useState(6);
  const [count, setCount] = useState(5);
  const [codes, setCodes] = useState([]);
  const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  const generate = useCallback(() => {
    const arr = Array.from({ length: count }, () => {
      let code = '';
      for (let i = 0; i < length; i++) code += CHARS[randInt(0, CHARS.length - 1)];
      return prefix ? `${prefix}-${code}` : code;
    });
    setCodes(arr);
  }, [prefix, length, count]);

  React.useEffect(() => { generate(); }, []); // eslint-disable-line

  return (
    <Panel>
      <ModuleHeader title="Promo/kupon kod generatori" sub="NOYOB KODLAR" />
      <Grid2>
        <TextField label="Prefiks (ixtiyoriy)" value={prefix} onChange={e => setPrefix(e.target.value.toUpperCase())} />
        <Select label="Kod uzunligi" value={length} onChange={e => setLength(+e.target.value)} options={[
          { value: 4, label: '4 belgi' }, { value: 6, label: '6 belgi' }, { value: 8, label: '8 belgi' }, { value: 10, label: '10 belgi' },
        ]} />
      </Grid2>
      <Select label="Nechta kod" value={count} onChange={e => setCount(+e.target.value)} options={[
        { value: 5, label: '5 dona' }, { value: 10, label: '10 dona' }, { value: 20, label: '20 dona' }, { value: 50, label: '50 dona' },
      ]} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '16px 0' }}>
        {codes.map((c, i) => (
          <Mono key={i} style={{ fontSize: 12.5, color: C.good, border: `1px solid ${C.border}`, padding: '6px 10px', background: C.panelAlt }}>{c}</Mono>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button onClick={generate} variant="primary" style={{ flex: 1 }}>↻ YANGI KODLAR</Button>
        <CopyButton text={codes.join('\n')} label="HAMMASINI NUSXALASH" />
      </div>
    </Panel>
  );
}

export default function RandomSuite() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <ZarCard />
      <TangaCard />
      <TasodifiySonCard />
      <RoyxatTanlashCard />
      <QrKodCard />
      <RangTanlashCard />
      <RangFormatlariCard />
      <IsmGeneratorCard />
      <KuponKodCard />
    </div>
  );
}
