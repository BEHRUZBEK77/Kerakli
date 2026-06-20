import React, { useState, useMemo } from 'react';
import { C, Mono, Panel, ModuleHeader, Row, BigStat, TextField, Slider, Select, Bar, StatusDot } from '../ui.jsx';

/* ---------------- BMI calculator ---------------- */

function bmiCategory(bmi) {
  if (bmi < 18.5) return { label: 'Vazn yetishmovchiligi', color: C.warn };
  if (bmi < 25) return { label: 'Normal vazn', color: C.good };
  if (bmi < 30) return { label: 'Ortiqcha vazn', color: C.warn };
  return { label: 'Semizlik', color: C.bad };
}

function BmiCard() {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);

  const bmi = useMemo(() => weight / Math.pow(height / 100, 2), [height, weight]);
  const cat = bmiCategory(bmi);
  const idealMin = (18.5 * Math.pow(height / 100, 2)).toFixed(1);
  const idealMax = (24.9 * Math.pow(height / 100, 2)).toFixed(1);

  return (
    <Panel>
      <ModuleHeader title="Tana massasi indeksi (BMI)" sub="" />
      <TextField label="Bo'y (sm)" type="number" value={height} onChange={e => setHeight(+e.target.value || 0)} />
      <TextField label="Vazn (kg)" type="number" value={weight} onChange={e => setWeight(+e.target.value || 0)} />

      <div style={{ margin: '20px 0' }}>
        <BigStat label="BMI ko'rsatkichi" value={bmi.toFixed(1)} color={cat.color} />
        <Mono style={{ fontSize: 13, color: cat.color, marginTop: 6, display: 'block' }}>{cat.label}</Mono>
      </div>

      <Bar value={Math.min(bmi, 40)} max={40} color={cat.color} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, marginBottom: 16 }}>
        <Mono style={{ fontSize: 9.5, color: C.muted }}>0</Mono>
        <Mono style={{ fontSize: 9.5, color: C.muted }}>18.5</Mono>
        <Mono style={{ fontSize: 9.5, color: C.muted }}>25</Mono>
        <Mono style={{ fontSize: 9.5, color: C.muted }}>30</Mono>
        <Mono style={{ fontSize: 9.5, color: C.muted }}>40</Mono>
      </div>

      <Row label="Normal vazn oralig'i" value={`${idealMin} – ${idealMax} kg`} />
      <div style={{ marginTop: 14, fontSize: 10.5, color: C.muted, fontFamily: "'Inter',sans-serif" }}>
        BMI — umumiy ko'rsatkich, mushak massasi yoki tana tuzilishini hisobga olmaydi. Aniq tashxis uchun shifokorga murojaat qiling.
      </div>
    </Panel>
  );
}

/* ---------------- Calorie / TDEE calculator ---------------- */

function CalorieCard() {
  const [sex, setSex] = useState('male');
  const [age, setAge] = useState(28);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [activity, setActivity] = useState(1.375);
  const [goal, setGoal] = useState('maintain');

  const bmr = useMemo(() => {
    // Mifflin-St Jeor
    const base = 10 * weight + 6.25 * height - 5 * age;
    return sex === 'male' ? base + 5 : base - 161;
  }, [sex, age, height, weight]);

  const tdee = bmr * activity;
  const goalCalories = goal === 'lose' ? tdee - 500 : goal === 'gain' ? tdee + 500 : tdee;

  return (
    <Panel>
      <ModuleHeader title="Kunlik kaloriya ehtiyoji (TDEE)" sub="" />
      <Select label="Jins" value={sex} onChange={e => setSex(e.target.value)} options={[
        { value: 'male', label: 'Erkak' }, { value: 'female', label: 'Ayol' },
      ]} />
      <TextField label="Yosh" type="number" value={age} onChange={e => setAge(+e.target.value || 0)} />
      <TextField label="Bo'y (sm)" type="number" value={height} onChange={e => setHeight(+e.target.value || 0)} />
      <TextField label="Vazn (kg)" type="number" value={weight} onChange={e => setWeight(+e.target.value || 0)} />
      <Select label="Faollik darajasi" value={activity} onChange={e => setActivity(+e.target.value)} options={[
        { value: 1.2, label: "Harakatsiz (deyarli sport yo'q)" },
        { value: 1.375, label: "Yengil faol (haftada 1-3 mashq)" },
        { value: 1.55, label: "O'rtacha faol (haftada 3-5 mashq)" },
        { value: 1.725, label: 'Juda faol (haftada 6-7 mashq)' },
        { value: 1.9, label: "Ekstremal faol (jismoniy mehnat + sport)" },
      ]} />
      <Select label="Maqsad" value={goal} onChange={e => setGoal(e.target.value)} options={[
        { value: 'lose', label: 'Vazn kamaytirish' },
        { value: 'maintain', label: 'Vaznni saqlash' },
        { value: 'gain', label: 'Vazn oshirish' },
      ]} />

      <div style={{ margin: '20px 0' }}>
        <BigStat label="Tavsiya etilgan kunlik kaloriya" value={Math.round(goalCalories)} unit="kcal" color={C.good} />
      </div>
      <Row label="Bazal metabolizm (BMR)" value={`${Math.round(bmr)} kcal`} />
      <Row label="Umumiy kunlik sarf (TDEE)" value={`${Math.round(tdee)} kcal`} />

      <div style={{ marginTop: 14, fontSize: 10.5, color: C.muted, fontFamily: "'Inter',sans-serif" }}>
        Mifflin-St Jeor formulasi asosida hisoblangan taxminiy qiymat. Shaxsiy tavsiya uchun dietolog bilan maslahatlashing.
      </div>
    </Panel>
  );
}

