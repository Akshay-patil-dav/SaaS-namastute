# Quick Docker Launch — Namustute POS
# Run from the project root: SaaS-namastute\

# ---------- Start everything ----------
docker compose up --build -d

# ---------- View live logs ----------
docker compose logs -f

# ---------- Stop everything ----------
docker compose down

# ---------- Stop and wipe database ----------
docker compose down -v

# ---------- Restart just one service ----------
docker compose restart backend
docker compose restart frontend

# ---------- Rebuild just one service ----------
docker compose up --build backend -d
docker compose up --build frontend -d

# ---------- Open shell inside a container ----------
docker exec -it namastute-backend sh
docker exec -it namastute-frontend sh
docker exec -it namastute-postgres psql -U postgres -d otp_auth_db
