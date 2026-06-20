import React, { useState, useMemo, useEffect } from 'react';
import { C, Mono, Panel, ModuleHeader, Row, BigStat, TextField, Select, Button, Grid2, StatusDot } from '../ui.jsx';

const OY_NOMLARI = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
const HAFTA_KUNLARI = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];

function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

/* ---------------- Yosh hisoblash ---------------- */

function YoshHisoblashCard() {
  const [birth, setBirth] = useState('');
  const [target, setTarget] = useState(todayStr());

  const result = useMemo(() => {
    if (!birth) return null;
    const b = new Date(birth + 'T00:00:00');
    const t = new Date(target + 'T00:00:00');
    if (isNaN(b) || isNaN(t) || t < b) return null;

    let years = t.getFullYear() - b.getFullYear();
    let months = t.getMonth() - b.getMonth();
    let days = t.getDate() - b.getDate();
    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(t.getFullYear(), t.getMonth(), 0).getDate();
      days += prevMonth;
    }
    if (months < 0) { months += 12; years -= 1; }

    const totalDays = Math.round((t - b) / 86400000);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const nextBirthday = new Date(t.getFullYear(), b.getMonth(), b.getDate());
    if (nextBirthday < t) nextBirthday.setFullYear(t.getFullYear() + 1);
    const daysToBirthday = Math.round((nextBirthday - t) / 86400000);

    return { years, months, days, totalDays, totalWeeks, totalMonths, daysToBirthday };
  }, [birth, target]);

  return (
    <Panel>
      <ModuleHeader title="Yosh hisoblash" sub="TANIQ" />
      <Grid2>
        <TextField label="Tug'ilgan sana" type="date" value={birth} onChange={e => setBirth(e.target.value)} />
        <TextField label="Hisoblash sanasi" type="date" value={target} onChange={e => setTarget(e.target.value)} />
      </Grid2>
      {result && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 20, margin: '18px 0' }}>
            <BigStat label="Yil" value={result.years} color={C.good} />
            <BigStat label="Oy" value={result.months} />
            <BigStat label="Kun" value={result.days} />
          </div>
          <Row label="Jami kunlar" value={result.totalDays.toLocaleString()} />
          <Row label="Jami haftalar" value={result.totalWeeks.toLocaleString()} />
          <Row label="Jami oylar" value={result.totalMonths.toLocaleString()} />
          <Row label="Keyingi tug'ilgan kungacha" value={result.daysToBirthday === 0 ? "Bugun! 🎉" : `${result.daysToBirthday} kun`} valueColor={result.daysToBirthday <= 7 ? C.good : undefined} />
        </>
      )}
      {!result && birth && <Mono style={{ fontSize: 12, color: C.bad }}>Sana noto'g'ri yoki hisoblash sanasidan keyin</Mono>}
    </Panel>
  );
}

/* ---------------- Kunlar farqi ---------------- */

function KunlarFarqiCard() {
  const [d1, setD1] = useState(todayStr());
  const [d2, setD2] = useState(todayStr());

  const result = useMemo(() => {
    if (!d1 || !d2) return null;
    const a = new Date(d1 + 'T00:00:00');
    const b = new Date(d2 + 'T00:00:00');
    if (isNaN(a) || isNaN(b)) return null;
    const diffMs = Math.abs(b - a);
    const days = Math.round(diffMs / 86400000);
    const weeks = Math.floor(days / 7);
    const months = Math.round(days / 30.44);
    const years = (days / 365.25).toFixed(2);
    const workdays = (() => {
      let count = 0;
      const start = a < b ? new Date(a) : new Date(b);
      const end = a < b ? b : a;
      const cur = new Date(start);
      while (cur <= end) {
        const dow = cur.getDay();
        if (dow !== 0 && dow !== 6) count++;
        cur.setDate(cur.getDate() + 1);
      }
      return count;
    })();
    return { days, weeks, months, years, workdays };
  }, [d1, d2]);

  return (
    <Panel>
      <ModuleHeader title="Ikki sana orasidagi farq" sub="HISOBLASH" />
      <Grid2>
        <TextField label="Birinchi sana" type="date" value={d1} onChange={e => setD1(e.target.value)} />
        <TextField label="Ikkinchi sana" type="date" value={d2} onChange={e => setD2(e.target.value)} />
      </Grid2>
      {result && (
        <>
          <BigStat label="Jami kunlar" value={result.days.toLocaleString()} color={C.good} />
          <div style={{ marginTop: 16 }}>
            <Row label="Hafta (taxminiy)" value={result.weeks} />
            <Row label="Oy (taxminiy)" value={result.months} />
            <Row label="Yil (taxminiy)" value={result.years} />
            <Row label="Ish kunlari (dam olish kunlarisiz)" value={result.workdays} />
          </div>
        </>
      )}
    </Panel>
  );
}

