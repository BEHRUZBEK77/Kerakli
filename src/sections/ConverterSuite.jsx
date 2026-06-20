import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { C, Mono, Panel, ModuleHeader, Row, BigStat, TextField, Select, Button, Grid2, StatusDot } from '../ui.jsx';

/* ---------------- Generic linear unit converter factory ---------------- */

function makeLinearConverter(units, baseKey = Object.keys(units)[0]) {
  return function convert(value, fromUnit, toUnit) {
    const base = value * units[fromUnit];
    return base / units[toUnit];
  };
}

function LinearConverterCard({ title, sub, units, defaultFrom, defaultTo, precision = 6 }) {
  const [value, setValue] = useState('1');
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);

  const result = useMemo(() => {
    const n = Number(value);
    if (value === '' || isNaN(n)) return null;
    const convert = makeLinearConverter(units);
    const r = convert(n, from, to);
    return Number(r.toFixed(precision)).toString();
  }, [value, from, to, units, precision]);

  const options = Object.keys(units).map(k => ({ value: k, label: k }));

  return (
    <Panel>
      <ModuleHeader title={title} sub={sub} />
      <Grid2>
        <TextField label="Qiymat" type="number" value={value} onChange={e => setValue(e.target.value)} />
        <Select label="Dan" value={from} onChange={e => setFrom(e.target.value)} options={options} />
      </Grid2>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 14px' }}>
        <Button onClick={() => { setFrom(to); setTo(from); }}>⇄ ALMASHTIRISH</Button>
      </div>
      <Select label="Ga" value={to} onChange={e => setTo(e.target.value)} options={options} />
      {result !== null && (
        <div style={{ background: C.panelAlt, border: `1px solid ${C.border}`, padding: '16px', textAlign: 'center', marginTop: 14 }}>
          <Mono style={{ fontSize: 24, color: C.good }}>{result}</Mono>
          <Mono style={{ fontSize: 12, color: C.muted, display: 'block', marginTop: 4 }}>{to}</Mono>
        </div>
      )}
    </Panel>
  );
}

const UZUNLIK_BIRLIKLARI = {
  mm: 0.001, sm: 0.01, m: 1, km: 1000,
  dyum: 0.0254, fut: 0.3048, yard: 0.9144, mil: 1609.344,
};

const OGIRLIK_BIRLIKLARI = {
  mg: 0.000001, g: 0.001, kg: 1, tonna: 1000,
  funt: 0.453592, untsiya: 0.0283495,
};

const MAYDON_BIRLIKLARI = {
  'm²': 1, 'km²': 1000000, 'sm²': 0.0001, 'gektar': 10000,
  'sotix': 100, 'aker': 4046.86, 'fut²': 0.092903,
};

const HAJM_BIRLIKLARI = {
  'ml': 0.001, 'l': 1, 'm³': 1000,
  'stakan': 0.24, 'gallon': 3.78541, 'fut³': 28.3168,
};

const TEZLIK_BIRLIKLARI = {
  'km/soat': 1, 'm/s': 3.6, 'mil/soat': 1.60934, 'tugun (knot)': 1.852,
};

const MALUMOT_BIRLIKLARI = {
  bit: 0.000000125, bayt: 0.000001, KB: 0.001, MB: 1, GB: 1000, TB: 1000000,
};

/* ---------------- Harorat ---------------- */

function HaroratCard() {
  const [value, setValue] = useState('0');
  const [from, setFrom] = useState('C');

  const result = useMemo(() => {
    const n = Number(value);
    if (value === '' || isNaN(n)) return null;
    let c;
    if (from === 'C') c = n;
    else if (from === 'F') c = (n - 32) * 5 / 9;
    else c = n - 273.15;
    return {
      c: c.toFixed(2),
      f: (c * 9 / 5 + 32).toFixed(2),
      k: (c + 273.15).toFixed(2),
    };
  }, [value, from]);

  return (
    <Panel>
      <ModuleHeader title="Harorat konvertori" sub="C° / F° / K" />
      <Grid2>
        <TextField label="Qiymat" type="number" value={value} onChange={e => setValue(e.target.value)} />
        <Select label="Birlik" value={from} onChange={e => setFrom(e.target.value)} options={[
          { value: 'C', label: 'Selsiy (°C)' }, { value: 'F', label: 'Farengeyt (°F)' }, { value: 'K', label: 'Kelvin (K)' },
        ]} />
      </Grid2>
      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 16, marginTop: 14 }}>
          <BigStat label="Selsiy" value={result.c} unit="°C" color={from === 'C' ? C.good : undefined} />
          <BigStat label="Farengeyt" value={result.f} unit="°F" color={from === 'F' ? C.good : undefined} />
          <BigStat label="Kelvin" value={result.k} unit="K" color={from === 'K' ? C.good : undefined} />
        </div>
      )}
    </Panel>
  );
}

/* ---------------- Valyuta konvertori (API + lokal fallback) ---------------- */

const FALLBACK_RATES_USD = {
  USD: 1, EUR: 0.92, RUB: 88, UZS: 12700, GBP: 0.78,
  KZT: 480, TRY: 32.5, CNY: 7.2, JPY: 150, AED: 3.67,
};

