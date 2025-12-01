# 🌿 GreenRoots Back (API + Back‑Office EJS)

[![Node.js](https://img.shields.io/badge/Node.js-22_LTS-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4-black?logo=express&logoColor=white)](https://expressjs.com/)
[![Sequelize](https://img.shields.io/badge/ORM-Sequelize-52B0E7?logo=sequelize&logoColor=white)](https://sequelize.org/)
[![PostgreSQL](https://img.shields.io/badge/DB-PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![EJS](https://img.shields.io/badge/Back--Office-EJS-8A2BE2)](https://ejs.co/)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-626CD9?logo=stripe&logoColor=white)](https://stripe.com)
[![OpenAPI](https://img.shields.io/badge/Docs-Swagger_UI-85EA2D?logo=swagger&logoColor=black)](./docs/openapi.yaml)
[![ESLint](https://img.shields.io/badge/Lint-ESLint-4B32C3?logo=eslint&logoColor=white)](https://eslint.org)
[![Prettier](https://img.shields.io/badge/Code%20Style-Prettier-F7B93E?logo=prettier&logoColor=white)](https://prettier.io)

---

## 🧭 À propos

Backend de **GreenRoots**, projet de fin de formation **DWWM – O’Clock (promo Cambridge)**, développé en **3 semaines** par une équipe de 5.  
Ce dépôt regroupe **l’API REST** consommée par le front ainsi qu’un **back‑office EJS** d’administration.

> Projet pédagogique en **environnement de développement** (non destiné à la production).

- **Front associé :** `projet-greenroots` (Svelte 5)
- **Back‑office EJS** : accessible via `/admin`
- **Docs API (Swagger UI)** : `/docs` — spec JSON : `/openapi.json`

---

## ⚙️ Stack & exigences

| Outil / Techno | Rôle |
|---|---|
| **Node.js 22 (LTS)** | Runtime |
| **Express** | HTTP server + middlewares |
| **Sequelize** | ORM Postgres |
| **PostgreSQL** | Base de données |
| **EJS** | Templates back‑office |
| **Stripe** | Paiements + Webhook |
| **Joi** | Validation schémas |
| **express‑rate‑limit** | Anti brute‑force (login + endpoints sensibles) |
| **express‑session** | Sessions back‑office |
| **express‑xss‑sanitizer** | Sécurité XSS |
| **Swagger UI** | Documentation API |
| **ESLint / Prettier** | Qualité de code |

---

## 🗂️ Architecture (aperçu)

```
config/
  migrations/                → scripts de création + seed
controllers/
  api/                       → contrôleurs API REST (auth, users, orders, trees, …)
  admin/                     → contrôleurs back‑office EJS
docs/                        → openapi.yaml + montage Swagger
middlewares/                 → auth, rate‑limit, validate(Joi), error handler, upload
models/                      → Sequelize (User, Role, Tree, Specie, Campaign, Order, OrderLine, …)
routes/                      → routeurs Express (API, admin, payments, webhook)
views/                       → templates EJS (dashboard, CRUD…)
app.js                       → bootstrap de l’app Express
```

Points clés :
- **CORS** autorise `http://localhost:5173` (front)  
- **Webhook Stripe** monté **avant** `express.json()` → `POST /api/payments/webhook`  
- **Limiter global** sur `/api` + **limiteur spécial** login/sensibles
- **Sessions** cookies httpOnly (2h) pour le back‑office

Axes d'améliorations : 
- Retravailler l'architecture pour isoler l'application back-office (routes, vues et controllers) de l'API, au sein d'un dossier src et garder les éléments communs à la racine de ce dossier
- Maintenir la configuration et le point d'entrée dans la racin du projet
---

## 🔑 Variables d’environnement

Créez un fichier `.env` à la racine (vous pouvez partir de `.env.example`) :

```env
NODE_ENV=development
DB_URL=postgres://user:password@localhost:5432/db_name
PORT=3000

JWT_SECRET=change_me

EMAILJS_SERVICE_ID=service_xxxxx
EMAILJS_TEMPLATE_NOTIFICATION=template_abcd1234
EMAILJS_TEMPLATE_CONFIRMATION=template_1234abcd
EMAILJS_PUBLIC_KEY=xxxxxxxxxx

STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

DOCS_USER=username
DOCS_PASS=password
SESSION_SECRET=dev_session_secret
```

> ℹ️ En **production**, activer l’auth basique des docs via `DOCS_USER/DOCS_PASS` (voir `docs/docs-setup.js`).

---

## 🗄️ Base de données

- **PostgreSQL** via `DB_URL`
- Synchronisation et seed via scripts **Sequelize** minimalistes

### Scripts BD
```bash
npm run db:create   # sync drop+create toutes les tables
npm run db:seed     # insère jeux d'essai (roles, users, countries, species, trees, campaigns…)
npm run db:reset    # enchaîne create + seed
```

> Les seeds créent notamment rôles, pays, espèces, campagnes, arbres et un jeu d’utilisateurs.

---

## 🚀 Installation & démarrage

```bash
# 1) Dépendances
npm install

# 2) Variables d'environnement
cp .env.example .env
# puis éditer .env (DB_URL, JWT_SECRET, STRIPE_SECRET_KEY, etc.)

# 3) Base de données (local)
npm run db:reset

# 4) Lancer l'API en dev (http://localhost:3000)
npm run dev
# ou en mode run
npm start
```

Back‑office EJS accessible sur `http://localhost:3000/admin`  
Swagger UI sur `http://localhost:3000/docs`

---

## 🌐 API (surfaces principales)

Routeur principal (`/api`) :

| Domaine | Endpoints (exemples) |
|---|---|
| **Auth** | `POST /api/auth/register`, `POST /api/auth/login` |
| **Users** | `GET /api/users/me`, `PATCH /api/users/me/password` |
| **Campaigns** | `GET /api/campaigns`, `GET /api/campaigns/landing` |
| **Trees** | `GET /api/trees`, `GET /api/trees/landing` |
| **Orders** | `GET /api/orders`, `POST /api/orders` |
| **Payments** | `POST /api/payments/create-payment-intent`, `POST /api/payments/webhook` |
| **Wishlist** | `GET/POST/DELETE /api/wishlists/...` |
| **Contact** | `POST /api/contact` |

### Authentification
- **JWT** dans l’en‑tête : `Authorization: Bearer <token>` (voir `middlewares/auth.middleware.js`)
- Rôles via `Role` en BDD, helpers d’admin (`requireAdmin`, `isAllowed`)
- **Rate limit login** : IP + e‑mail ; endpoints sensibles throttlés

---

## 💳 Paiements (Stripe)

- Création **PaymentIntent** : `POST /api/payments/create-payment-intent` (auth requise)
- **Webhook** Stripe : `POST /api/payments/webhook` (vérification signature `STRIPE_WEBHOOK_SECRET`)
- Génération d’un **order_number** (`GR-<ulid>`) et snapshot des items (côté webhook)

---

## 🛡️ Sécurité

- `express-rate-limit` (global + login/sensibles) — clé IPV6 sûre (`ipKeyGenerator`)
- `express-xss-sanitizer` et validation **Joi** (`schemas/` + `middlewares/validate.js`)
- **Sessions** `express-session` (back‑office EJS), cookies httpOnly / sameSite=lax

---

## 🧪 Qualité & scripts

```bash
# Lint & format
npm run lint        # eslint .
# (Prettier via configuration du repo)
```

Scripts disponibles (`package.json`) :
- `start`, `dev` (watch)
- `db:create`, `db:seed`, `db:reset`

---

## 🧰 Dépannage (FAQ)

| Problème | Cause | Solution |
|---|---|---|
| `Unable to connect to the database` | `DB_URL` invalide ou PostgreSQL non lancé | Vérifier `.env` et service Postgres |
| 401 sur endpoints protégés | `Authorization` absent ou JWT invalide/expiré | Refaire un login, vérifier `JWT_SECRET` |
| Webhook Stripe renvoie 400 | Signature manquante/incorrecte | Vérifier `STRIPE_WEBHOOK_SECRET` et l’URL configurée |
| 429 Too Many Requests | Rate limit engagé | Réessayer après fenêtre glissante |
| CORS depuis le front | Origine non autorisée | Voir réglage `cors({ origin: "http://localhost:5173" })` |

---

## 🗺️ Roadmap / TODO (back)

- [ ] Améliorer l'architecture pour mieux identifer l'API du Back-office
- [ ] Routines de **migration** versionnées (sequelize‑cli) au lieu de `sync({ force })`
- [ ] Couvrir les endpoints critiques par des **tests automatisés**
- [ ] Renforcer les **rôles** et **autorisations** sur l’admin
- [ ] Ajout d’un **logger** (pino/winston) + corrélation requêtes
- [ ] Pipeline **CI** (build + lint + tests) GitHub Actions

---

## 👥 Équipe & licence

Projet réalisé par 5 apprenants – **O’Clock – DWWM – Promo Cambridge (2025)**.  
Projet de formation – non destiné à un usage commercial.