/* ---------------- Sanaga kun/oy/yil qo'shish ---------------- */

function SanagaQoshishCard() {
  const [base, setBase] = useState(todayStr());
  const [amount, setAmount] = useState(30);
  const [unit, setUnit] = useState('days');
  const [mode, setMode] = useState('add');

  const result = useMemo(() => {
    if (!base) return null;
    const d = new Date(base + 'T00:00:00');
    if (isNaN(d)) return null;
    const sign = mode === 'add' ? 1 : -1;
    const n = sign * Number(amount || 0);
    if (unit === 'days') d.setDate(d.getDate() + n);
    else if (unit === 'weeks') d.setDate(d.getDate() + n * 7);
    else if (unit === 'months') d.setMonth(d.getMonth() + n);
    else if (unit === 'years') d.setFullYear(d.getFullYear() + n);
    return d;
  }, [base, amount, unit, mode]);

  return (
    <Panel>
      <ModuleHeader title="Sanaga qo'shish / ayirish" sub="KALKULYATOR" />
      <TextField label="Boshlang'ich sana" type="date" value={base} onChange={e => setBase(e.target.value)} />
      <Grid2>
        <TextField label="Miqdor" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        <Select label="Birlik" value={unit} onChange={e => setUnit(e.target.value)} options={[
          { value: 'days', label: 'Kun' }, { value: 'weeks', label: 'Hafta' },
          { value: 'months', label: 'Oy' }, { value: 'years', label: 'Yil' },
        ]} />
      </Grid2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        <Button variant={mode === 'add' ? 'primary' : 'default'} onClick={() => setMode('add')} style={{ flex: 1 }}>+ QO'SHISH</Button>
        <Button variant={mode === 'sub' ? 'primary' : 'default'} onClick={() => setMode('sub')} style={{ flex: 1 }}>− AYIRISH</Button>
      </div>
      {result && (
        <div style={{ background: C.panelAlt, border: `1px solid ${C.border}`, padding: '16px', textAlign: 'center' }}>
          <Mono style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 6 }}>NATIJA SANASI</Mono>
          <Mono style={{ fontSize: 22, color: C.good }}>{result.toLocaleDateString('uz-UZ')}</Mono>
          <Mono style={{ fontSize: 12, color: C.mutedLight, display: 'block', marginTop: 4 }}>{HAFTA_KUNLARI[result.getDay()]}</Mono>
        </div>
      )}
    </Panel>
  );
}

/* ---------------- Hafta kuni aniqlash ---------------- */

