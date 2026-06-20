import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { C, Mono, Panel, ModuleHeader, Row, Bar, BigStat, TextField, Slider, Toggle, Button, CopyButton, Grid2, StatusDot } from '../ui.jsx';

/* ---------------- Password generator ---------------- */

const CHARSETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};
const AMBIGUOUS = 'il1Lo0O';

function generatePassword({ length, lower, upper, digits, symbols, excludeAmbiguous }) {
  let pool = '';
  if (lower) pool += CHARSETS.lower;
  if (upper) pool += CHARSETS.upper;
  if (digits) pool += CHARSETS.digits;
  if (symbols) pool += CHARSETS.symbols;
  if (excludeAmbiguous) pool = pool.split('').filter(c => !AMBIGUOUS.includes(c)).join('');
  if (!pool) return '';
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  let result = '';
  for (let i = 0; i < length; i++) result += pool[arr[i] % pool.length];
  return result;
}

function PasswordGeneratorCard() {
  const [length, setLength] = useState(16);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [pwd, setPwd] = useState('');

  const regenerate = useCallback(() => {
    setPwd(generatePassword({ length, lower, upper, digits, symbols, excludeAmbiguous }));
  }, [length, lower, upper, digits, symbols, excludeAmbiguous]);

  useEffect(() => { regenerate(); }, [regenerate]);

  return (
    <Panel>
      <ModuleHeader title="Parol generatori" sub="XAVFSIZ" />
      <div style={{
        background: C.panelAlt, border: `1px solid ${C.border}`, padding: '18px 16px',
        marginBottom: 20, wordBreak: 'break-all', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <Mono style={{ fontSize: 17, color: C.good, letterSpacing: '0.02em' }}>{pwd || '—'}</Mono>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
        <Button onClick={regenerate} variant="primary" style={{ flex: 1 }}>↻ YANGI PAROL</Button>
        <CopyButton text={pwd} />
      </div>
      <Slider label="Uzunlik" value={length} onChange={e => setLength(+e.target.value)} min={6} max={64} suffix=" belgi" />
      <Toggle label="Kichik harflar (a-z)" checked={lower} onChange={() => setLower(v => !v)} />
      <Toggle label="Katta harflar (A-Z)" checked={upper} onChange={() => setUpper(v => !v)} />
      <Toggle label="Raqamlar (0-9)" checked={digits} onChange={() => setDigits(v => !v)} />
      <Toggle label="Maxsus belgilar (!@#$…)" checked={symbols} onChange={() => setSymbols(v => !v)} />
      <Toggle label="Chalkash belgilarni chiqarib tashlash (l, 1, O, 0)" checked={excludeAmbiguous} onChange={() => setExcludeAmbiguous(v => !v)} />
    </Panel>
  );
}

/* ---------------- Password strength checker ---------------- */

const COMMON_PASSWORDS = new Set([
  'password', '123456', '12345678', 'qwerty', 'abc123', '111111', '123456789',
  'password1', 'iloveyou', 'admin', 'welcome', 'monkey', 'login', 'qwerty123',
  'letmein', 'football', 'starwars', 'dragon', 'master', 'sunshine',
]);

function analyzePassword(pwd) {
  if (!pwd) return null;
  const checks = {
    length12: pwd.length >= 12,
    length8: pwd.length >= 8,
    hasLower: /[a-z]/.test(pwd),
    hasUpper: /[A-Z]/.test(pwd),
    hasDigit: /[0-9]/.test(pwd),
    hasSymbol: /[^a-zA-Z0-9]/.test(pwd),
    notCommon: !COMMON_PASSWORDS.has(pwd.toLowerCase()),
    noRepeat: !/(.)\1{2,}/.test(pwd),
    noSequence: !/(012|123|234|345|456|567|678|789|abc|bcd|cde|qwe|asd)/i.test(pwd),
  };

  let poolSize = 0;
  if (checks.hasLower) poolSize += 26;
  if (checks.hasUpper) poolSize += 26;
  if (checks.hasDigit) poolSize += 10;
  if (checks.hasSymbol) poolSize += 32;
  const entropy = pwd.length * Math.log2(poolSize || 1);

  const guessesPerSecond = 10_000_000_000; // offline fast hash assumption
  const combinations = Math.pow(poolSize || 1, pwd.length);
  const secondsToCrack = combinations / guessesPerSecond;

  const passedCount = Object.values(checks).filter(Boolean).length;
  const score = Math.min(100, Math.round((entropy / 80) * 100));

  let label, color;
  if (!checks.notCommon) { label = "Juda zaif — keng tarqalgan parol"; color = C.bad; }
  else if (score < 30) { label = 'Zaif'; color = C.bad; }
  else if (score < 55) { label = "O'rtacha"; color = C.warn; }
  else if (score < 80) { label = 'Kuchli'; color = C.good; }
  else { label = 'Juda kuchli'; color = C.good; }

  return { checks, entropy, secondsToCrack, score, label, color, passedCount };
}

function fmtCrackTime(seconds) {
  if (!isFinite(seconds)) return 'cheksiz';
  if (seconds < 1) return '1 soniyadan kam';
  const units = [
    ['asr', 3153600000], ['yil', 31536000], ['oy', 2592000],
    ['kun', 86400], ['soat', 3600], ['daqiqa', 60], ['soniya', 1],
  ];
  for (const [name, secs] of units) {
    if (seconds >= secs) {
      const val = Math.floor(seconds / secs);
      return val > 999999 ? `${val.toExponential(1)} ${name}` : `${val.toLocaleString()} ${name}`;
    }
  }
  return `${Math.round(seconds)} soniya`;
}

function PasswordStrengthCard() {
  const [pwd, setPwd] = useState('');
  const [show, setShow] = useState(false);
  const result = useMemo(() => analyzePassword(pwd), [pwd]);

  const checkLabels = {
    length12: '12+ belgi uzunlikda',
    length8: 'Kamida 8 belgi',
    hasLower: 'Kichik harflar mavjud',
    hasUpper: 'Katta harflar mavjud',
    hasDigit: 'Raqamlar mavjud',
    hasSymbol: 'Maxsus belgilar mavjud',
    notCommon: "Keng tarqalgan parollar ro'yxatida yo'q",
    noRepeat: 'Ketma-ket takrorlanish yo\'q (aaa, 111)',
    noSequence: 'Ketma-ket belgilar yo\'q (123, abc)',
  };

  return (
    <Panel>
      <ModuleHeader title="Parol kuchini tekshirish" sub={result ? `BALL: ${result.score}/100` : ''} />
      <div style={{ position: 'relative', marginBottom: 18 }}>
        <TextField
          label="Parolingizni kiriting"
          type={show ? 'text' : 'password'}
          value={pwd}
          onChange={e => setPwd(e.target.value)}
          placeholder="Tekshirish uchun parol kiriting…"
        />
        <button onClick={() => setShow(v => !v)} style={{
          position: 'absolute', right: 10, top: 32, background: 'transparent', border: 'none',
          color: C.muted, cursor: 'pointer', fontSize: 11, fontFamily: "'JetBrains Mono',monospace",
        }}>{show ? 'YASHIRISH' : "KO'RSATISH"}</button>
      </div>

      <div style={{ fontSize: 10, color: C.muted, marginBottom: 18, fontFamily: "'Inter',sans-serif" }}>
        Parolingiz hech qaerga yuborilmaydi — tahlil to'liq brauzeringizda, lokal amalga oshiriladi.
      </div>

      {result && (
        <>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <Mono style={{ fontSize: 16, color: result.color, fontWeight: 600 }}>{result.label}</Mono>
              <Mono style={{ fontSize: 12, color: C.muted }}>{result.score}/100</Mono>
            </div>
            <Bar value={result.score} max={100} color={result.color} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 20, marginBottom: 20 }}>
            <BigStat label="Entropiya" value={result.entropy.toFixed(0)} unit="bit" />
            <div>
              <div style={{ fontSize: 11, color: C.muted, letterSpacing: '0.08em', marginBottom: 6, textTransform: 'uppercase', fontFamily: "'Inter',sans-serif" }}>Buzish vaqti (taxmin)</div>
              <Mono style={{ fontSize: 15, color: result.color }}>{fmtCrackTime(result.secondsToCrack)}</Mono>
            </div>
          </div>

          <div>
            {Object.entries(checkLabels).map(([key, label]) => (
              <div key={key} style={{ display: 'flex', gap: 9, padding: '7px 0', alignItems: 'center' }}>
                <StatusDot state={result.checks[key] ? 'good' : 'bad'} />
                <span style={{ fontSize: 12, fontFamily: "'Inter',sans-serif", color: result.checks[key] ? C.mutedLight : C.muted }}>{label}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14, fontSize: 10.5, color: C.muted, fontFamily: "'Inter',sans-serif" }}>
            Eslatma: "buzish vaqti" — offline tezkor hash hujumi uchun taxminiy hisob (10 mlrd urinish/soniya). Real vaqt saytning himoyasiga qarab farq qiladi.
          </div>
        </>
      )}
    </Panel>
  );
}

/* ---------------- Data breach style self-check (heuristic, no external call) ---------------- */

function PinCodeCard() {
  const [pin, setPin] = useState('');
  const weak = useMemo(() => {
    if (!/^\d{4,6}$/.test(pin)) return null;
    const digits = pin.split('').map(Number);
    const isSequential = digits.every((d, i) => i === 0 || d === digits[i - 1] + 1);
    const isReverseSeq = digits.every((d, i) => i === 0 || d === digits[i - 1] - 1);
    const isRepeat = digits.every(d => d === digits[0]);
    const commonPins = new Set(['1234', '0000', '1111', '1212', '7777', '1004', '2000', '4444', '2222', '123456', '000000', '111111']);
    const isCommon = commonPins.has(pin);
    return { isSequential, isReverseSeq, isRepeat, isCommon, weak: isSequential || isReverseSeq || isRepeat || isCommon };
  }, [pin]);

  return (
    <Panel>
      <ModuleHeader title="PIN-kod xavfsizligi" sub="LOKAL TEKSHIRUV" />
      <TextField label="4-6 xonali PIN" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="0000" />
      {weak && (
        <div style={{ display: 'flex', gap: 9, alignItems: 'center', marginTop: 8 }}>
          <StatusDot state={weak.weak ? 'bad' : 'good'} />
          <span style={{ fontSize: 12.5, fontFamily: "'Inter',sans-serif" }}>
            {weak.isCommon && "Bu eng ko'p ishlatiladigan PIN-kodlardan biri"}
            {!weak.isCommon && weak.isSequential && "Ketma-ket o'suvchi raqamlar (oson topiladi)"}
            {!weak.isCommon && weak.isReverseSeq && "Ketma-ket kamayuvchi raqamlar (oson topiladi)"}
            {!weak.isCommon && weak.isRepeat && 'Bir xil raqam takrorlanmoqda'}
            {!weak.weak && 'Aniq zaiflik naqshlari topilmadi'}
          </span>
        </div>
      )}
    </Panel>
  );
}

export default function SecuritySuite() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PasswordGeneratorCard />
      <PasswordStrengthCard />
      <PinCodeCard />
    </div>
  );
}
