# Serverga joylash (veb-sayt + backend, Docker)

Bitta domen, bitta buyruq:

```
Brauzer / Mobil ilova ──HTTPS──> web (Caddy, 80/443)
                                   ├─ /          → veb-sayt (statik fayllar)
                                   └─ /api/*     → backend (Spring Boot, ichki) → PostgreSQL (ichki)
```

- Faqat `web` konteyneri tashqariga ochiq (80/443). Baza va backend internetga chiqmaydi.
- Mobil ilova avvalgidek `https://shakhdict.duckdns.org/api` ga ulanadi, uni o'zgartirish shart emas.
- Veb-sayt API ga nisbiy `/api` manzil orqali murojaat qiladi (CORS muammosi yo'q).
- Admin panel shu saytning o'zida: `https://shakhdict.duckdns.org/admin`.

## 0. Oldindan kerak
- Ubuntu 22.04/24.04 server (kamida 1 vCPU, 2 GB RAM, 20 GB disk).
- Domenning **A yozuvi** server IP manziliga qaratilgan (DuckDNS'da IP ni yangilang).
- Firewall'da 22, 80, 443 (TCP) va 443 (UDP) ochiq.

Server allaqachon sozlangan bo'lsa (Docker o'rnatilgan), 3-bosqichga o'ting. Yangi server uchun Docker:
```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER      # keyin qayta kiring
sudo ufw allow OpenSSH && sudo ufw allow 80/tcp && sudo ufw allow 443 && sudo ufw enable
```

## 1. Eski stekni to'xtatish (agar oldin faqat backend ishlagan bo'lsa)
Eski `app-dictionary-server/docker-compose.prod.yml` bilan ishga tushirgan bo'lsangiz, **bazani o'chirmasdan** to'xtating (`-v` ishlatmang!):
```bash
cd ~/app/app-dictionary-server
docker compose -f docker-compose.prod.yml down
```
Baza ma'lumotlari `pgdata` volume'da saqlanib qoladi. Yangi stek ham shu nomdagi (`dictionary`) volume'dan foydalanadi, shuning uchun foydalanuvchilar va so'zlar yo'qolmaydi.

## 2. Kodni olish
```bash
git pull            # yoki: git clone git@github.com:ShakhAndijan/app-dictionary-client.git app
cd ~/app            # repozitoriyning ildizi (docker-compose.prod.yml shu yerda)
```

## 3. `.env` yaratish
```bash
cp .env.example .env
nano .env
```
To'ldiring:
- `DOMAIN` — domeningiz (standart: `shakhdict.duckdns.org`, shu bo'lsa o'zgartirmang).
- `POSTGRES_PASSWORD` — **eski stekdagi parol bilan bir xil bo'lsin** (baza eski bo'lsa). Yangi baza bo'lsa: `openssl rand -base64 24 | tr -d '/+='`
- `JWT_SECRET` — eski qiymat (foydalanuvchilar chiqib ketmasligi uchun) yoki yangi: `openssl rand -base64 48`
- `ADMIN_PASSWORD` — admin paroli (kuchli qiling). `ADMIN_USERNAME` va `ADMIN_EMAIL` ham shu yerda.

```bash
chmod 600 .env
```
Admin hisobi faqat **birinchi ishga tushishda** yaratiladi. Keyin `.env` dagi parolni o'zgartirsangiz, mavjud hisob o'zgarmaydi. Agar bazada `superadmin` nomli oddiy foydalanuvchi allaqachon bo'lsa, u admin qilinmaydi: `ADMIN_USERNAME` ga boshqa nom bering.

## 4. Ishga tushirish
```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f backend
```
Birinchi build 5–8 daqiqa oladi (Maven va npm yuklanadi). Caddy sertifikatni o'zi oladi.

Tekshirish:
```bash
curl -i https://shakhdict.duckdns.org/api/me          # 401 bo'lsa backend ishlayapti
curl -I https://shakhdict.duckdns.org/                # 200 — veb-sayt
curl -I https://shakhdict.duckdns.org/admin/users     # 200 (sahifa index.html ga qaytadi)
```
Keyin brauzerda saytga kirib, `superadmin` bilan admin panelni oching.

## 5. Yangilash
```bash
cd ~/app
git pull
docker compose -f docker-compose.prod.yml up -d --build            # hammasi
docker compose -f docker-compose.prod.yml up -d --build web        # faqat veb-sayt
docker compose -f docker-compose.prod.yml up -d --build backend    # faqat backend
docker image prune -f
```

## 6. Zaxira nusxa
```bash
docker exec dictionary-db pg_dump -U dictionary dictionary | gzip > ~/backup-$(date +%F).sql.gz
```
Tiklash:
```bash
gunzip -c backup.sql.gz | docker exec -i dictionary-db psql -U dictionary dictionary
```
Har kuni avtomatik zaxira uchun `app-dictionary-server/DEPLOY.md` dagi 8-bo'limga qarang.

## 7. Foydali buyruqlar
```bash
docker compose -f docker-compose.prod.yml logs -f --tail=100 backend
docker compose -f docker-compose.prod.yml logs -f --tail=100 web
docker compose -f docker-compose.prod.yml restart backend
docker compose -f docker-compose.prod.yml down        # to'xtatish (ma'lumot saqlanadi)
docker compose -f docker-compose.prod.yml down -v     # DIQQAT: bazani ham o'chiradi!
```

## Muammolar
| Belgi | Sabab / yechim |
|---|---|
| `set ADMIN_PASSWORD in .env` va shunga o'xshash xato | `.env` da shu qiymat yo'q (majburiy: `POSTGRES_PASSWORD`, `JWT_SECRET`, `ADMIN_PASSWORD`) |
| Sertifikat olinmayapti | DNS A yozuvi noto'g'ri yoki 80/443 yopiq: `docker logs dictionary-web` |
| 80/443 band | Eski `dictionary-caddy` konteyneri ishlayapti: 1-bosqichdagi `down` ni bajaring |
| `password authentication failed` | `POSTGRES_PASSWORD` baza yaratilgandagi parol bilan bir xil emas |
| Sayt ochiladi, lekin kirmaydi | `docker logs dictionary-backend` ni tekshiring; brauzer konsolida `/api/...` so'rovlarini ko'ring |
| Hamma foydalanuvchi chiqib ketdi | `JWT_SECRET` o'zgargan: eski qiymatni qaytaring |
