# KERAKLI.SYS

Kunlik kerak bo'ladigan 35+ vositadan iborat, 8 bo'limli to'plam: Xavfsizlik, Matn, Moliya, Sog'liq, Sana/vaqt, O'lchov konvertorlari, Random/QR/Ranglar, O'quv/Matematik.
Asosiy qism lokal brauzerda ishlaydi — hech qanday ma'lumot serverga yuborilmaydi. Valyuta kursi va QR kod kabi bir nechta vosita internet orqali tashqi servisdan foydalanadi (internet bo'lmasa, valyuta avtomatik lokal taxminiy kursga o'tadi).

## Ishga tushirish

```bash
npm i
npm run dev
```

Keyin terminalda ko'rsatilgan manzilni (odatda `http://localhost:5173`) brauzerda oching.

## Build qilish (production uchun)

```bash
npm run build
npm run preview
```

## Tarkib

- **MOD.01 — Xavfsizlik** (3): parol generatori, parol kuchini tekshirish, PIN-kod tahlili
- **MOD.02 — Matn vositalari** (4): so'z sanagich, format almashtirish, Base64/URL kodlash, lorem ipsum
- **MOD.03 — Moliya** (4): kredit, jamg'arma, byudjet (50/30/20), chegirma kalkulyatorlari
- **MOD.04 — Sog'liq** (4): BMI, kunlik kaloriya (TDEE), suv ehtiyoji, uyqu sikli
- **MOD.05 — Sana va vaqt** (8): yosh hisoblash, kunlar farqi, sanaga qo'shish/ayirish, sana ma'lumoti, Unix timestamp, dunyo soat zonalari, sana formatlash, taymer
- **MOD.06 — O'lchov konvertorlari** (10): valyuta (jonli kurs + lokal zaxira), harorat, uzunlik, og'irlik, maydon, hajm, tezlik, ma'lumot hajmi, bosim, vaqt birliklari
- **MOD.07 — Random, QR va ranglar** (9): zar, tanga, tasodifiy son, ro'yxatdan tanlash, QR kod (API), rang palitra generatori, rang formatlari (HEX/RGB/HSL), tasodifiy shaxs generatori, promo kod generatori
- **MOD.08 — O'quv va matematika** (8): foiz kalkulyatori, GPA, kvadrat tenglama yechuvchi, statistika kalkulyatori, FQEK/EKUK, tub son tekshirish, son tizimlari konvertori, daraja/ildiz kalkulyatori

## Texnologiya

React 18 + Vite. Tashqi UI kutubxonasi ishlatilmagan — barcha komponentlar `src/ui.jsx` da qo'lda yozilgan.

Tashqi API'lar:
- Valyuta kursi: `open.er-api.com` (bepul, kalit talab qilmaydi). Ishlamasa, lokal taxminiy kurslarga avtomatik o'tadi.
- QR kod: `api.qrserver.com` (bepul, kalit talab qilmaydi).
