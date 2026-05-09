# FSE 2026 — Registration Form

Formulaire d'inscription pour la conférence ESEC/FSE '26 (Montréal, 5-9 juillet 2026).

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Prisma 7 + **PostgreSQL** (Vercel + Neon)
- Cookie-based session auth (HMAC-SHA256, Edge-compatible)
- i18n FR/EN avec toggle (FR par défaut)

## Démarrage local

Tu as besoin d'un Postgres local (Docker, ou utilise une branche Neon free).

```powershell
npm install
# édite .env et mets ton DATABASE_URL Postgres
npx prisma db push
npm run dev
```

- Formulaire : http://localhost:3000
- Login admin : http://localhost:3000/admin/login (`admin` / `fse2026`)

## Déploiement Vercel — A à Z

### 1) Créer la base Postgres sur Vercel

1. https://vercel.com/new → importer le repo GitHub
2. **Root Directory** : `fse2026-app/`
3. Avant de déployer : onglet **Storage** → **Create Database** → **Neon Postgres**
4. Vercel ajoute automatiquement `DATABASE_URL` au projet ✅

### 2) Variables d'environnement

Settings → Environment Variables :

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | (auto, créée par Neon) |
| `ADMIN_USER` | `admin` (ou ton choix) |
| `ADMIN_PASSWORD` | un mot de passe **fort** |
| `ADMIN_SESSION_SECRET` | une chaîne aléatoire longue (min 32 chars) — utilise `openssl rand -hex 32` |

### 3) Déployer

Click **Deploy**. Le build exécute :
```
prisma generate && prisma db push --accept-data-loss && next build
```
qui crée les tables sur Neon automatiquement au premier déploiement.

### 4) Vérifier

| URL | Action |
|---|---|
| `/` | Splash + formulaire |
| `/admin/login` | Page de login |
| `/admin` | Dashboard (si connecté) sinon redirige vers login |
| `/api/admin/export` | Téléchargement CSV (auth requise) |

## Routes

| Route | Description |
|---|---|
| `/` | Formulaire public 8 étapes (FR/EN) |
| `/admin/login` | Page de connexion admin |
| `/admin` | Dashboard protégé |
| `POST /api/register` | Soumet une inscription |
| `POST /api/admin/login` | Authentifie l'admin → cookie session |
| `POST /api/admin/logout` | Déconnecte |
| `GET /api/admin/export` | CSV des inscriptions |

## Sécurité

- Cookie de session **httpOnly, secure (en prod), sameSite=lax**, durée **7 jours**
- Token signé HMAC-SHA256 avec `ADMIN_SESSION_SECRET`
- Vérification dans le middleware Edge (Web Crypto)
- Comparaison du mot de passe en clair contre `ADMIN_PASSWORD` (env) — si tu veux passer à du bcrypt/argon2, ouvre une issue
