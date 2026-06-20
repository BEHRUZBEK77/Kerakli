import React, { useState, useMemo, useCallback } from 'react';
import { C, Mono, Panel, ModuleHeader, Row, BigStat, TextField, Select, Button, Grid2, StatusDot } from '../ui.jsx';

/* ---------------- Foiz kalkulyatori ---------------- */

function FoizCard() {
  const [mode, setMode] = useState('percent_of'); // percent_of | what_percent | percent_change
  const [a, setA] = useState('20');
  const [b, setB] = useState('150');

  const result = useMemo(() => {
    const na = Number(a), nb = Number(b);
    if (a === '' || b === '' || isNaN(na) || isNaN(nb)) return null;
    if (mode === 'percent_of') return { value: (na / 100) * nb, label: `${a}% dan ${b}` };
    if (mode === 'what_percent') return { value: nb === 0 ? null : (na / nb) * 100, label: `${a} ning ${b} dan necha foizi`, suffix: '%' };
    if (mode === 'percent_change') return { value: na === 0 ? null : ((nb - na) / na) * 100, label: `${a} dan ${b} gacha o'zgarish`, suffix: '%' };
    return null;
  }, [mode, a, b]);

  const labels = {
    percent_of: ['Foiz (%)', 'Sondan'],
    what_percent: ['Son', 'Nimadan (jami)'],
    percent_change: ['Boshlang\'ich qiymat', 'Yakuniy qiymat'],
  };

  return (
    <Panel>
      <ModuleHeader title="Foiz kalkulyatori" sub="3 USUL" />
      <Select label="Hisoblash turi" value={mode} onChange={e => setMode(e.target.value)} options={[
        { value: 'percent_of', label: 'X% dan Y necha?' },
        { value: 'what_percent', label: 'X — Y dan necha foiz?' },
        { value: 'percent_change', label: 'Foiz o\'zgarishi (X → Y)' },
      ]} />
      <Grid2>
        <TextField label={labels[mode][0]} type="number" value={a} onChange={e => setA(e.target.value)} />
        <TextField label={labels[mode][1]} type="number" value={b} onChange={e => setB(e.target.value)} />
      </Grid2>
      {result && result.value !== null && (
        <div style={{ background: C.panelAlt, border: `1px solid ${C.border}`, padding: '16px', textAlign: 'center', marginTop: 6 }}>
          <Mono style={{ fontSize: 26, color: C.good }}>{Number(result.value.toFixed(4)).toLocaleString('uz-UZ', { maximumFractionDigits: 4 })}{result.suffix || ''}</Mono>
          <Mono style={{ fontSize: 11, color: C.muted, display: 'block', marginTop: 6 }}>{result.label}</Mono>
        </div>
      )}
    </Panel>
  );
}

/* ---------------- GPA kalkulyatori ---------------- */

const BAHO_BALLARI = { "A (90-100)": 4.0, "B+ (85-89)": 3.5, "B (80-84)": 3.0, "C+ (75-79)": 2.5, "C (70-74)": 2.0, "D (60-69)": 1.0, "F (0-59)": 0.0 };

function GpaCard() {
  const [rows, setRows] = useState([
    { id: 1, name: 'Matematika', credit: 4, grade: 'A (90-100)' },
    { id: 2, name: 'Fizika', credit: 3, grade: 'B+ (85-89)' },
  ]);

  const addRow = () => setRows(r => [...r, { id: Date.now(), name: `Fan ${r.length + 1}`, credit: 3, grade: 'B (80-84)' }]);
  const removeRow = id => setRows(r => r.filter(x => x.id !== id));
  const updateRow = (id, field, value) => setRows(r => r.map(x => x.id === id ? { ...x, [field]: value } : x));

  const gpa = useMemo(() => {
    let totalPoints = 0, totalCredits = 0;
    rows.forEach(r => {
      const credit = Number(r.credit) || 0;
      totalPoints += credit * BAHO_BALLARI[r.grade];
      totalCredits += credit;
    });
    return totalCredits === 0 ? null : (totalPoints / totalCredits);
  }, [rows]);

  return (
    <Panel>
      <ModuleHeader title="GPA (o'rtacha ball) kalkulyatori" sub={`${rows.length} FAN`} />
      {rows.map(r => (
        <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '1fr 70px 1fr 30px', gap: 8, marginBottom: 10, alignItems: 'center' }}>
          <input value={r.name} onChange={e => updateRow(r.id, 'name', e.target.value)} style={inputStyle} />
          <input type="number" min={0} value={r.credit} onChange={e => updateRow(r.id, 'credit', e.target.value)} style={inputStyle} title="Kredit soati" />
          <select value={r.grade} onChange={e => updateRow(r.id, 'grade', e.target.value)} style={selectStyle}>
            {Object.keys(BAHO_BALLARI).map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <button onClick={() => removeRow(r.id)} style={{ background: 'transparent', border: 'none', color: C.bad, cursor: 'pointer', fontSize: 16 }}>×</button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 8, margin: '14px 0 18px' }}>
        <Button onClick={addRow} style={{ flex: 1 }}>+ FAN QO'SHISH</Button>
      </div>
      {gpa !== null && (
        <BigStat label="GPA (4.0 shkalasi bo'yicha)" value={gpa.toFixed(2)} color={gpa >= 3 ? C.good : gpa >= 2 ? C.warn : C.bad} />
      )}
    </Panel>
  );
}

