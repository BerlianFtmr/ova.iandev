# 🚀 ova.iandev Deployment Guide - Manual VPS Deployment

**Tanggal:** 2026-08-24
**VPS:** 103.42.244.09
**User:** ian
**GitHub:** https://github.com/BerlianFtmr/ova.iandev.git

---

## 📋 Deployment Steps

### STEP 1: SSH ke VPS

```bash
ssh ian@103.42.244.09
```

Masukkan password/passkey saat diminta.

---

### STEP 2: Verifikasi Docker & Git

```bash
# Cek Docker
docker --version

# Cek Docker Compose
docker-compose --version

# Cek Git
git --version
```

**Jika belum ada Docker:**

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

**Jika belum ada Git:**

```bash
sudo apt update
sudo apt install -y git
```

**Logout & login lagi untuk apply docker group:**

```bash
exit
ssh ian@103.42.244.09
```

---

### STEP 3: Clone Repository

```bash
# Buat directory untuk web
sudo mkdir -p /var/www

# Clone repository
cd /var/www
sudo git clone https://github.com/BerlianFtmr/ova.iandev.git ova.iandev

# Setup ownership
sudo chown -R $USER:$USER /var/www/ova.iandev

# Masuk ke directory
cd /var/www/ova.iandev

# Cek files
ls -la
```

**Expected output:** README.md, Dockerfile, docker-compose.yml, dll

---

### STEP 4: Build Docker Image

```bash
cd /var/www/ova.iandev

# Build image
docker build -t ova.iandev:latest .

# Verify image
docker images | grep ova.iandev
```

**Expected output:** ova.iandev latest <image-id> <size>

---

### STEP 5: Test Container

```bash
# Run test container
docker run -d --name ova.iandev-test -p 8081:80 ova.iandev:latest

# Cek status
docker ps | grep ova.iandev-test

# Cek logs
docker logs ova.iandev-test

# Test dari dalam VPS
curl http://localhost:8081

# Test health endpoint
curl http://localhost:8081/health
```

**Expected output from health:** `healthy`

---

### STEP 6: Production Deployment

```bash
# Stop test container
docker stop ova.iandev-test
docker rm ova.iandev-test

# Deploy dengan docker-compose
cd /var/www/ova.iandev
docker-compose up -d

# Cek status
docker-compose ps

# Cek logs
docker-compose logs -f ova.iandev-app
```

**Tekan Ctrl+C untuk keluar dari logs**

---

### STEP 7: Verify Running Container

```bash
# Cek container running
docker ps | grep ova.iandev

# Cek container status
docker inspect ova.iandev-period-tracker | grep Status -A 5

# Test akses
curl http://localhost:8081
curl http://localhost:8081/health
```

---

### STEP 8: Test dari Browser (Optional)

Di komputer lokal kamu, buka browser:

```
http://103.42.244.09:8081
```

**Expected:** ova.iandev app muncul dengan fitur tracking

---

## ✅ Verification Checklist

Setelah deployment, verify:

- [ ] Container running: `docker ps | grep ova.iandev`
- [ ] Health endpoint returns "healthy": `curl http://localhost:8081/health`
- [ ] App accessible via browser: `http://103.42.244.09:8081`
- [ ] PWA features work (buka DevTools → Application tab)
- [ ] IndexedDB terbentuk
- [ ] Service Worker registered

---

## 🔧 Common Commands

### Cek Container Status

```bash
docker ps
docker-compose ps
```

### Cek Logs

```bash
docker logs -f ova.iandev-period-tracker
docker-compose logs -f ova.iandev-app
```

### Restart Container

```bash
docker restart ova.iandev-period-tracker
docker-compose restart
```

### Stop Container

```bash
docker stop ova.iandev-period-tracker
docker-compose down
```

### Start Container

```bash
docker start ova.iandev-period-tracker
docker-compose up -d
```

---

## 🔄 Update Deployment (Future)

Kalau ada update code:

```bash
# SSH ke VPS
ssh ian@103.42.244.09

# Pull latest code
cd /var/www/ova.iandev
git pull origin main

# Rebuild & restart
docker-compose down
docker-compose up -d --build

# Verify
docker ps | grep ova.iandev
docker logs -f ova.iandev-period-tracker
```

---

## 🌐 Cloudflare Zero Trust (Future Setup)

Kalau mau setup HTTPS dengan Cloudflare:

### 1. Install cloudflared

```bash
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

### 2. Login & Create Tunnel

```bash
cloudflared tunnel login
cloudflared tunnel create ova.iandev-production
```

### 3. Setup Config

```bash
nano ~/.cloudflared/config.yml
```

Content:

```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: /home/ian/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: period.yourdomain.com
    service: http://localhost:8081
  - service: http_status:404
```

### 4. Run as Service

```bash
cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

---

## 🆘 Troubleshooting

### Container tidak start

```bash
docker logs ova.iandev-period-tracker
docker exec ova.iandev-period-tracker nginx -t
```

### Port 8081 tidak accessible

```bash
# Cek firewall
sudo ufw status

# Allow port
sudo ufw allow 8081/tcp

# Cek listening port
netstat -tlnp | grep 8081
```

### Out of memory

```bash
# Cek memory
free -h

# Cek container resource
docker stats ova.iandev-period-tracker
```

---

## 📞 Deployment Summary

**Deployment Info:**

- VPS: 103.42.244.09
- User: ian
- Path: /var/www/ova.iandev
- Container: ova.iandev-period-tracker
- Image: ova.iandev:latest
- HTTP URL: http://103.42.244.09:8081

**Quick Commands:**

```bash
# SSH
ssh ian@103.42.244.09

# Cek status
cd /var/www/ova.iandev && docker-compose ps

# Cek logs
cd /var/www/ova.iandev && docker-compose logs -f

# Restart
cd /var/www/ova.iandev && docker-compose restart
```

---

**Status:** ✅ Ready for Deployment

**Next Steps:**

1. Follow STEP 1-8 di atas
2. Verify deployment
3. Test semua fitur
4. (Optional) Setup Cloudflare Zero Trust untuk HTTPS

---

Happy Deployment! 🚀
