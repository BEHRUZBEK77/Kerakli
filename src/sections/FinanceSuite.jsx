import React, { useState, useMemo } from 'react';
import { C, Mono, Panel, ModuleHeader, Row, BigStat, TextField, Slider, Bar, Grid2 } from '../ui.jsx';

/* ---------------- Loan / credit calculator ---------------- */

function calcLoan(principal, annualRatePct, months) {
  const r = (annualRatePct / 100) / 12;
  if (r === 0) {
    const payment = principal / months;
    return { monthly: payment, totalPaid: principal, totalInterest: 0 };
  }
  const monthly = principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const totalPaid = monthly * months;
  const totalInterest = totalPaid - principal;
  return { monthly, totalPaid, totalInterest };
}

function fmt(n) {
  if (!isFinite(n)) return '—';
  return n.toLocaleString('uz-UZ', { maximumFractionDigits: 0 });
}

function LoanCard() {
  const [principal, setPrincipal] = useState(50000000);
  const [rate, setRate] = useState(24);
  const [months, setMonths] = useState(24);

  const r = useMemo(() => calcLoan(principal, rate, months), [principal, rate, months]);

  return (
    <Panel>
      <ModuleHeader title="Kredit kalkulyatori" sub="OYLIK TO'LOV" />
      <TextField label="Kredit summasi (so'm)" type="number" value={principal} onChange={e => setPrincipal(+e.target.value || 0)} />
      <Slider label="Yillik foiz stavkasi" value={rate} onChange={e => setRate(+e.target.value)} min={0} max={60} step={0.5} suffix="%" />
      <Slider label="Muddat" value={months} onChange={e => setMonths(+e.target.value)} min={1} max={84} suffix=" oy" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 20, margin: '20px 0' }}>
        <BigStat label="Oylik to'lov" value={fmt(r.monthly)} unit="so'm" color={C.good} />
        <BigStat label="Jami to'lanadi" value={fmt(r.totalPaid)} unit="so'm" />
      </div>
      <Row label="Asosiy summa" value={`${fmt(principal)} so'm`} />
      <Row label="Jami foiz to'lovi" value={`${fmt(r.totalInterest)} so'm`} valueColor={C.warn} />
      <Row label="Foiz / asosiy summa nisbati" value={`${((r.totalInterest / principal) * 100).toFixed(1)}%`} />
    </Panel>
  );
}

/* ---------------- Compound interest / savings calculator ---------------- */

function calcCompound(principal, monthlyContribution, annualRatePct, years) {
  const r = (annualRatePct / 100) / 12;
  const months = years * 12;
  let balance = principal;
  const history = [];
  for (let m = 1; m <= months; m++) {
    balance = balance * (1 + r) + monthlyContribution;
    if (m % 12 === 0) history.push({ year: m / 12, balance });
  }
  const totalContributed = principal + monthlyContribution * months;
  return { finalBalance: balance, totalContributed, totalGrowth: balance - totalContributed, history };
}

