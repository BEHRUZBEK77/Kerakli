import React, { useState } from 'react';
import { C, Mono } from './ui.jsx';
import SecuritySuite from './sections/SecuritySuite.jsx';
import TextSuite from './sections/TextSuite.jsx';
import FinanceSuite from './sections/FinanceSuite.jsx';
import HealthSuite from './sections/HealthSuite.jsx';
import DateTimeSuite from './sections/DateTimeSuite.jsx';
import ConverterSuite from './sections/ConverterSuite.jsx';
import RandomSuite from './sections/RandomSuite.jsx';
import EduMathSuite from './sections/EduMathSuite.jsx';

const SECTIONS = [
  {
    id: 'security',
    index: '01',
    title: 'Xavfsizlik',
    desc: 'Parol generatori, parol kuchini tekshirish, PIN-kod tahlili',
    count: 3,
    Comp: SecuritySuite,
  },
  {
    id: 'text',
    index: '02',
    title: 'Matn vositalari',
    desc: "So'z sanagich, format almashtirish, kodlash, lorem ipsum",
    count: 4,
    Comp: TextSuite,
  },
  {
    id: 'finance',
    index: '03',
    title: 'Moliya',
    desc: "Kredit, jamg'arma, byudjet va chegirma kalkulyatorlari",
    count: 4,
    Comp: FinanceSuite,
  },
  {
    id: 'health',
    index: '04',
    title: "Sog'liq",
    desc: 'BMI, kaloriya, suv ehtiyoji, uyqu siklini hisoblash',
    count: 4,
    Comp: HealthSuite,
  },
  {
    id: 'datetime',
    index: '05',
    title: 'Sana va vaqt',
    desc: "Yosh hisoblash, kunlar farqi, taqvim, soat zonalari, taymer",
    count: 8,
    Comp: DateTimeSuite,
  },
  {
    id: 'converter',
    index: '06',
    title: "O'lchov konvertorlari",
    desc: "Valyuta (jonli kurs), uzunlik, og'irlik, harorat, hajm va boshqalar",
    count: 10,
    Comp: ConverterSuite,
  },
  {
    id: 'random',
    index: '07',
    title: "Random, QR va ranglar",
    desc: "Qur'a, zar, QR kod, rang palitra, tasodifiy generatorlar",
    count: 9,
    Comp: RandomSuite,
  },
  {
    id: 'edumath',
    index: '08',
    title: "O'quv va matematika",
    desc: "Foiz, GPA, tenglamalar, statistika, son tizimlari",
    count: 8,
    Comp: EduMathSuite,
  },
];

function Header({ onHome, activeTitle }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      padding: '36px 0 28px', borderBottom: `1px solid ${C.border}`, marginBottom: 36, flexWrap: 'wrap', gap: 16,
    }}>
      <div onClick={onHome} style={{ cursor: 'pointer' }}>
        <Mono style={{ fontSize: 11, color: C.good, letterSpacing: '0.15em' }}>● TIZIM FAOL</Mono>
        <h1 style={{
          margin: '8px 0 0', fontSize: 'clamp(26px, 5vw, 40px)', fontWeight: 700,
          letterSpacing: '-0.02em', fontFamily: "'Inter',system-ui,sans-serif", lineHeight: 1,
        }}>
          KERAKLI<span style={{ color: C.muted }}>.SYS</span>
        </h1>
        <Mono style={{ fontSize: 12, color: C.muted, marginTop: 8, display: 'block' }}>
          {activeTitle || "Kunlik kerak bo'ladigan vositalar to'plami"}
        </Mono>
      </div>
    </div>
  );
}

function SectionCard({ section, onOpen }) {
  return (
    <button
      onClick={() => onOpen(section.id)}
      style={{
        textAlign: 'left', background: C.panel, border: `1px solid ${C.border}`,
        padding: '26px 24px', cursor: 'pointer', color: C.text, fontFamily: 'inherit',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        minHeight: 180, transition: 'border-color 0.15s, transform 0.15s',
        position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.text; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Mono style={{ fontSize: 12, color: C.muted, letterSpacing: '0.08em' }}>MOD.{section.index}</Mono>
        <Mono style={{ fontSize: 10.5, color: C.muted, border: `1px solid ${C.border}`, padding: '3px 8px' }}>{section.count} ASBOB</Mono>
      </div>
      <div>
        <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>{section.title}</h2>
        <p style={{ margin: 0, fontSize: 12.5, color: C.mutedLight, lineHeight: 1.6, fontFamily: "'Inter',sans-serif" }}>{section.desc}</p>
      </div>
      <Mono style={{ fontSize: 11, color: C.muted, marginTop: 14 }}>OCHISH →</Mono>
    </button>
  );
}

function HomeView({ onOpen }) {
  const totalTools = SECTIONS.reduce((a, s) => a + s.count, 0);
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18, flexWrap: 'wrap', gap: 8 }}>
        <Mono style={{ fontSize: 11, color: C.muted, letterSpacing: '0.05em' }}>{SECTIONS.length} BO'LIM</Mono>
        <Mono style={{ fontSize: 11, color: C.muted, letterSpacing: '0.05em' }}>{totalTools}+ VOSITA</Mono>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 18 }}>
        {SECTIONS.map(s => <SectionCard key={s.id} section={s} onOpen={onOpen} />)}
      </div>
    </>
  );
}

export default function App() {
  const [activeId, setActiveId] = useState(null);
  const active = SECTIONS.find(s => s.id === activeId);

  return (
    <div style={{
      background: C.bg, color: C.text, minHeight: '100vh',
      fontFamily: "'Inter',system-ui,sans-serif", padding: '0 24px 80px',
    }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <Header onHome={() => setActiveId(null)} activeTitle={active ? `MOD.${active.index} — ${active.title}` : null} />

        {!active && <HomeView onOpen={setActiveId} />}

        {active && (
          <>
            <button onClick={() => setActiveId(null)} style={{
              background: 'transparent', border: `1px solid ${C.border}`, color: C.mutedLight,
              fontSize: 11, padding: '7px 14px', cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace",
              marginBottom: 24, letterSpacing: '0.04em',
            }}>← BARCHA BO'LIMLAR</button>
            <active.Comp />
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: 56, paddingTop: 24, borderTop: `1px solid ${C.borderLight}` }}>
          <Mono style={{ fontSize: 10.5, color: C.muted }}>
            Barcha hisob-kitoblar brauzeringizda lokal amalga oshiriladi. Hech qanday ma'lumot serverga yuborilmaydi.
            <br />Valyuta kursi va QR kod kabi ayrim vositalar internet orqali tashqi servisdan foydalanadi.
          </Mono>
        </div>
      </div>
    </div>
  );
}
