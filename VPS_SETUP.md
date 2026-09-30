# 🚀 VPS Setup Guide - ova.iandev Deployment

**Panduan lengkap setup VPS dari nol untuk deploy ova.iandev container**

## 📋 Prerequisites

- VPS dengan minimal **512MB RAM, 1 CPU Core** (rekomendasi: 1GB RAM)
- SSH access ke VPS
- Domain yang sudah pointing ke Cloudflare (opsional, untuk SSL)
- Basic knowledge Linux command line

---

## 🔧 Step 1: Initial VPS Setup

### 1.1 Update System

```bash
# SSH ke VPS
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Install basic tools
apt install -y curl wget git nano ufw
```

### 1.2 Setup Firewall

```bash
# Allow SSH
ufw allow 22/tcp

# Allow HTTP & HTTPS (untuk Cloudflare tunnel)
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Cek status
ufw status
```

### 1.3 Create Non-Root User (Optional tapi Recommended)

```bash
# Create user
adduser ova.iandev
usermod -aG sudo ova.iandev

# Switch ke user baru
su - ova.iandev
```

---

## 🐳 Step 2: Install Docker

### 2.1 Install Docker

```bash
# Download & install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Add user ke docker group (untuk run tanpa sudo)
sudo usermod -aG docker $USER

# Logout & login again untuk apply group changes
exit
ssh ova.iandev@your-vps-ip  # atau root@your-vps-ip
```

### 2.2 Verify Docker Installation

```bash
# Cek docker version
docker --version

# Run test container
docker run hello-world

# Cek docker groups
groups
```

### 2.3 Install Docker Compose (Optional)

```bash
# Download docker-compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker-compose --version
```

---

## 📁 Step 3: Clone Repository

### 3.1 Install Git (jika belum)

```bash
sudo apt install -y git
```

### 3.2 Clone Repository

```bash
# Create directory
sudo mkdir -p /var/www
cd /var/www

# Clone repository (ganti dengan repo URL Anda)
sudo git clone https://github.com/YOUR_USERNAME/period-tracker.git ova.iandev

# Setup ownership
sudo chown -R $USER:$USER /var/www/ova.iandev
cd /var/www/ova.iandev

# Cek files
ls -la
```

---

## 🏗️ Step 4: Build & Run Container

### 4.1 Build Docker Image

```bash
cd /var/www/ova.iandev

# Build image
docker build -t ova.iandev:latest .

# Verify image
docker images | grep ova.iandev
```

### 4.2 Test Run Container

```bash
# Run container
docker run -d --name ova.iandev-test -p 8081:80 ova.iandev:latest

# Cek status
docker ps | grep ova.iandev-test

# Cek logs
docker logs ova.iandev-test

# Test dari dalam VPS
curl http://localhost:8081

# Test dari eksternal (buka browser)
# http://your-vps-ip:8081
```

### 4.3 Stop Test Container

```bash
# Stop
docker stop ova.iandev-test

# Remove
docker rm ova.iandev-test
```

---

## 🚢 Step 5: Production Deployment

### 5.1 Deploy dengan Docker Compose

```bash
cd /var/www/ova.iandev

# Start production container
docker-compose up -d

# Cek status
docker-compose ps

# Cek logs
docker-compose logs -f ova.iandev-app

# Verify container running
docker ps | grep ova.iandev
```

### 5.2 Setup Auto-Start

```bash
# Container sudah auto-start (dari docker-compose.yml)
# Cek restart policy
docker inspect ova.iandev-period-tracker | grep RestartPolicy -A 2

# Test reboot VPS
sudo reboot

# Setelah reboot, cek apakah container auto-start
docker ps
```

---

## ☁️ Step 6: Cloudflare Zero Trust Setup

### 6.1 Create Tunnel di Cloudflare Dashboard