function HaftaKuniCard() {
  const [date, setDate] = useState(todayStr());
  const info = useMemo(() => {
    if (!date) return null;
    const d = new Date(date + 'T00:00:00');
    if (isNaN(d)) return null;
    const start = new Date(d.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((d - start) / 86400000) + 1;
    const weekNum = Math.ceil((dayOfYear + (start.getDay() === 0 ? 6 : start.getDay() - 1)) / 7);
    const isLeap = (y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0)(d.getFullYear());
    const quarter = Math.floor(d.getMonth() / 3) + 1;
    return { dow: HAFTA_KUNLARI[d.getDay()], dayOfYear, weekNum, isLeap, quarter, month: OY_NOMLARI[d.getMonth()] };
  }, [date]);

  return (
    <Panel>
      <ModuleHeader title="Sana haqida ma'lumot" sub="TAHLIL" />
      <TextField label="Sana" type="date" value={date} onChange={e => setDate(e.target.value)} />
      {info && (
        <>
          <Row label="Hafta kuni" value={info.dow} valueColor={C.good} />
          <Row label="Oy" value={info.month} />
          <Row label="Yilning nechanchi kuni" value={`${info.dayOfYear}-kun`} />
          <Row label="Yilning nechanchi haftasi" value={`${info.weekNum}-hafta`} />
          <Row label="Chorak" value={`Q${info.quarter}`} />
          <Row label="Kabisa yili" value={info.isLeap ? 'Ha' : "Yo'q"} valueColor={info.isLeap ? C.good : C.muted} />
        </>
      )}
    </Panel>
  );
}

/* ---------------- Unix timestamp konvertor ---------------- */

function UnixTimeCard() {
  const [ts, setTs] = useState(() => Math.floor(Date.now() / 1000).toString());
  const [iso, setIso] = useState(() => new Date().toISOString().slice(0, 16));
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const fromTs = useMemo(() => {
    const n = Number(ts);
    if (!ts || isNaN(n)) return null;
    const d = new Date(n * 1000);
    if (isNaN(d)) return null;
    return d;
  }, [ts]);

  const toTs = useMemo(() => {
    if (!iso) return null;
    const d = new Date(iso);
    if (isNaN(d)) return null;
    return Math.floor(d.getTime() / 1000);
  }, [iso]);

  return (
    <Panel>
      <ModuleHeader title="Unix Timestamp konvertor" sub={`HOZIR: ${Math.floor(now / 1000)}`} />
      <TextField label="Unix timestamp (soniya)" value={ts} onChange={e => setTs(e.target.value.replace(/[^\d-]/g, ''))} placeholder="1700000000" />
      {fromTs && (
        <Mono style={{ fontSize: 13, color: C.good, display: 'block', marginBottom: 18 }}>
          → {fromTs.toLocaleString('uz-UZ')} ({HAFTA_KUNLARI[fromTs.getDay()]})
        </Mono>
      )}
      <TextField label="Sana va vaqt" type="datetime-local" value={iso} onChange={e => setIso(e.target.value)} />
      {toTs != null && (
        <Mono style={{ fontSize: 13, color: C.good, display: 'block' }}>→ {toTs}</Mono>
      )}
      <div style={{ marginTop: 14 }}>
        <Button onClick={() => { setTs(Math.floor(Date.now() / 1000).toString()); }}>HOZIRGI VAQTNI OLISH</Button>
      </div>
    </Panel>
  );
}

/* ---------------- Soat zonalari ---------------- */

const ZONALAR = [
  { id: 'Asia/Tashkent', label: "Toshkent (O'zbekiston)" },
  { id: 'Asia/Almaty', label: 'Almati (Qozogʻiston)' },
  { id: 'Europe/Moscow', label: 'Moskva (Rossiya)' },
  { id: 'Europe/Istanbul', label: 'Istanbul (Turkiya)' },
  { id: 'Europe/London', label: 'London (Buyuk Britaniya)' },
  { id: 'Europe/Berlin', label: 'Berlin (Germaniya)' },
  { id: 'America/New_York', label: 'Nyu-York (AQSH)' },
  { id: 'America/Los_Angeles', label: 'Los-Anjeles (AQSH)' },
  { id: 'Asia/Dubai', label: 'Dubay (BAA)' },
  { id: 'Asia/Tokyo', label: 'Tokio (Yaponiya)' },
  { id: 'Asia/Shanghai', label: 'Shanxay (Xitoy)' },
  { id: 'Asia/Seoul', label: 'Seul (Janubiy Koreya)' },
];

function SoatZonalariCard() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <Panel>
      <ModuleHeader title="Dunyo soat zonalari" sub="JONLI" scanning />
      {ZONALAR.map(z => {
        let timeStr = '—';
        try {
          timeStr = now.toLocaleTimeString('uz-UZ', { timeZone: z.id, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        } catch { /* ignore */ }
        return <Row key={z.id} label={z.label} value={timeStr} />;
      })}
    </Panel>
  );
}

/* ---------------- Sanani matn shaklida formatlash ---------------- */

const FORMAT_VARIANTLARI = [
  { id: 'dmy_slash', fn: d => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}` },
  { id: 'ymd_dash', fn: d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` },
  { id: 'long_uz', fn: d => `${d.getDate()}-${OY_NOMLARI[d.getMonth()]}, ${d.getFullYear()}-yil` },
  { id: 'long_full', fn: d => `${HAFTA_KUNLARI[d.getDay()]}, ${d.getDate()}-${OY_NOMLARI[d.getMonth()]} ${d.getFullYear()}-yil` },
];