const inputStyle = {
  background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text,
  padding: '8px 9px', fontSize: 12.5, fontFamily: "'JetBrains Mono',monospace", outline: 'none', width: '100%', boxSizing: 'border-box',
};
const selectStyle = { ...inputStyle, fontSize: 11.5 };

/* ---------------- Tub son tekshirish va faktorizatsiya ---------------- */

function isPrime(n) {
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) if (n % i === 0) return false;
  return true;
}

function factorize(n) {
  const factors = [];
  let x = n;
  for (let i = 2; i * i <= x; i++) {
    while (x % i === 0) { factors.push(i); x /= i; }
  }
  if (x > 1) factors.push(x);
  return factors;
}

function TubSonCard() {
  const [num, setNum] = useState('360');
  const n = Math.floor(Number(num));
  const valid = num !== '' && !isNaN(n) && n > 0 && n <= 100_000_000;

  const result = useMemo(() => {
    if (!valid) return null;
    return { prime: isPrime(n), factors: factorize(n) };
  }, [n, valid]);

  return (
    <Panel>
      <ModuleHeader title="Tub son tekshirish va faktorizatsiya" sub="SON NAZARIYASI" />
      <TextField label="Musbat butun son" type="number" value={num} onChange={e => setNum(e.target.value)} />
      {!valid && num !== '' && <Mono style={{ fontSize: 12, color: C.bad }}>1 dan 100,000,000 gacha musbat butun son kiriting</Mono>}
      {result && (
        <>
          <Row label="Tub son (prime)" value={result.prime ? "Ha" : "Yo'q"} valueColor={result.prime ? C.good : C.muted} />
          <Row label="Ko'paytuvchilarga ajratish" value={result.factors.join(' × ')} />
        </>
      )}
    </Panel>
  );
}

/* ---------------- FQEK / EKUK ---------------- */

function gcd(a, b) { while (b) { [a, b] = [b, a % b]; } return a; }
function lcm(a, b) { return a === 0 || b === 0 ? 0 : Math.abs(a * b) / gcd(a, b); }

function FqekEkukCard() {
  const [a, setA] = useState('24');
  const [b, setB] = useState('36');

  const result = useMemo(() => {
    const na = Math.abs(Math.floor(Number(a)));
    const nb = Math.abs(Math.floor(Number(b)));
    if (a === '' || b === '' || isNaN(na) || isNaN(nb) || na === 0 || nb === 0) return null;
    return { gcd: gcd(na, nb), lcm: lcm(na, nb) };
  }, [a, b]);

  return (
    <Panel>
      <ModuleHeader title="FQEK va EKUK hisoblagich" sub="ENG KATTA / ENG KICHIK UMUMIY" />
      <Grid2>
        <TextField label="Birinchi son" type="number" value={a} onChange={e => setA(e.target.value)} />
        <TextField label="Ikkinchi son" type="number" value={b} onChange={e => setB(e.target.value)} />
      </Grid2>
      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 18, marginTop: 8 }}>
          <BigStat label="FQEK (eng katta umumiy bo'luvchi)" value={result.gcd} color={C.good} />
          <BigStat label="EKUK (eng kichik umumiy ko'paytuvchi)" value={result.lcm} color={C.good} />
        </div>
      )}
    </Panel>
  );
}

