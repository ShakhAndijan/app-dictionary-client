// API manzili build paytida EXPO_PUBLIC_API_URL orqali beriladi (eas.json ichidagi "env" yoki .env fayl).
// Lokal ishlatishda: .env faylga  EXPO_PUBLIC_API_URL=http://<kompyuter-IP>:8080/api  yozing.
// Android emulyatorida "localhost" o'rniga 10.0.2.2 dan foydalaning.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/api';
