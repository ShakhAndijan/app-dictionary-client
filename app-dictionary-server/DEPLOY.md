# Deploy qo'llanmasi (Ubuntu server + Docker)

Arxitektura:

```
Mobil ilova ──HTTPS──> Caddy (80/443) ──> Spring Boot backend (8080, ichki) ──> PostgreSQL (ichki)
```

Faqat Caddy tashqariga ochiq. Baza va backend portlari internetga chiqmaydi.

## 0. Oldindan kerak
- Ubuntu 22.04/24.04 server (minimal: 1 vCPU, 2 GB RAM, 20 GB disk).
- Domen (masalan `shakhdict.duckdns.org`) va uning **A yozuvi** server IP manziliga qaratilgan bo'lishi kerak.
- Provayder firewall'ida 22, 80, 443 (TCP) va 443 (UDP) ochiq.

## 1. Serverga ulanish va tayyorlash
```bash
ssh root@SERVER_IP
adduser deploy && usermod -aG sudo deploy      # alohida foydalanuvchi
rsync -a ~/.ssh /home/deploy/ && chown -R deploy:deploy /home/deploy/.ssh
su - deploy
```

Firewall:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443
sudo ufw enable
```

## 2. Docker o'rnatish
```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
exit   # qayta kirib (ssh deploy@SERVER_IP), keyin tekshiring:
docker compose version
```

## 3. Kodni serverga olish
Git orqali:
```bash
git clone <REPO_URL> app && cd app/app-dictionary-server
```
yoki kompyuteringizdan:
```bash
scp -r app-dictionary-server deploy@SERVER_IP:~/dictionary
```

## 4. `.env` yaratish
```bash
cp .env.example .env
nano .env
```
To'ldiring:
- `DOMAIN` — domeningiz.
- `POSTGRES_PASSWORD` — `openssl rand -base64 24 | tr -d '/+='`
- `JWT_SECRET` — `openssl rand -base64 48`

```bash
chmod 600 .env
```
`.env` ni hech qachon gitga qo'shmang. `JWT_SECRET` ni almashtirsangiz, barcha foydalanuvchilar qayta kiradi.

## 5. Ishga tushirish
```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f backend
```
Birinchi build 3–5 daqiqa oladi. Caddy sertifikatni o'zi oladi (DNS to'g'ri bo'lsa).

Tekshirish:
```bash
curl -i https://shakhdict.duckdns.org/api/me      # 401 qaytsa — server ishlayapti
```

## 6. Mobil ilovani ulash
`app-dictionary-client/eas.json` ichida `preview` va `production` profillaridagi
`EXPO_PUBLIC_API_URL` ni almashtiring:
```
"EXPO_PUBLIC_API_URL": "https://shakhdict.duckdns.org/api"
```
Keyin:
```bash
cd app-dictionary-client
eas login
eas build -p android --profile preview      # sinov APK
eas build -p android --profile production   # Play Store (AAB)
```
Mahalliy ishlab chiqish uchun `.env` dagi LAN manzil o'zgarishsiz qoladi.

## 7. Yangilash (yangi versiya chiqarish)
```bash
cd ~/app/app-dictionary-server
git pull
docker compose -f docker-compose.prod.yml up -d --build backend
docker image prune -f
```

## 8. Zaxira nusxa (backup)
Qo'lda:
```bash
docker exec dictionary-db pg_dump -U dictionary dictionary | gzip > ~/backup-$(date +%F).sql.gz
```
Har kuni avtomatik (`crontab -e`):
```
0 3 * * * docker exec dictionary-db pg_dump -U dictionary dictionary | gzip > /home/deploy/backups/db-$(date +\%F).sql.gz && find /home/deploy/backups -mtime +14 -delete
```
(`mkdir -p ~/backups` ni oldindan bajaring; zaxirani boshqa joyga ham nusxalang.)

Tiklash:
```bash
gunzip -c backup.sql.gz | docker exec -i dictionary-db psql -U dictionary dictionary
```

## 9. Foydali buyruqlar
```bash
docker compose -f docker-compose.prod.yml logs -f --tail=100 backend
docker compose -f docker-compose.prod.yml restart backend
docker compose -f docker-compose.prod.yml down          # to'xtatish (ma'lumot saqlanadi)
docker compose -f docker-compose.prod.yml down -v       # DIQQAT: bazani ham o'chiradi!
docker stats
```

## 10. Muammolar
| Belgi | Sabab / yechim |
|---|---|
| Caddy sertifikat ololmayapti | DNS A yozuvi noto'g'ri yoki 80/443 yopiq. `docker logs dictionary-caddy` |
| Backend ishga tushmaydi, `Could not resolve placeholder` | `.env` da qiymat yo'q (`JWT_SECRET`, `POSTGRES_*`) |
| `password authentication failed` | `POSTGRES_PASSWORD` baza yaratilgandan keyin o'zgartirilgan. Volume'ni qayta yarating (`down -v`) yoki parolni `ALTER USER` bilan o'zgartiring |
| Ilova ulanmayapti | `EXPO_PUBLIC_API_URL` `https://.../api` ekanini va ilova shu qiymat bilan qayta build qilinganini tekshiring |
| Xotira yetmayapti (OOM) | `.env` ga `JAVA_TOOL_OPTIONS=-Xmx512m` qo'shing yoki swap yoqing |

## Xavfsizlik eslatmalari
- Prod profilida Swagger o'chirilgan, SQL log yo'q, `ddl-auto=update` (jadvallar o'chirilmaydi).
- SSH uchun parol o'rniga kalit ishlating (`PasswordAuthentication no`), `fail2ban` o'rnating.
- Muntazam yangilang: `sudo apt update && sudo apt upgrade`.
- Ma'lumotlar sxemasi jiddiy o'zgarsa, `ddl-auto=update` o'rniga Flyway/Liquibase ga o'tish tavsiya etiladi.