function SavingsCard() {
  const [principal, setPrincipal] = useState(5000000);
  const [monthly, setMonthly] = useState(1000000);
  const [rate, setRate] = useState(18);
  const [years, setYears] = useState(5);

  const r = useMemo(() => calcCompound(principal, monthly, rate, years), [principal, monthly, rate, years]);

  return (
    <Panel>
      <ModuleHeader title="Jamg'arma / qo'shilgan foiz kalkulyatori" sub="" />
      <TextField label="Boshlang'ich summa (so'm)" type="number" value={principal} onChange={e => setPrincipal(+e.target.value || 0)} />
      <TextField label="Oylik qo'shimcha jamg'arma (so'm)" type="number" value={monthly} onChange={e => setMonthly(+e.target.value || 0)} />
      <Slider label="Yillik foiz stavkasi" value={rate} onChange={e => setRate(+e.target.value)} min={0} max={40} step={0.5} suffix="%" />
      <Slider label="Muddat" value={years} onChange={e => setYears(+e.target.value)} min={1} max={30} suffix=" yil" />

      <div style={{ margin: '20px 0' }}>
        <BigStat label="Yakuniy summa" value={fmt(r.finalBalance)} unit="so'm" color={C.good} />
      </div>
      <Row label="Jami kiritilgan mablag'" value={`${fmt(r.totalContributed)} so'm`} />
      <Row label="Foizlar hisobiga o'sish" value={`${fmt(r.totalGrowth)} so'm`} valueColor={C.good} />

      <div style={{ marginTop: 18 }}>
        <Mono style={{ fontSize: 10.5, color: C.muted, letterSpacing: '0.05em', display: 'block', marginBottom: 10 }}>YILLAR BO'YICHA O'SISH</Mono>
        {r.history.map(h => (
          <div key={h.year} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <Mono style={{ fontSize: 11, color: C.muted }}>{h.year}-yil</Mono>
              <Mono style={{ fontSize: 11.5, color: C.text }}>{fmt(h.balance)} so'm</Mono>
            </div>
            <Bar value={h.balance} max={r.finalBalance} color={C.good} />
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ---------------- Budget split (50/30/20) ---------------- */

function BudgetCard() {
  const [income, setIncome] = useState(8000000);

  const needs = income * 0.5;
  const wants = income * 0.3;
  const savings = income * 0.2;

  return (
    <Panel>
      <ModuleHeader title="Byudjet taqsimoti (50/30/20 qoidasi)" sub="" />
      <TextField label="Oylik daromad (so'm)" type="number" value={income} onChange={e => setIncome(+e.target.value || 0)} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18 }}>
        {[
          { label: 'Zaruriy ehtiyojlar (ijara, oziq-ovqat, kommunal)', pct: 50, val: needs, color: C.text },
          { label: 'Istaklar (ko\'ngilochar, kafe, xarid)', pct: 30, val: wants, color: C.mutedLight },
          { label: "Jamg'arma va qarzlarni to'lash", pct: 20, val: savings, color: C.good },
        ].map(row => (
          <div key={row.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 12, fontFamily: "'Inter',sans-serif", color: C.mutedLight }}>{row.label} · {row.pct}%</span>
              <Mono style={{ fontSize: 13, color: row.color }}>{fmt(row.val)} so'm</Mono>
            </div>
            <Bar value={row.pct} max={100} color={row.color} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, fontSize: 10.5, color: C.muted, fontFamily: "'Inter',sans-serif" }}>
        Bu — keng tarqalgan moliyaviy taqsimot qoidasi, real byudjetingiz shaxsiy ehtiyojlaringizga qarab farq qilishi mumkin. Bu moliyaviy maslahat emas.
      </div>
    </Panel>
  );
}

/* ---------------- Currency-free percentage / discount calculator ---------------- */

function DiscountCard() {
  const [price, setPrice] = useState(150000);
  const [discount, setDiscount] = useState(20);

  const saved = price * (discount / 100);
  const finalPrice = price - saved;

  return (
    <Panel>
      <ModuleHeader title="Chegirma kalkulyatori" sub="" />
      <TextField label="Asl narx (so'm)" type="number" value={price} onChange={e => setPrice(+e.target.value || 0)} />
      <Slider label="Chegirma foizi" value={discount} onChange={e => setDiscount(+e.target.value)} min={0} max={90} suffix="%" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 20, marginTop: 18 }}>
        <BigStat label="Yakuniy narx" value={fmt(finalPrice)} unit="so'm" color={C.good} />
        <BigStat label="Tejaldi" value={fmt(saved)} unit="so'm" />
      </div>
    </Panel>
  );
}

export default function FinanceSuite() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <LoanCard />
      <SavingsCard />
      <BudgetCard />
      <DiscountCard />
    </div>
  );
}