function SanaFormatlashCard() {
  const [date, setDate] = useState(todayStr());
  const d = date ? new Date(date + 'T00:00:00') : null;
  const valid = d && !isNaN(d);

  return (
    <Panel>
      <ModuleHeader title="Sanani formatlash" sub="MATN KO'RINISHI" />
      <TextField label="Sana" type="date" value={date} onChange={e => setDate(e.target.value)} />
      {valid && (
        <div style={{ marginTop: 6 }}>
          {FORMAT_VARIANTLARI.map(v => (
            <Row key={v.id} label={v.id.toUpperCase()} value={v.fn(d)} />
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ---------------- Pomodoro / sanoq mashqi taymeri ---------------- */

function TaymerCard() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [secsLeft, setSecsLeft] = useState(25 * 60);
  const initialRef = React.useRef(25 * 60);

  useEffect(() => {
    if (!running) return;
    if (secsLeft <= 0) { setRunning(false); return; }
    const t = setTimeout(() => setSecsLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, secsLeft]);

  const start = () => {
    const total = Math.max(1, Number(minutes) || 0) * 60 + Math.max(0, Number(seconds) || 0);
    initialRef.current = total;
    setSecsLeft(total);
    setRunning(true);
  };
  const stop = () => setRunning(false);
  const reset = () => { setRunning(false); setSecsLeft(initialRef.current); };

  const mm = String(Math.floor(secsLeft / 60)).padStart(2, '0');
  const ss = String(secsLeft % 60).padStart(2, '0');
  const done = secsLeft === 0;

  return (
    <Panel>
      <ModuleHeader title="Taymer (sanoq)" sub={running ? undefined : 'TURXAT'} scanning={running} />
      <Grid2>
        <TextField label="Daqiqa" type="number" value={minutes} onChange={e => setMinutes(e.target.value)} />
        <TextField label="Soniya" type="number" value={seconds} onChange={e => setSeconds(e.target.value)} />
      </Grid2>
      <div style={{
        textAlign: 'center', padding: '24px 0', background: C.panelAlt, border: `1px solid ${C.border}`, margin: '14px 0 18px',
      }}>
        <Mono style={{ fontSize: 42, fontWeight: 600, color: done ? C.bad : C.good }}>{mm}:{ss}</Mono>
        {done && <Mono style={{ fontSize: 12, color: C.bad, display: 'block', marginTop: 6 }}>VAQT TUGADI ⏰</Mono>}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button onClick={start} variant="primary" style={{ flex: 1 }}>▶ BOSHLASH</Button>
        <Button onClick={stop} style={{ flex: 1 }}>❙❙ TO'XTATISH</Button>
        <Button onClick={reset} style={{ flex: 1 }}>↺ QAYTA</Button>
      </div>
    </Panel>
  );
}

export default function DateTimeSuite() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <YoshHisoblashCard />
      <KunlarFarqiCard />
      <SanagaQoshishCard />
      <HaftaKuniCard />
      <UnixTimeCard />
      <SoatZonalariCard />
      <SanaFormatlashCard />
      <TaymerCard />
    </div>
  );
}