const VALYUTA_NOMLARI = {
  USD: 'AQSH dollari', EUR: 'Yevro', RUB: 'Rossiya rubli', UZS: "O'zbek so'mi",
  GBP: 'Britaniya funti', KZT: 'Qozoq tengesi', TRY: 'Turk lirasi',
  CNY: 'Xitoy yuani', JPY: 'Yapon yenasi', AED: 'BAA dirhami',
};

function ValyutaCard() {
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('UZS');
  const [rates, setRates] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | live | fallback | error
  const [updatedAt, setUpdatedAt] = useState(null);

  const fetchRates = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error('network');
      const data = await res.json();
      if (data && data.rates) {
        const merged = { ...FALLBACK_RATES_USD, ...data.rates };
        setRates(merged);
        setStatus('live');
        setUpdatedAt(new Date());
        return;
      }
      throw new Error('bad payload');
    } catch (e) {
      setRates(FALLBACK_RATES_USD);
      setStatus('fallback');
      setUpdatedAt(new Date());
    }
  }, []);

  useEffect(() => { fetchRates(); }, [fetchRates]);

  const result = useMemo(() => {
    if (!rates) return null;
    const n = Number(amount);
    if (amount === '' || isNaN(n)) return null;
    const usdAmount = n / rates[from];
    return (usdAmount * rates[to]).toFixed(4);
  }, [rates, amount, from, to]);

  const codes = Object.keys(FALLBACK_RATES_USD);
  const options = codes.map(c => ({ value: c, label: `${c} — ${VALYUTA_NOMLARI[c] || c}` }));

  return (
    <Panel>
      <ModuleHeader
        title="Valyuta konvertori"
        sub={status === 'loading' ? undefined : (status === 'live' ? 'JONLI KURS' : "LOKAL ZAXIRA KURSI")}
        scanning={status === 'loading'}
      />
      <Grid2>
        <TextField label="Miqdor" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        <Select label="Dan" value={from} onChange={e => setFrom(e.target.value)} options={options} />
      </Grid2>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 14px' }}>
        <Button onClick={() => { setFrom(to); setTo(from); }}>⇄ ALMASHTIRISH</Button>
      </div>
      <Select label="Ga" value={to} onChange={e => setTo(e.target.value)} options={options} />

      {result !== null && (
        <div style={{ background: C.panelAlt, border: `1px solid ${C.border}`, padding: '16px', textAlign: 'center', margin: '14px 0' }}>
          <Mono style={{ fontSize: 24, color: C.good }}>{Number(result).toLocaleString('uz-UZ', { maximumFractionDigits: 4 })}</Mono>
          <Mono style={{ fontSize: 12, color: C.muted, display: 'block', marginTop: 4 }}>{to}</Mono>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <Mono style={{ fontSize: 10.5, color: C.muted }}>
          {status === 'live' && updatedAt && `Yangilandi: ${updatedAt.toLocaleTimeString('uz-UZ')}`}
          {status === 'fallback' && "API ishlamadi — taxminiy kurs ishlatildi"}
          {status === 'loading' && 'Kurslar yuklanmoqda…'}
        </Mono>
        <Button onClick={fetchRates}>↻ YANGILASH</Button>
      </div>
    </Panel>
  );
}

const BOSIM_BIRLIKLARI = {
  Pa: 1, kPa: 1000, bar: 100000, atm: 101325, 'mm.sim.ust.': 133.322, psi: 6894.76,
};

const VAQT_BIRLIKLARI = {
  soniya: 1, daqiqa: 60, soat: 3600, kun: 86400, hafta: 604800, oy: 2629800, yil: 31557600,
};

export default function ConverterSuite() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <ValyutaCard />
      <HaroratCard />
      <LinearConverterCard title="Uzunlik konvertori" sub="METR / FUT / MIL" units={UZUNLIK_BIRLIKLARI} defaultFrom="m" defaultTo="sm" />
      <LinearConverterCard title="Og'irlik konvertori" sub="KG / FUNT" units={OGIRLIK_BIRLIKLARI} defaultFrom="kg" defaultTo="funt" />
      <LinearConverterCard title="Maydon konvertori" sub="M² / GEKTAR / SOTIX" units={MAYDON_BIRLIKLARI} defaultFrom="sotix" defaultTo="m²" precision={3} />
      <LinearConverterCard title="Hajm konvertori" sub="LITR / GALLON" units={HAJM_BIRLIKLARI} defaultFrom="l" defaultTo="gallon" />
      <LinearConverterCard title="Tezlik konvertori" sub="KM/SOAT / M/S" units={TEZLIK_BIRLIKLARI} defaultFrom="km/soat" defaultTo="m/s" />
      <LinearConverterCard title="Ma'lumot hajmi konvertori" sub="MB / GB / TB" units={MALUMOT_BIRLIKLARI} defaultFrom="GB" defaultTo="MB" precision={3} />
      <LinearConverterCard title="Bosim konvertori" sub="PA / BAR / ATM / PSI" units={BOSIM_BIRLIKLARI} defaultFrom="bar" defaultTo="psi" precision={4} />
      <LinearConverterCard title="Vaqt birliklari konvertori" sub="SONIYA / SOAT / KUN" units={VAQT_BIRLIKLARI} defaultFrom="soat" defaultTo="daqiqa" precision={4} />
    </div>
  );
}