/* ---------------- Son tizimlari konvertori ---------------- */

function SonTizimlariCard() {
  const [value, setValue] = useState('255');
  const [base, setBase] = useState(10);

  const result = useMemo(() => {
    if (!value) return null;
    const n = parseInt(value, base);
    if (isNaN(n) || n < 0) return null;
    return {
      bin: n.toString(2),
      oct: n.toString(8),
      dec: n.toString(10),
      hex: n.toString(16).toUpperCase(),
    };
  }, [value, base]);

  const validPattern = { 2: /^[01]*$/, 8: /^[0-7]*$/, 10: /^[0-9]*$/, 16: /^[0-9a-fA-F]*$/ }[base];

  return (
    <Panel>
      <ModuleHeader title="Son tizimlari konvertori" sub="2/8/10/16 ASOS" />
      <Grid2>
        <TextField label="Qiymat" value={value} onChange={e => { if (validPattern.test(e.target.value)) setValue(e.target.value); }} />
        <Select label="Kiritilgan tizim" value={base} onChange={e => setBase(+e.target.value)} options={[
          { value: 2, label: 'Ikkilik (Binary)' }, { value: 8, label: 'Sakkizlik (Octal)' },
          { value: 10, label: "O'nlik (Decimal)" }, { value: 16, label: "O'n oltilik (Hex)" },
        ]} />
      </Grid2>
      {result && (
        <>
          <Row label="Ikkilik (2)" value={result.bin} valueColor={base === 2 ? C.good : undefined} />
          <Row label="Sakkizlik (8)" value={result.oct} valueColor={base === 8 ? C.good : undefined} />
          <Row label="O'nlik (10)" value={result.dec} valueColor={base === 10 ? C.good : undefined} />
          <Row label="O'n oltilik (16)" value={result.hex} valueColor={base === 16 ? C.good : undefined} />
        </>
      )}
    </Panel>
  );
}

/* ---------------- Kvadrat ildiz / daraja kalkulyatori ---------------- */

function DarajaIldizCard() {
  const [num, setNum] = useState('2');
  const [power, setPower] = useState('10');

  const result = useMemo(() => {
    const n = Number(num), p = Number(power);
    if (num === '' || power === '' || isNaN(n) || isNaN(p)) return null;
    return {
      pow: Math.pow(n, p),
      sqrt: n >= 0 ? Math.sqrt(n).toFixed(6) : null,
      cbrt: Math.cbrt(n).toFixed(6),
    };
  }, [num, power]);

  return (
    <Panel>
      <ModuleHeader title="Daraja, ildiz kalkulyatori" sub="x^n, √x, ∛x" />
      <Grid2>
        <TextField label="Son (x)" type="number" value={num} onChange={e => setNum(e.target.value)} />
        <TextField label="Daraja (n)" type="number" value={power} onChange={e => setPower(e.target.value)} />
      </Grid2>
      {result && (
        <>
          <Row label={`x^${power}`} value={Number.isFinite(result.pow) ? result.pow.toLocaleString('uz-UZ', { maximumFractionDigits: 6 }) : 'cheksiz'} />
          <Row label="Kvadrat ildiz (√x)" value={result.sqrt ?? "Mavjud emas (manfiy son)"} />
          <Row label="Kub ildiz (∛x)" value={result.cbrt} />
        </>
      )}
    </Panel>
  );
}

/* ---------------- Kvadrat tenglama yechuvchi ---------------- */

