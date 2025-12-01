# 🌱 GreenRoots Front

[![Node.js](https://img.shields.io/badge/Node.js-22_LTS-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Svelte 5](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte&logoColor=white)](https://svelte.dev)
[![Stripe](https://img.shields.io/badge/Stripe-Integration-626CD9?logo=stripe&logoColor=white)](https://stripe.com)
[![Vitest](https://img.shields.io/badge/Tests-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev)
[![ESLint](https://img.shields.io/badge/Lint-ESLint-4B32C3?logo=eslint&logoColor=white)](https://eslint.org)
[![Prettier](https://img.shields.io/badge/Code%20Style-Prettier-F7B93E?logo=prettier&logoColor=white)](https://prettier.io)

---

## 🧭 À propos du projet

**GreenRoots** est un projet de fin de formation réalisé dans le cadre du **Titre Professionnel Développeur Web & Web Mobile (DWWM)** dispensé par **O’Clock** (promotion Cambridge).  
Développé en équipe de cinq sur trois semaines (conception comprise), il a pour objectif de mettre en pratique les compétences acquises durant la formation à travers la conception d’une application complète front/back.

- **Front-end :** ce dépôt `projet-greenroots-main` (Svelte 5)
- **Back-end :** dépôt associé [`projet-greenroots-back`](https://github.com/O-clock-Cambridge/projet-greenroots-back) (API + back-office EJS)

> Ce projet s’inscrit dans un environnement **de développement uniquement**.  
> Il n’a pas vocation à être déployé en production, mais constitue une base solide pour des travaux d’amélioration, de refactorisation et de démonstration technique.

---

## ⚙️ Stack & exigences

| Outil / Technologie | Version / Rôle |
|---------------------|----------------|
| **Node.js** | 22 (LTS) |
| **Framework** | SvelteKit (Svelte 5, Runes) |
| **Langage** | JavaScript ES2023 |
| **Gestionnaire de paquets** | npm |
| **Dépendances clés** | `@sveltejs/kit`, `@stripe/stripe-js`, `jwt-decode` |
| **Qualité & tooling** | ESLint 9 · Prettier 3 |
| **Tests** | Vitest + @testing-library/jest-dom |

---

## 🧩 Architecture du projet

```
src/
├── lib/
│   ├── assets/components/     → Composants UI (Navbar, Footer, Cards, etc.)
│   ├── stores/                → Svelte stores (auth, cart, wishlist)
│   ├── utils/                 → Helpers (formatters, stripeClient, errorHandler)
├── routes/                    → Pages (landing, trees, campaigns, cart, etc.)
└── app.html                   → Template principal
```

- Peu d’usage des **Runes Svelte 5** (`$state`, `$props`) pour l’instant → axe de refactorisation.
- Appels `fetch` côté client (`onMount`) → éviter en SSR.
- `auth.js`, `wishlist.js`, `cart.js` assurent la gestion locale (token, panier, favoris).

---

## 🔑 Variables d’environnement

Créer un fichier `.env` à la racine du projet (ou copier `.env.example`) :

```bash
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# (À ajouter lors du refacto)
# PUBLIC_API_URL=http://localhost:3000/api
```

> ⚠️ Le front communique actuellement avec une API locale (`http://localhost:3000/api/...`).

---

## 🧰 Installation & démarrage

### 🔧 Prérequis
- Node.js ≥ 22  
- npm ≥ 10  
- Accès à l’API locale (backend `projet-greenroots-back` lancé sur le port 3000)

### 🚀 Démarrage

```bash
# Installation des dépendances
npm install

# Lancement du serveur de développement
npm run dev

# Construction du build de production
npm run build

# Prévisualisation du build
npm run preview
```

---

## 🌐 Intégration API

Le front consomme une **API Express** développée dans le dépôt `projet-greenroots-back`.  
Les principales routes utilisées :

| Domaine | Endpoint | Méthode |
|----------|-----------|---------|
| Authentification | `/api/auth/login`, `/api/auth/register` | POST |
| Campagnes | `/api/campaigns`, `/api/campaigns/landing` | GET |
| Arbres | `/api/trees`, `/api/trees/landing` | GET |
| Commandes | `/api/orders` | GET/POST |
| Contact | `/api/contact` | POST |

### 🔐 Authentification
- Auth via **JWT** stocké en `localStorage`
- **Refresh token automatique** sur chaque action front (durée de vie 1h, renouvelé côté back)
- Déconnexion → suppression du token local

### 💳 Setup Stripe CLI (env. local)

> Objectif : recevoir les webhooks Stripe **en local** via un tunnel, pour que la création de commande (webhook) fonctionne pendant vos tests.

#### ✅ Prérequis

- Back API démarre sur `http://localhost:3000`
- Webhook route : `POST /api/payments/webhook`
- Dans `app.js`, la route webhook est **montée avant** `express.json()` et utilise `express.raw({ type: "application/json" })`
- Création d'un compte en envrionnement de test sur [Stripe](https://stripe.com/fr)

```js
// app.js (extrait)
app.use("/api/payments/webhook", paymentsWebhookRouter); // <-- AVANT express.json()
app.use(express.json());
```

---

#### 1) Installer Stripe CLI

##### macOS (Homebrew)
```bash
brew install stripe/stripe-cli/stripe
```

##### Windows (Scoop)
```powershell
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli
scoop install stripe
```

##### Linux (Debian/Ubuntu — binaire)
```bash
curl -L https://github.com/stripe/stripe-cli/releases/latest/download/stripe_1.20.9_linux_x86_64.tar.gz -o stripe.tar.gz
tar -xzf stripe.tar.gz
sudo mv stripe /usr/local/bin/
stripe version
```

> Vérifiez : `stripe version` doit afficher un numéro de version.

---

#### 2) Se connecter (une seule fois)

```bash
stripe login
```

- Le navigateur s’ouvre → autorisez l’accès.
- La console confirme la connexion.

---

#### 3) Lancer l’écoute (tunnel local)

Dans un **terminal dédié** (laissez-le ouvert pendant vos tests) :

```bash
stripe listen --forward-to http://localhost:3000/api/payments/webhook
```

- Le CLI affiche un **Webhook signing secret** : `whsec_XXXXXXXX`.
- **Copiez** ce secret. (Vous pouvez aussi l’afficher via `stripe listen --print-secret`.)

> ⚠️ Ce `whsec_...` **change à chaque relance** de `stripe listen`. Pensez à mettre à jour votre `.env` et à redémarrer l’API.

---

#### 4) Mettre à jour votre `.env` (back)

Dans le projet **back**, éditez votre `.env` :

```env
STRIPE_SECRET_KEY=sk_test_...          # fournie par le lead / le dashboard Stripe
STRIPE_WEBHOOK_SECRET=whsec_...        # <-- votre secret CLI
```

Puis **redémarrez** le serveur API pour recharger l’environnement.

---

#### 5) Vérifications rapides

##### A) Test “à blanc” depuis la CLI
```bash
stripe trigger payment_intent.succeeded
```

Attendu :
- Dans le terminal CLI : `--> payment_intent.succeeded [...]` puis `<-- [200] POST http://localhost:3000/api/payments/webhook`
- Dans la console back : logs du webhook (ex. création d’order) ou 200 silencieux.

Si vous voyez **[400]** :
- `STRIPE_WEBHOOK_SECRET` incorrect → mettez à jour et redémarrez l’API.
- Route webhook pas montée avec `express.raw` **avant** `express.json`.
- Mauvaise URL de forward.

##### B) Parcours réel via le front
1. Connectez-vous (pour avoir un **JWT**).
2. Ajoutez des produits au panier.
3. Page **/order** → payez avec carte test `4242 4242 4242 4242` (+ date future + CVC).
4. Redirection **/order/confirm** : l’order doit apparaître, le **panier** se vide, la **DB** contient la commande et les lignes.

---

#### 6) Bonnes pratiques

- Laissez le terminal `stripe listen` **ouvert**.
- **Chaque dev** a **son** `whsec` dans **son** `.env`.
- Si l’API n’est **pas** sur le port 3000, adaptez l’URL :
  ```bash
  stripe listen --forward-to http://localhost:4000/api/payments/webhook
  ```
- En cas de doute, regardez d’abord la console Stripe CLI :
  - `<-- [200]` → le webhook a bien atteint votre API.
  - `<-- [400]` → signature/route/parser à corriger.

---

#### 7) Dépannage (FAQ)

**Q1.** `Webhook Error: No signatures found` (400)  
→ Mauvais `STRIPE_WEBHOOK_SECRET` dans `.env`. Récupérez le bon (`stripe listen --print-secret`), mettez-le à jour, redémarrez l’API.

**Q2.** Erreur de parsing JSON côté webhook  
→ La route webhook doit **impérativement** utiliser `express.raw({ type: "application/json" })` et être **définie avant** `express.json()`.

**Q3.** CLI affiche `<-- [404]`  
→ Mauvais chemin. Vérifiez que l’API est sur `http://localhost:3000` et que la route est bien `/api/payments/webhook`.

**Q4.** Paiement ok chez Stripe, mais page /confirm affiche 404  
→ Le webhook n’a pas tourné (CLI non lancé) **ou** a échoué. Relancez la CLI, corrigez l’erreur, refaites un paiement.

**Q5.** On est plusieurs à tester en même temps ?  
→ Oui, chacun lance **son** tunnel et utilise **son** `whsec` dans **son** `.env`. Les tests sont indépendants.

---

#### 8) Résumé express (checklist)

1. `stripe login`  
2. `stripe listen --forward-to http://localhost:3000/api/payments/webhook`  
3. Copier `whsec_...` → `.env` (`STRIPE_WEBHOOK_SECRET=...`)  
4. **Redémarrer** l’API  
5. Tester :  
   - `stripe trigger payment_intent.succeeded` → **200**,  
   - ou paiement réel via le front (carte test).


---

## 🧪 Données de test

| Élément | Valeur |
|----------|--------|
| **Compte admin (test)** | `admin@greenroots.com` / `Admin123!` |
| **Carte Stripe (test)** | `4242 4242 4242 4242` – 10/28 – 123 |

### 💳 Scénario de test
1. Créer un compte ou se connecter avec l’admin test  
2. Ajouter un arbre au panier  
3. Procéder au paiement avec la carte test Stripe  
4. Vérifier la commande dans “Mes commandes”

---

## 🧹 Qualité & conventions

- **Linting** :  
  ```bash
  npm run lint
  ```
- **Formatage** :  
  ```bash
  npm run format
  ```

- **Conventions** :
  - Branches : `main`, `dev`, `feature/*`
  - Commits : style libre, adoption de **Conventional Commits** recommandée
  - Husky / lint-staged : non utilisés (peuvent être ajoutés ultérieurement)

---

## 🧾 Tests

Tests unitaires avec **Vitest** :

```bash
npm run test
```

Exemple existant :  
`src/lib/utils/DateFormatter.test.js` – test unitaire de la fonction `formatDateToDisplay`.

---

## 🚀 Performance, accessibilité & SEO

| Indicateur (Lighthouse – DevTools) | Score |
|-----------------------------------|--------|
| SEO | 100 |
| Accessibilité | 96 |
| Bonnes pratiques | 96 |
| Performance | 71 |

> Un travail de refactorisation est prévu pour améliorer les performances (chargement d’images, appels API, et lazy loading).

---

## ⚙️ Déploiement & CI/CD

Ce projet n’a pas vocation à être déployé en production.  
Toutefois, un pipeline CI/CD simple peut être ajouté pour valider les builds sur GitHub Actions :

```yaml
# .github/workflows/build.yml
name: Build Front
on:
  push:
    branches: [ "main", "dev" ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run build
```

---

## 🧰 Dépannage (FAQ)

| Problème | Cause probable | Solution |
|-----------|----------------|-----------|
| `Fetch failed` en SSR | Appel API exécuté côté serveur | Déplacer dans `onMount` |
| `Stripe key not provided` | Variable d’environnement absente | Vérifier `.env` |
| Authentification expirée | Token JWT périmé | Relancer la session (refresh auto dans la limite d’1h) |
| Erreur 401 sur `/api/users/me` | Token manquant ou invalide | Vérifier `localStorage` |
| Version Node incompatible | Node < 22 | Mettre à jour vers la LTS 22 |

---

## 🗺️ Roadmap / TODO

### 🔄 Refactorisation prévue
- [ ] Centraliser les appels API dans un **client unique** (`apiClient.js`)
- [ ] Introduire `PUBLIC_API_URL` dans le `.env`
- [ ] Déplacer les routes codées en dur vers un module commun
- [ ] Harmoniser l’usage des **runes Svelte 5** (`$state`, `$props`)
- [ ] Optimiser la **performance Lighthouse** (>90 sur tous les critères)
- [ ] Ajouter Husky + lint-staged
- [ ] Étendre la couverture **Vitest**

---

## 👥 Équipe projet

Développé par une équipe de 5 apprenants dans le cadre du titre professionnel **Développeur Web & Web Mobile – O’Clock**.  
Promotion **Cambridge** · Année **2025**

---

## 📝 Licence

Projet de formation – non destiné à un usage commercial.  
© 2025 – Équipe GreenRoots (O’Clock)
