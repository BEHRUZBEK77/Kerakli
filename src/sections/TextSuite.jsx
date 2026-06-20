import React, { useState, useMemo } from 'react';
import { C, Mono, Panel, ModuleHeader, Row, BigStat, Select, Button, CopyButton, Grid2 } from '../ui.jsx';

/* ---------------- Word / char counter ---------------- */

function countText(text) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const sentences = (text.match(/[.!?]+(\s|$)/g) || []).length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length || (text.trim() ? 1 : 0);
  const readingMinutes = words / 200; // average reading speed
  const speakingMinutes = words / 130;
  return { words, chars, charsNoSpace, sentences, paragraphs, readingMinutes, speakingMinutes };
}

function WordCounterCard() {
  const [text, setText] = useState('');
  const stats = useMemo(() => countText(text), [text]);

  return (
    <Panel>
      <ModuleHeader title="So'z va belgi sanagich" sub="JONLI" />
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Matnni shu yerga joylashtiring yoki yozing…"
        style={{
          width: '100%', minHeight: 160, background: C.panelAlt, border: `1px solid ${C.border}`,
          color: C.text, padding: 12, fontSize: 13.5, fontFamily: "'Inter',sans-serif",
          resize: 'vertical', outline: 'none', marginBottom: 18, lineHeight: 1.6,
        }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 18, marginBottom: 16 }}>
        <BigStat label="So'zlar" value={stats.words} />
        <BigStat label="Belgilar" value={stats.chars} />
        <BigStat label="Bo'shliqsiz" value={stats.charsNoSpace} />
        <BigStat label="Gaplar" value={stats.sentences} />
      </div>
      <Row label="Paragraflar" value={stats.paragraphs} />
      <Row label="O'qish vaqti (taxminiy)" value={stats.readingMinutes < 1 ? '1 daqiqadan kam' : `~${Math.ceil(stats.readingMinutes)} daqiqa`} />
      <Row label="Ovoz chiqarib o'qish vaqti" value={stats.speakingMinutes < 1 ? '1 daqiqadan kam' : `~${Math.ceil(stats.speakingMinutes)} daqiqa`} />
    </Panel>
  );
}

/* ---------------- Case / format converter ---------------- */

function CaseConverterCard() {
  const [text, setText] = useState('');

  const transforms = {
    'UPPERCASE': t => t.toUpperCase(),
    'lowercase': t => t.toLowerCase(),
    'Title Case': t => t.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase()),
    'Sentence case': t => t.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()),
    'camelCase': t => t.trim().split(/\s+/).map((w, i) => i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()).join(''),
    'snake_case': t => t.trim().split(/\s+/).join('_').toLowerCase(),
    'kebab-case': t => t.trim().split(/\s+/).join('-').toLowerCase(),
    'aLtErNaTiNg': t => t.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join(''),
  };

  return (
    <Panel>
      <ModuleHeader title="Matn formatini o'zgartirish" sub={`${Object.keys(transforms).length} TUR`} />
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Matn kiriting…"
        style={{
          width: '100%', minHeight: 80, background: C.panelAlt, border: `1px solid ${C.border}`,
          color: C.text, padding: 12, fontSize: 13.5, fontFamily: "'Inter',sans-serif",
          resize: 'vertical', outline: 'none', marginBottom: 18,
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Object.entries(transforms).map(([name, fn]) => {
          const result = text ? fn(text) : '';
          return (
            <div key={name} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
              padding: '9px 12px', background: C.panelAlt, border: `1px solid ${C.borderLight}`,
            }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 9.5, color: C.muted, marginBottom: 3, fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.05em' }}>{name}</div>
                <Mono style={{ fontSize: 12.5, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{result || '—'}</Mono>
              </div>
              {result && <CopyButton text={result} label="⎘" />}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

/* ---------------- Base64 / URL encode-decode ---------------- */

function EncoderCard() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('base64-encode');

  const result = useMemo(() => {
    try {
      switch (mode) {
        case 'base64-encode': return btoa(unescape(encodeURIComponent(input)));
        case 'base64-decode': return decodeURIComponent(escape(atob(input)));
        case 'url-encode': return encodeURIComponent(input);
        case 'url-decode': return decodeURIComponent(input);
        default: return '';
      }
    } catch (e) {
      return "⚠ Noto'g'ri formatdagi kiritma";
    }
  }, [input, mode]);

  return (
    <Panel>
      <ModuleHeader title="Base64 / URL kodlash" sub="" />
      <Select
        label="Rejim"
        value={mode}
        onChange={e => setMode(e.target.value)}
        options={[
          { value: 'base64-encode', label: 'Base64 — Kodlash' },
          { value: 'base64-decode', label: 'Base64 — Dekodlash' },
          { value: 'url-encode', label: 'URL — Kodlash' },
          { value: 'url-decode', label: 'URL — Dekodlash' },
        ]}
      />
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Matn kiriting…"
        style={{
          width: '100%', minHeight: 80, background: C.panelAlt, border: `1px solid ${C.border}`,
          color: C.text, padding: 12, fontSize: 13, fontFamily: "'JetBrains Mono',monospace",
          resize: 'vertical', outline: 'none', marginBottom: 14,
        }}
      />
      <div style={{
        background: C.panelAlt, border: `1px solid ${C.borderLight}`, padding: 12, minHeight: 50,
        wordBreak: 'break-all', marginBottom: 12,
      }}>
        <Mono style={{ fontSize: 12.5, color: result.startsWith('⚠') ? C.warn : C.good }}>{result || '—'}</Mono>
      </div>
      {result && !result.startsWith('⚠') && <CopyButton text={result} />}
    </Panel>
  );
}

/* ---------------- Lorem ipsum / placeholder generator ---------------- */

const LOREM_WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat".split(' ');

function generateLorem(paragraphs, sentencesPerPara) {
  const out = [];
  for (let p = 0; p < paragraphs; p++) {
    const sentences = [];
    for (let s = 0; s < sentencesPerPara; s++) {
      const len = 6 + Math.floor(Math.random() * 10);
      const words = Array.from({ length: len }, () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
      words[0] = words[0][0].toUpperCase() + words[0].slice(1);
      sentences.push(words.join(' ') + '.');
    }
    out.push(sentences.join(' '));
  }
  return out.join('\n\n');
}

function LoremCard() {
  const [paragraphs, setParagraphs] = useState(3);
  const [text, setText] = useState(() => generateLorem(3, 5));

  const regenerate = (p = paragraphs) => setText(generateLorem(p, 5));

  return (
    <Panel>
      <ModuleHeader title="Lorem Ipsum generator" sub="" />
      <Select
        label="Paragraflar soni"
        value={paragraphs}
        onChange={e => { const v = +e.target.value; setParagraphs(v); regenerate(v); }}
        options={[1, 2, 3, 4, 5, 6].map(n => ({ value: n, label: `${n} ta paragraf` }))}
      />
      <div style={{
        background: C.panelAlt, border: `1px solid ${C.borderLight}`, padding: 14,
        whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.7, color: C.mutedLight,
        marginBottom: 14, maxHeight: 240, overflowY: 'auto', fontFamily: "'Inter',sans-serif",
      }}>
        {text}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button onClick={() => regenerate()}>↻ QAYTA YARATISH</Button>
        <CopyButton text={text} />
      </div>
    </Panel>
  );
}

export default function TextSuite() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <WordCounterCard />
      <CaseConverterCard />
      <EncoderCard />
      <LoremCard />
    </div>
  );
}
