# App Dictionary

Kunlik ingliz tili so'z boyligini oshirish uchun mobil ilova. Foydalanuvchi har kuni yodlagan so'zlarini (inglizcha, o'zbekcha tarjima, definition) kiritadi va keyinchalik "Baholash" bo'limida shu so'zlar bo'yicha o'zini sinab ko'radi.

## Bo'limlar (pastki menu)

- **Baholash** — "Barcha so'zlar" yoki "Bugungi so'zlar" bilan sessiya boshlanadi (`/quiz/*` orqali, backend boshqaradi). So'zlar soni 20 tadan kam/teng bo'lsa sessiya tugagach natija chiqadi; 20 tadan ko'p bo'lsa "Tugatish" tugmasi bosilguncha davom etadi. Savol inglizcha/o'zbekcha/definition ko'rinishida chiqishi mumkin, lekin javob har doim faqat inglizcha yoki o'zbekcha so'z bo'lishi kerak (definition hech qachon javob sifatida so'ralmaydi).
- **So'zlar** — yangi so'z qo'shish (inglizcha, o'zbekcha, definition) va qo'shilgan so'zlarning alifbo tartibidagi ro'yxati (harf bo'yicha guruhlangan, yon tomonda tezkor A-Z indeks).
- **Profil** — profil ma'lumotlarini tahrirlash, parolni almashtirish, kunlik/oylik statistika.

## Ishga tushirish

```bash
npm install
npm start
```

So'ng terminaldagi QR kodni Expo Go ilovasi bilan skanerlang, yoki `npm run android` / `npm run ios` / `npm run web` buyruqlaridan birini ishlating.

## Backend bilan bog'lash (MUHIM)

Ilova o'zining backendi yo'q — mavjud REST API'ga ulanadi. API manzilini shu yerda sozlang:

**`src/config/env.ts`**
```ts
export const API_BASE_URL = 'https://your-api.example.com/api';
```

> Android emulyatorida lokal backendga ulanish uchun `localhost` o'rniga `10.0.2.2` ishlating. Haqiqiy qurilmada kompyuteringizning lokal tarmoq IP manzilidan foydalaning.

### Kutilayotgan API kontrakti

Frontend quyidagi standart REST endpointlarni kutadi. Agar sizning backendingizda yo'llar boshqacha bo'lsa, `src/api/*.ts` fayllaridagi yo'llarni moslang.

| Endpoint | Method | Body | Response |
|---|---|---|---|
| `/auth/register` | POST | `{ name, email, password }` | `{ token, user }` |
| `/auth/login` | POST | `{ email, password }` | `{ token, user }` |
| `/auth/me` | GET | — | `User` |
| `/profile` | PUT | `{ name?, email? }` | `User` |
| `/profile/password` | PUT | `{ oldPassword, newPassword }` | — |
| `/words` | GET | — | `Word[]` |
| `/words` | POST | `{ english, uzbek, definition }` | `Word` |
| `/words/:id` | PUT | `{ english?, uzbek?, definition? }` | `Word` |
| `/words/:id` | DELETE | — | — |
| `/quiz/start` | POST | `{ mode: 'ALL' \| 'TODAY' }` | `QuizQuestion` (sessionId, promptType, promptText, progress) |
| `/quiz/:sessionId/answer` | POST | `{ answer }` | `QuizAnswerResult` (correct, correctAnswer, progress, next question) |
| `/quiz/:sessionId/finish` | POST | — | `QuizSummary` (correctCount, incorrectCount, ...) |
| `/stats/daily` | GET | — | `DailyStats[]` |
| `/stats/monthly` | GET | — | `MonthlyStats[]` |

Barcha himoyalangan so'rovlar `Authorization: Bearer <token>` headerini avtomatik oladi (`src/api/client.ts`). Token `expo-secure-store` orqali qurilmada xavfsiz saqlanadi. `401` javobida foydalanuvchi avtomatik chiqariladi.

Turlar (`User`, `Word`, `QuizPromptType`, `DailyStats`, `MonthlyStats`) `src/types/index.ts` faylida; quiz endpointlarining shakllari `src/api/quizApi.ts` faylida.

Baholash sessiyasini backend to'liq boshqaradi: qaysi so'z, qaysi promptType (`'english'` / `'uzbek'` / definition mavjud bo'lsa `'definition'`) va kutilayotgan javob tili (inglizcha yoki o'zbekcha, definition uchun tasodifiy tanlanadi) — barchasi serverda hal qilinadi. Frontend faqat `promptText`ni ko'rsatib, javobni yuboradi.

## Loyiha tuzilishi

```
src/
  api/         axios client + endpoint funksiyalari
  components/  qayta ishlatiladigan UI (Button, Input, Card, ScreenContainer)
  config/      API_BASE_URL sozlamasi
  context/     AuthContext (login/register/logout/token)
  navigation/  Auth stack, Bottom tabs, Profile stack
  screens/     auth/, words/, quiz/, profile/
  theme/       ranglar palitrasi
  types/       umumiy TypeScript turlari
```