1. Login ke [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate ke **Access → Tunnels**
3. Click **Create Tunnel**
4. Name: `ova.iandev-production`
5. Select **Docker** sebagai installation method

### 6.2 Install Cloudflared di VPS

```bash
# Download cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# Install
sudo dpkg -i cloudflared-linux-amd64.deb

# Verify
cloudflared --version
```

### 6.3 Authenticate & Setup Tunnel

```bash
# Login ke Cloudflare (akan open browser)
cloudflared tunnel login

# Create tunnel (catat TUNNEL_ID)
cloudflared tunnel create ova.iandev-production

# Setup config file
nano ~/.cloudflared/config.yml
```

**config.yml content:**

```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: /home/ova.iandev/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: period.yourdomain.com
    service: http://localhost:8081
  - service: http_status:404
```

### 6.4 Run Tunnel sebagai Service

```bash
# Install sebagai service
cloudflared service install

# Start service
sudo systemctl start cloudflared
sudo systemctl enable cloudflared

# Cek status
sudo systemctl status cloudflared

# Cek logs
sudo journalctl -u cloudflared -f
```

---

## 🔍 Step 7: Verify Deployment

### 7.1 Test HTTPS Access

```bash
# Dari lokal (buka browser)
# https://period.yourdomain.com

# Dari VPS
curl -I https://period.yourdomain.com
```

### 7.2 Test PWA Functionality

```bash
# Buka browser devtools (F12)
# Cek:
# - Application tab → Service Worker registered
# - Application tab → IndexedDB → Database created
# - Network tab → Files loaded from cache
```

### 7.3 Test Health Endpoint

```bash
# Health endpoint
curl http://localhost:8081/health

# Should return: healthy
```

---

## 🔄 Step 8: Update Deployment

### 8.1 Update Code

```bash
# SSH ke VPS
ssh user@your-vps-ip
cd /var/www/ova.iandev

# Pull latest changes
git pull origin main

# Rebuild image
docker build -t ova.iandev:latest .

# Restart container
docker-compose down
docker-compose up -d
```

### 8.2 Auto-Update Script (Optional)

Buat file `/var/www/ova.iandev/update.sh`:

```bash
#!/bin/bash
set -e

echo "🔄 Updating ova.iandev..."

cd /var/www/ova.iandev

# Pull latest
git pull origin main

# Rebuild
docker build -t ova.iandev:latest .

# Restart
docker-compose down
docker-compose up -d

echo "✓ Update completed!"
docker ps | grep ova.iandev
```

Jadikan executable:

```bash
chmod +x /var/www/ova.iandev/update.sh

# Run update
/var/www/ova.iandev/update.sh
```

---

## 📊 Step 9: Monitoring & Maintenance

### 9.1 Container Monitoring

```bash
# Cek resource usage
docker stats ova.iandev-period-tracker

# Cek logs real-time
docker logs -f ova.iandev-period-tracker

# Cek disk usage
docker system df

# Cleanup unused images
docker system prune -a
```

### 9.2 Log Management

```bash
# Cek nginx logs di dalam container
docker exec ova.iandev-period-tracker cat /var/log/nginx/access.log
docker exec ova.iandev-period-tracker cat /var/log/nginx/error.log

# Atau use docker-compose logs
docker-compose logs --tail=100 -f
```

### 9.3 Backup Strategy

**Backup Docker Images:**

```bash
# Save image
docker save ova.iandev:latest | gzip > ova.iandev-backup.tar.gz

# Copy ke backup location
scp ova.iandev-backup.tar.gz user@backup-server:/backups/

# Load image (restore)
docker load < ova.iandev-backup.tar.gz
```

**Backup Git Repository:**

```bash
# Push ke GitHub (remote backup)
git push origin main --all --tags
```

---

## 🛡️ Step 10: Security Hardening

### 10.1 Setup Fail2Ban (Optional)

```bash
# Install fail2ban
sudo apt install -y fail2ban

# Enable service
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Cek status
sudo fail2ban-client status
```

### 10.2 Setup SSH Key Authentication

```bash
# Di lokal machine, generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy key ke VPS
ssh-copy-id user@your-vps-ip

# Test SSH key login
ssh user@your-vps-ip

# Disable password authentication (opsional)
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
sudo systemctl restart sshd
```

### 10.3 Setup Automated Security Updates

```bash
# Install unattended-upgrades
sudo apt install -y unattended-upgrades

# Enable
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 📝 Quick Reference Commands

### Docker Commands

```bash
# Cek running containers
docker ps

# Cek all containers
docker ps -a

# Cek images
docker images

# Stop container
docker stop ova.iandev-period-tracker

# Start container
docker start ova.iandev-period-tracker

# Restart container
docker restart ova.iandev-period-tracker

# Remove container
docker rm ova.iandev-period-tracker

# Cek logs
docker logs -f ova.iandev-period-tracker

# Execute command in container
docker exec -it ova.iandev-period-tracker sh

# Build image
docker build -t ova.iandev:latest .

# Remove image
docker rmi ova.iandev:latest
```

### Docker Compose Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale ova.iandev-app=2
```

### System Commands

```bash
# Cek disk space
df -h

# Cek memory
free -h

# Cek CPU
top -bn1 | head -20

# Cek port yang listen
netstat -tlnp

# Cek process
ps aux | grep docker

# Reboot VPS
sudo reboot

# Shutdown VPS
sudo shutdown -h now
```

---

## 🆘 Troubleshooting

### Problem: Container tidak start

```bash
# Cek logs
docker logs ova.iandev-period-tracker

# Cek nginx config
docker exec ova.iandev-period-tracker nginx -t

# Restart container
docker restart ova.iandev-period-tracker
```

### Problem: Port 8081 tidak accessible

```bash
# Cek firewall
sudo ufw status

# Allow port
sudo ufw allow 8081/tcp

# Cek if port listen
netstat -tlnp | grep 8081
```

### Problem: Cloudflare tunnel not working

```bash
# Cek cloudflared status
sudo systemctl status cloudflared

# Cek logs
sudo journalctl -u cloudflared -n 50

# Restart service
sudo systemctl restart cloudflared
```

### Problem: Out of memory

```bash
# Cek memory usage
free -h

# Cek container resource
docker stats ova.iandev-period-tracker

# Increase swap (temporary)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## 📞 Next Steps

Setelah VPS setup selesai:

1. ✅ **Verify HTTPS access** - Buka https://period.yourdomain.com
2. ✅ **Test PWA features** - Cek service worker & offline mode
3. ✅ **Setup monitoring** - Gunakan tools seperti UptimeRobot
4. ✅ **Setup backup routine** - Automated backup script
5. ✅ **Document credentials** - Simpan SSH key & password di safe place

---

## 🎉 Deployment Complete!

Your ova.iandev app is now live!

**Access URL:** https://period.yourdomain.com

**Health Check:** https://period.yourdomain.com/health

**Container Status:**

```bash
docker ps | grep ova.iandev
```

Happy tracking! 🌸