/* ---------------- Water intake calculator ---------------- */

function WaterCard() {
  const [weight, setWeight] = useState(70);
  const [activityMin, setActivityMin] = useState(30);

  const baseLiters = weight * 0.033;
  const activityLiters = (activityMin / 30) * 0.35;
  const total = baseLiters + activityLiters;

  return (
    <Panel>
      <ModuleHeader title="Kunlik suv ehtiyoji" sub="" />
      <TextField label="Vazn (kg)" type="number" value={weight} onChange={e => setWeight(+e.target.value || 0)} />
      <Slider label="Kunlik jismoniy faollik" value={activityMin} onChange={e => setActivityMin(+e.target.value)} min={0} max={180} step={10} suffix=" daqiqa" />

      <div style={{ margin: '20px 0' }}>
        <BigStat label="Tavsiya etilgan suv" value={total.toFixed(1)} unit="litr/kun" color={C.good} />
      </div>
      <Row label="Tana vazniga asoslangan" value={`${baseLiters.toFixed(1)} litr`} />
      <Row label="Faollik uchun qo'shimcha" value={`${activityLiters.toFixed(1)} litr`} />
      <Row label="Taxminan stakanlar soni (250ml)" value={`${Math.round((total * 1000) / 250)} stakan`} />
    </Panel>
  );
}

/* ---------------- Sleep cycle calculator ---------------- */

function SleepCard() {
  const [wakeTime, setWakeTime] = useState('07:00');
  const cycleMin = 90;
  const fallAsleepMin = 14;

  const bedtimes = useMemo(() => {
    const [h, m] = wakeTime.split(':').map(Number);
    const wake = new Date();
    wake.setHours(h, m, 0, 0);
    const options = [];
    for (let cycles = 6; cycles >= 3; cycles--) {
      const bedtime = new Date(wake.getTime() - (cycles * cycleMin + fallAsleepMin) * 60000);
      options.push({ cycles, time: bedtime.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }), hours: (cycles * cycleMin / 60).toFixed(1) });
    }
    return options;
  }, [wakeTime]);

  return (
    <Panel>
      <ModuleHeader title="Uyqu siklini hisoblash" sub="" />
      <TextField label="Uyg'onish vaqti" type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} />
      <Mono style={{ fontSize: 10.5, color: C.muted, display: 'block', margin: '14px 0 12px' }}>
        Quyidagi vaqtlardan birida uxlasangiz, to'liq uyqu siklini tugatib uyg'onasiz (har bir sikl ~90 daqiqa):
      </Mono>
      {bedtimes.map(b => (
        <div key={b.cycles} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: `1px solid ${C.borderLight}` }}>
          <Mono style={{ fontSize: 15, color: C.text }}>{b.time}</Mono>
          <span style={{ fontSize: 12, color: C.muted, fontFamily: "'Inter',sans-serif" }}>{b.cycles} sikl · {b.hours} soat</span>
        </div>
      ))}
    </Panel>
  );
}

export default function HealthSuite() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <BmiCard />
      <CalorieCard />
      <WaterCard />
      <SleepCard />
    </div>
  );
}