function KvadratTenglamaCard() {
  const [a, setA] = useState('1');
  const [b, setB] = useState('-3');
  const [c, setC] = useState('2');

  const result = useMemo(() => {
    const na = Number(a), nb = Number(b), nc = Number(c);
    if (a === '' || b === '' || c === '' || isNaN(na) || isNaN(nb) || isNaN(nc) || na === 0) return null;
    const disc = nb * nb - 4 * na * nc;
    if (disc < 0) {
      const re = (-nb / (2 * na)).toFixed(4);
      const im = (Math.sqrt(-disc) / (2 * na)).toFixed(4);
      return { type: 'complex', x1: `${re} + ${im}i`, x2: `${re} − ${im}i`, disc };
    }
    if (disc === 0) {
      const x = (-nb / (2 * na)).toFixed(4);
      return { type: 'one', x1: x, disc };
    }
    const sq = Math.sqrt(disc);
    return {
      type: 'two',
      x1: ((-nb + sq) / (2 * na)).toFixed(4),
      x2: ((-nb - sq) / (2 * na)).toFixed(4),
      disc,
    };
  }, [a, b, c]);

  return (
    <Panel>
      <ModuleHeader title="Kvadrat tenglama yechuvchi" sub="ax² + bx + c = 0" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <TextField label="a" type="number" value={a} onChange={e => setA(e.target.value)} />
        <TextField label="b" type="number" value={b} onChange={e => setB(e.target.value)} />
        <TextField label="c" type="number" value={c} onChange={e => setC(e.target.value)} />
      </div>
      {a !== '' && Number(a) === 0 && <Mono style={{ fontSize: 12, color: C.bad }}>a ≠ 0 bo'lishi kerak (aks holda chiziqli tenglama)</Mono>}
      {result && (
        <>
          <Row label="Diskriminant (D)" value={result.disc.toFixed(4)} />
          {result.type === 'two' && (<><Row label="x₁" value={result.x1} valueColor={C.good} /><Row label="x₂" value={result.x2} valueColor={C.good} /></>)}
          {result.type === 'one' && <Row label="x (yagona ildiz)" value={result.x1} valueColor={C.good} />}
          {result.type === 'complex' && (<><Row label="x₁ (kompleks)" value={result.x1} /><Row label="x₂ (kompleks)" value={result.x2} /></>)}
        </>
      )}
    </Panel>
  );
}

/* ---------------- Asosiy statistika kalkulyatori ---------------- */

function StatistikaCard() {
  const [text, setText] = useState('4, 8, 6, 5, 3, 9, 7');

  const result = useMemo(() => {
    const nums = text.split(/[,\s]+/).map(Number).filter(n => !isNaN(n) && n !== undefined && text.trim() !== '');
    if (nums.length === 0) return null;
    const sorted = [...nums].sort((a, b) => a - b);
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / nums.length;
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    const variance = nums.reduce((a, n) => a + (n - mean) ** 2, 0) / nums.length;
    const stdDev = Math.sqrt(variance);
    const freq = {};
    nums.forEach(n => { freq[n] = (freq[n] || 0) + 1; });
    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);

    return {
      count: nums.length, sum, mean, median, min: sorted[0], max: sorted[sorted.length - 1],
      stdDev, mode: maxFreq > 1 ? modes.join(', ') : "Yo'q (barchasi noyob)",
    };
  }, [text]);

  return (
    <Panel>
      <ModuleHeader title="Asosiy statistika kalkulyatori" sub="O'RTACHA / MEDIANA / STD" />
      <label style={{ display: 'block', marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: C.muted, letterSpacing: '0.05em', marginBottom: 6, textTransform: 'uppercase', fontFamily: "'Inter',sans-serif" }}>
          Sonlar (vergul yoki probel bilan ajratilgan)
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} rows={3} style={{
          width: '100%', background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text,
          padding: '10px 12px', fontSize: 13, fontFamily: "'JetBrains Mono',monospace", outline: 'none', resize: 'vertical', boxSizing: 'border-box',
        }} />
      </label>
      {result && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 16, marginBottom: 14 }}>
            <BigStat label="O'rtacha" value={result.mean.toFixed(2)} color={C.good} />
            <BigStat label="Mediana" value={result.median.toFixed(2)} />
            <BigStat label="Standart og'ish" value={result.stdDev.toFixed(2)} />
          </div>
          <Row label="Elementlar soni" value={result.count} />
          <Row label="Yig'indi" value={result.sum} />
          <Row label="Minimum" value={result.min} />
          <Row label="Maksimum" value={result.max} />
          <Row label="Moda (eng ko'p takrorlangan)" value={result.mode} />
        </>
      )}
    </Panel>
  );
}

export default function EduMathSuite() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <FoizCard />
      <GpaCard />
      <KvadratTenglamaCard />
      <StatistikaCard />
      <FqekEkukCard />
      <TubSonCard />
      <SonTizimlariCard />
      <DarajaIldizCard />
    </div>
  );
}
