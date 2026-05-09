# FSE 2026 — Registration Form

Formulaire d'inscription pour la conférence ESEC/FSE '26 (Montréal, 5-9 juillet 2026).

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Prisma 7 + SQLite (local) / Postgres (prod recommandé)
- Basic Auth pour l'admin

## Démarrage local

```bash
npm install
npx prisma migrate dev
npm run dev
```

- Formulaire : http://localhost:3000
- Admin : http://localhost:3000/admin (login : `admin` / `fse2026`)
- Export CSV : http://localhost:3000/api/admin/export

## Déploiement Vercel

> **Important** : SQLite ne fonctionne pas sur Vercel (filesystem readonly). Pour la prod il faut basculer sur **Postgres** (Vercel Postgres / Neon — gratuit) ou **Turso** (libSQL).

### Option recommandée : Vercel Postgres (Neon)

1. Push le projet sur GitHub.
2. Sur Vercel → **New Project** → importer le repo.
3. Onglet **Storage** → **Create Database** → **Neon Postgres**.
4. Vercel crée automatiquement la variable `DATABASE_URL`.
5. Modifier `prisma/schema.prisma` :
   ```prisma
   datasource db { provider = "postgresql" }
   ```
6. Installer l'adapter Postgres :
   ```bash
   npm uninstall @prisma/adapter-better-sqlite3 better-sqlite3
   npm install @prisma/adapter-pg pg
   ```
7. Modifier `lib/prisma.ts` :
   ```ts
   import { PrismaPg } from "@prisma/adapter-pg";
   const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
   ```
8. Variables d'env Vercel :
   - `ADMIN_USER` = ton user
   - `ADMIN_PASSWORD` = mot de passe fort
9. Ajoute la migration au build dans `package.json` :
   ```json
   "scripts": { "build": "prisma migrate deploy && next build" }
   ```
10. Déployer.

## Variables d'environnement

| Variable | Description |
|---|---|
| `DATABASE_URL` | Connexion DB (sqlite local ou Postgres prod) |
| `ADMIN_USER` | Identifiant admin (défaut: `admin`) |
| `ADMIN_PASSWORD` | Mot de passe admin (défaut: `fse2026` — **change en prod !**) |

## Routes

| Route | Description |
|---|---|
| `/` | Formulaire d'inscription public (8 étapes) |
| `/admin` | Dashboard protégé (Basic Auth) |
| `/api/register` | POST — soumet une inscription |
| `/api/admin/export` | GET — télécharge toutes les inscriptions en CSV |
