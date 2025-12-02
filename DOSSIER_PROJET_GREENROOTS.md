# DOSSIER DE PROJET - GREENROOTS

## Développeur Web et Web Mobile (DWWM)

---

## Table des Matières

1. [Contexte du Projet](#contexte-du-projet)
2. [Équipe et Organisation](#équipe-et-organisation)
3. [Présentation du Projet](#présentation-du-projet)
4. [Stack Technique](#stack-technique)
5. [Modélisation de la Base de Données](#modélisation-de-la-base-de-données)
6. [Maquettage et Design](#maquettage-et-design)
7. [Architecture de l'Application](#architecture-de-lapplication)
8. [Fonctionnalités Principales](#fonctionnalités-principales)
9. [Sécurité](#sécurité)
10. [Environnement de Développement](#environnement-de-développement)
11. [Exemples de Code](#exemples-de-code)
12. [Conclusion](#conclusion)

---

## 1. Contexte du Projet

**GreenRoots** est une plateforme e-commerce dédiée à la reforestation et à la préservation de la biodiversité. L'association à but non lucratif permet aux particuliers, entreprises et collectivités de financer la plantation d'arbres à travers des campagnes de reforestation dans le monde entier.

### Objectifs du Projet

- **Sensibiliser** : Informer le public sur l'importance de la reforestation
- **Faciliter** : Offrir une plateforme simple et intuitive pour financer des arbres
- **Tracer** : Permettre le suivi des campagnes et de leur progression
- **Engager** : Créer une communauté autour de la cause environnementale

### Contexte de Formation

Ce projet a été réalisé dans le cadre de la formation **Développeur Web et Web Mobile (DWWM)**. Il a permis de mettre en pratique l'ensemble des compétences acquises durant la formation :

- Développement front-end avec des frameworks modernes
- Développement back-end avec Node.js
- Gestion de base de données relationnelle
- Travail en équipe avec méthodologie Agile/Scrum
- Intégration de services tiers (paiement en ligne)

---

## 2. Équipe et Organisation

### Composition de l'Équipe

L'équipe GreenRoots est composée de **5 développeurs** ayant collaboré pendant toute la durée du projet :

| Membre | Rôle Principal | Contributions |
|--------|----------------|---------------|
| **Moi** | **Scrum Master & Développeur Full-Stack** | - Gestion de projet et coordination d'équipe<br>- Développement front-end (landing page, pages boutique)<br>- Composants CampaignCard, TreeCard<br>- Store cart.js (gestion du panier)<br>- Review et validation du code back-end<br>- Support technique à l'ensemble de l'équipe |
| **Tony Saes** | **Développeur Back-End** | - Architecture API REST<br>- Développement des contrôleurs et services<br>- Intégration Stripe pour les paiements<br>- Gestion des commandes |
| **Sebastien Arantes** | **Développeur Back-End** | - Modélisation de la base de données<br>- Développement des modèles Sequelize<br>- Routes API<br>- Gestion des relations entre entités |
| **Maxime G.** | **Designer & Développeur Front-End** | - Charte graphique et palette de couleurs<br>- Interface d'administration<br>- Design des composants UI<br>- Expérience utilisateur |
| **Antony Joachim** | **Développeur Front-End** | - Développement des pages et composants<br>- Intégration des designs<br>- Responsive design |

### Méthodologie de Travail

**Méthodologie Agile/Scrum**

- **Sprints de 2 semaines**
- **Daily stand-ups** : Points quotidiens de 15 minutes
- **Sprint planning** : Planification en début de sprint
- **Sprint review** : Démonstration des fonctionnalités
- **Rétrospectives** : Amélioration continue du processus

**Outils de Collaboration**

- **Figma** : Design collaboratif et maquettage
- **Whimsical** : Création des wireframes et du MCD
- **Git/GitHub** : Gestion de versions et code review
- **Trello/Notion** : Gestion des tâches et user stories
- **Discord/Slack** : Communication quotidienne

### Répartition du Travail

#### Phase de Conception (Tous les membres)
- Maquettage sur Whimsical et Figma
- Définition du MCD et de la structure de base de données
- Wireframes mobile et desktop
- Charte graphique

#### Phase de Développement

**Front-End** (Moi, Antony Joachim, Maxime G.)
- Landing page avec présentation de l'association
- Catalogue des arbres avec filtres et tri
- Pages de détail des campagnes et arbres
- Système de panier et wishlist
- Interface d'administration

**Back-End** (Tony Saes, Sebastien Arantes + Review par moi)
- API REST avec Express.js
- Authentification et gestion des utilisateurs
- Gestion des commandes
- Intégration de Stripe pour les paiements
- Panel d'administration

---

## 3. Présentation du Projet

### Vision

GreenRoots vise à créer un pont entre les particuliers souhaitant agir pour l'environnement et les projets de reforestation à travers le monde. La plateforme permet de financer des arbres de manière simple, transparente et traçable.

### Fonctionnalités Clés

#### Pour les Utilisateurs

1. **Navigation et Découverte**
   - Page d'accueil avec présentation de l'association
   - Campagnes de reforestation par pays
   - Catalogue d'arbres disponibles
   - Filtrage par campagne et tri par prix

2. **Gestion de Compte**
   - Inscription et connexion sécurisée
   - Profil utilisateur avec informations personnelles
   - Historique des commandes
   - Wishlist pour sauvegarder des arbres favoris

3. **Processus d'Achat**
   - Ajout d'arbres au panier
   - Gestion des quantités
   - Paiement sécurisé via Stripe
   - Confirmation de commande avec récapitulatif

4. **Suivi et Transparence**
   - Progression des campagnes en temps réel
   - Nombre d'arbres plantés
   - Détails sur chaque espèce d'arbre

#### Pour les Administrateurs

1. **Gestion des Campagnes**
   - Création et modification de campagnes
   - Association avec des pays
   - Gestion des dates et descriptions

2. **Gestion des Arbres**
   - Ajout d'espèces d'arbres
   - Gestion des stocks
   - Définition des prix
   - Upload d'images

3. **Gestion des Utilisateurs**
   - Consultation des utilisateurs inscrits
   - Gestion des rôles (admin, user, partner)
   - Suivi des commandes

4. **Statistiques**
   - Vue d'ensemble des ventes
   - Arbres plantés par campagne
   - Revenus générés

---

## 4. Stack Technique

### Front-End

#### Svelte / SvelteKit
- **Framework JavaScript moderne** : Svelte compile le code en JavaScript vanilla ultra-performant
- **Réactivité native** : Pas de Virtual DOM, mises à jour granulaires
- **SvelteKit** : Framework full-stack pour le routing et le SSR
- **Avantages** :
  - Bundle size minimal
  - Performance optimale
  - Syntaxe intuitive et concise
  - Moins de boilerplate que React ou Vue

#### Vite
- **Build tool moderne** : Compilation ultra-rapide
- **Hot Module Replacement (HMR)** : Rechargement instantané pendant le développement
- **Optimisation automatique** : Tree-shaking et code splitting

#### Technologies Complémentaires
- **CSS3** : Styles personnalisés avec variables CSS
- **Fetch API** : Communication avec le back-end
- **Svelte Stores** : Gestion d'état réactive (auth, cart, wishlist)

### Back-End

#### Node.js + Express.js
- **Runtime JavaScript** : Node.js pour l'exécution côté serveur
- **Express.js** : Framework minimaliste et flexible pour API REST
- **Architecture MVC** : Séparation claire des responsabilités

#### Base de Données

**PostgreSQL**
- **SGBD relationnel** : Robustesse et performance
- **Intégrité des données** : Contraintes et relations strictes
- **Transactions ACID** : Fiabilité des opérations
- **Sequelize ORM** : Abstraction de la base de données en JavaScript

#### Services et Librairies

**Sécurité**
- `express-session` : Gestion des sessions utilisateur
- `bcrypt` : Hachage sécurisé des mots de passe
- `express-xss-sanitizer` : Protection contre les attaques XSS
- `express-rate-limit` : Limitation du taux de requêtes (DoS protection)
- `cors` : Gestion des Cross-Origin Resource Sharing

**Paiement**
- `stripe` : Intégration des paiements sécurisés
- Webhooks pour la confirmation des paiements

**Utilitaires**
- `dotenv` : Gestion des variables d'environnement
- `nodemailer` : Envoi d'emails (contact, confirmation)

### Environnement de Développement

**Outils**
- **Git** : Gestion de versions
- **GitHub** : Hébergement du code et collaboration
- **ESLint** : Linting du code JavaScript
- **Prettier** : Formatage automatique du code
- **VM (Machines Virtuelles)** : Environnement de développement local

**Structure du Projet**

```
projet-greenroots/
├── projet-greenroots-main/        # Front-End (Svelte)
│   ├── src/
│   │   ├── lib/
│   │   │   ├── assets/
│   │   │   │   └── components/    # Composants réutilisables
│   │   │   ├── stores/            # Gestion d'état (cart, auth, wishlist)
│   │   │   └── utils/             # Fonctions utilitaires
│   │   ├── routes/                # Pages de l'application
│   │   └── app.css                # Styles globaux
│   ├── static/                    # Assets statiques
│   └── svelte.config.js
│
├── app.js                         # Point d'entrée Back-End
├── controllers/                   # Contrôleurs (logique métier)
│   ├── api/                       # API publique
│   └── admin/                     # API administration
├── models/                        # Modèles Sequelize
├── routes/                        # Routes Express
├── services/                      # Services (logique réutilisable)
├── middlewares/                   # Middlewares Express
├── config/                        # Configuration (DB, Stripe, etc.)
└── .env                          # Variables d'environnement
```

---

## 5. Modélisation de la Base de Données

### Modèle Conceptuel de Données (MCD)

Le MCD a été conçu collaborativement par l'équipe sur Whimsical. Il représente les entités principales et leurs relations :

**Entités Principales**

1. **UTILISATEUR** : Compte utilisateur (particulier, entreprise, admin)
2. **ROLE** : Rôle de l'utilisateur (admin, user, partner)
3. **ARBRE** : Arbre disponible à l'achat
4. **ESPECE** : Espèce botanique de l'arbre
5. **CAMPAGNE** : Campagne de reforestation
6. **PAYS** : Localisation géographique de la campagne
7. **COMMANDE** : Commande passée par un utilisateur
8. **LIGNE_DE_COMMANDE** : Détail d'une commande (arbre + quantité)
9. **INTENTION_DE_PAIEMENT** : Draft de paiement Stripe

**Relations**

- Un **UTILISATEUR** possède un **ROLE** (1,1)
- Un **UTILISATEUR** peut passer plusieurs **COMMANDES** (0,N)
- Un **UTILISATEUR** peut mémoriser plusieurs **ARBRES** en wishlist (0,N)
- Une **COMMANDE** contient plusieurs **LIGNES_DE_COMMANDE** (1,N)
- Une **LIGNE_DE_COMMANDE** référence un **ARBRE** (1,1)
- Un **ARBRE** appartient à une **ESPECE** (1,1)
- Un **ARBRE** est promu par une **CAMPAGNE** (0,1)
- Une **CAMPAGNE** se déroule dans un **PAYS** (1,1)
- Un **UTILISATEUR** peut créer plusieurs **INTENTIONS_DE_PAIEMENT** (0,N)
- Une **COMMANDE** peut être liée à une **INTENTION_DE_PAIEMENT** (0,1)

### Dictionnaire de Données

#### Table : `role`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique |
| `name` | TEXT | UNIQUE, NOT NULL | Nom du rôle : 'admin', 'user', 'partner' |

#### Table : `user`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique |
| `firstname` | TEXT | NULLABLE | Prénom de l'utilisateur |
| `lastname` | TEXT | NULLABLE | Nom de famille |
| `mail` | TEXT | UNIQUE, NOT NULL | Email (identifiant de connexion) |
| `password` | TEXT | NOT NULL | Mot de passe haché (bcrypt) |
| `address_number` | TEXT | NULLABLE | Numéro de voie |
| `address_streetname` | TEXT | NULLABLE | Nom de la rue |
| `postal_code` | TEXT | NULLABLE | Code postal |
| `city` | TEXT | NULLABLE | Ville |
| `phone_number` | TEXT | NULLABLE | Numéro de téléphone |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Date de création du compte |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Date de dernière modification |
| `role_id` | INTEGER | FOREIGN KEY → role.id, NOT NULL | Rôle de l'utilisateur |

**Contraintes d'intégrité** :
- `ON UPDATE CASCADE` : Mise à jour en cascade
- `ON DELETE RESTRICT` : Empêche la suppression si des utilisateurs existent

#### Table : `order`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique |
| `order_number` | TEXT | UNIQUE, NOT NULL | Numéro de commande généré |
| `total_price` | INTEGER | CHECK >= 0, NOT NULL | Prix total en centimes |
| `user_id` | INTEGER | FOREIGN KEY → user.id, NOT NULL | Client ayant passé la commande |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Date de création |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Date de modification |

**Contraintes d'intégrité** :
- `ON UPDATE CASCADE, ON DELETE RESTRICT`

#### Table : `order_line`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique |
| `tree_name` | TEXT | NOT NULL | Nom de l'arbre au moment de l'achat (snapshot) |
| `quantity` | INTEGER | CHECK > 0, NOT NULL | Quantité commandée |
| `unit_price` | INTEGER | CHECK >= 0, NOT NULL | Prix unitaire en centimes |
| `total_price` | INTEGER | GENERATED COLUMN | Calcul automatique : quantity × unit_price |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Date de création |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Date de modification |
| `order_id` | INTEGER | FOREIGN KEY → order.id, NOT NULL | Commande parente |
| `tree_id` | INTEGER | FOREIGN KEY → tree.id, NULLABLE | Référence vers l'arbre (peut être NULL si supprimé) |

**Contraintes d'intégrité** :
- `order_id` : `ON UPDATE CASCADE, ON DELETE CASCADE`
- `tree_id` : `ON UPDATE CASCADE, ON DELETE SET NULL`

#### Table : `tree`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique |
| `name` | TEXT | NOT NULL | Nom commercial de l'arbre |
| `latin_name` | TEXT | NULLABLE | Nom scientifique (latin) |
| `price` | INTEGER | CHECK >= 0, NOT NULL | Prix en centimes |
| `quantity` | INTEGER | CHECK >= 0, NOT NULL | Quantité restante en stock |
| `stock` | INTEGER | NOT NULL | Stock initial |
| `image` | TEXT | NULLABLE | URL ou nom de fichier de l'image |
| `specie_id` | INTEGER | FOREIGN KEY → specie.id, NOT NULL | Espèce de l'arbre |
| `campaign_id` | INTEGER | FOREIGN KEY → campaign.id, NULLABLE | Campagne associée |

**Contraintes d'intégrité** :
- `specie_id` : `ON UPDATE CASCADE, ON DELETE RESTRICT`
- `campaign_id` : `ON UPDATE CASCADE`

#### Table : `specie`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique |
| `name` | TEXT | UNIQUE, NOT NULL | Nom de l'espèce |
| `description` | TEXT | NULLABLE | Description botanique |

#### Table : `campaign`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique |
| `name` | TEXT | NOT NULL | Nom de la campagne |
| `description` | TEXT | NULLABLE | Description du projet |
| `begin_date` | DATE | NOT NULL | Date de début |
| `image` | TEXT | NULLABLE | Image de la campagne |
| `country_id` | INTEGER | FOREIGN KEY → country.id | Pays de la campagne |

#### Table : `country`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique |
| `name` | TEXT | UNIQUE, NOT NULL | Nom du pays |

#### Table : `user_wishlist` (Many-to-Many)

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `user_id` | INTEGER | FOREIGN KEY → user.id | Utilisateur |
| `tree_id` | INTEGER | FOREIGN KEY → tree.id | Arbre favori |
| `createdAt` | TIMESTAMPTZ | DEFAULT now() | Date d'ajout |
| `updatedAt` | TIMESTAMPTZ | DEFAULT now() | Date de modification |

**Clé primaire composée** : (`user_id`, `tree_id`)

#### Table : `payment_intent_draft`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique |
| `stripe_payment_intent_id` | TEXT | UNIQUE, NOT NULL | ID de l'intention de paiement Stripe |
| `cart_snapshot` | JSONB | NOT NULL | Snapshot du panier au moment du paiement |
| `amount` | INTEGER | NOT NULL | Montant en centimes |
| `status` | TEXT | NOT NULL | Statut : 'draft', 'succeeded', 'failed' |
| `user_id` | INTEGER | FOREIGN KEY → user.id, NULLABLE | Utilisateur (si connecté) |
| `order_id` | INTEGER | FOREIGN KEY → order.id, NULLABLE | Commande créée après succès |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Date de création |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Date de modification |

### Modèle Logique de Données (MLD)

Le MLD traduit le MCD en schéma relationnel respectant les formes normales (3NF minimum) :

**Normalisation**

- **1NF** : Atomicité des valeurs (pas de valeurs multiples dans une colonne)
- **2NF** : Dépendance fonctionnelle complète (pas de dépendance partielle à la clé)
- **3NF** : Pas de dépendance transitive entre attributs non-clés

**Avantages**

- Évite la redondance des données
- Garantit l'intégrité référentielle
- Facilite les mises à jour et suppressions
- Optimise les performances des requêtes

---

## 6. Maquettage et Design

### Processus de Design

Le design de GreenRoots a été réalisé en plusieurs étapes collaboratives :

1. **Wireframing sur Whimsical** (Toute l'équipe)
   - Définition de l'architecture de l'information
   - Wireframes basse-fidélité mobile et desktop
   - Validation de l'expérience utilisateur

2. **Design System sur Figma** (Maxime G. + équipe)
   - Palette de couleurs inspirée de la nature
   - Typographie et hiérarchie
   - Composants réutilisables
   - Prototypes interactifs

3. **Itérations et Feedback**
   - Reviews en équipe
   - Ajustements basés sur l'accessibilité
   - Tests d'utilisabilité

### Palette de Couleurs

**Couleurs Principales**

- **Vert Principal** : `#2e7d32` - Évoque la nature et la croissance
- **Vert Secondaire** : `#43a047` - Accents et hover states
- **Vert Foncé** : `#1b5e20` - Textes et éléments d'emphase
- **Vert Clair** : `#4caf50` - Backgrounds et highlights

**Couleurs d'Accompagnement**

- **Gris** : `#575a58`, `#888080` - Backgrounds et séparateurs
- **Blanc** : `#ffffff` - Textes sur fonds foncés
- **Noir** : `#000000` - Textes principaux et contrastes

**Dégradés**

- Landing page : `linear-gradient(90deg, #246e15, #063025)`
- Boutons CTA : `linear-gradient(to right, #5c975f, #2e7d32a6)`
- Cards : `linear-gradient(135deg, #567a6b 0%, #54b461 100%)`

### Wireframes

#### Mobile

**Landing Page**
- Logo GreenRoots centré
- Menu burger en haut à droite
- Icône panier et connexion
- Section "Qui sommes-nous ?" avec texte de présentation
- Carrousel de campagnes
- Grille de cartes d'arbres
- Footer avec liens légaux et contact

**Page Inscription**
- Formulaire avec validation
- Champs : Email, Mot de passe, Confirmation
- Bouton "S'inscrire"
- Lien vers la connexion

**Boutique (Nos Arbres)**
- Filtres : par campagne, tri par prix
- Grille de TreeCards en colonne unique
- Bouton "Ajouter au panier" sur chaque carte
- Statistiques : nombre d'arbres plantés

#### Desktop

**Landing Page**
- Navbar horizontale avec logo à gauche
- Liens de navigation : Accueil, Campagnes, Arbres, Contact
- Panier et compte à droite
- Hero section avec grande image et CTA
- Grille de campagnes en colonnes multiples
- Section arbres en grille responsive

**Boutique**
- Filtres en haut avec dropdowns
- Grille responsive : 3-4 colonnes sur grand écran
- Cards avec hover effects
- Barres de progression pour chaque arbre

### Principes UX/UI

**Accessibilité**
- Contraste de couleurs respectant WCAG 2.1 (AA minimum)
- Navigation au clavier
- Attributs ARIA pour les lecteurs d'écran
- Alt texts sur toutes les images

**Responsive Design**
- Mobile-first approach
- Breakpoints : 480px, 768px, 1024px, 1400px
- Images lazy-loading
- Touch-friendly (zones de clic > 44x44px)

**Performance**
- Optimisation des images (WebP, compression)
- Code splitting avec Vite
- Préchargement des ressources critiques
- Animations optimisées avec requestAnimationFrame

---

## 7. Architecture de l'Application

### Architecture Front-End (Svelte)

#### Structure des Dossiers

```
src/
├── lib/
│   ├── assets/
│   │   └── components/
│   │       ├── CampaignCard.svelte
│   │       ├── TreeCard.svelte
│   │       ├── Carousel.svelte
│   │       ├── Navbar.svelte
│   │       ├── Footer.svelte
│   │       ├── ProgressBar.svelte
│   │       ├── Payment.svelte
│   │       ├── OrderCard.svelte
│   │       └── Breadcrumbs.svelte
│   ├── stores/
│   │   ├── auth.js         # Gestion authentification
│   │   ├── cart.js         # Gestion du panier
│   │   └── wishlist.js     # Gestion des favoris
│   └── utils/
│       ├── ErrorHandler.js
│       ├── DateFormatter.js
│       ├── PriceFormatter.js
│       ├── ProgressCampaign.js
│       ├── ProgressTree.js
│       └── stripeClient.js
├── routes/
│   ├── +page.svelte              # Landing page
│   ├── campaigns/
│   │   ├── +page.svelte          # Liste des campagnes
│   │   └── [id]/+page.svelte     # Détail campagne
│   ├── trees/
│   │   ├── +page.svelte          # Boutique (catalogue)
│   │   └── [id]/+page.svelte     # Détail arbre
│   ├── cart/+page.svelte         # Panier
│   ├── auth/
│   │   ├── signup/+page.svelte   # Inscription
│   │   ├── login/+page.svelte    # Connexion
│   │   └── mycount/+page.svelte  # Compte utilisateur
│   ├── orders/+page.svelte       # Historique commandes
│   ├── wishlist/+page.svelte     # Liste de favoris
│   ├── contact/+page.svelte      # Contact
│   └── legal/+page.svelte        # Mentions légales
└── app.css
```

#### Svelte Stores (Gestion d'État)

Les stores Svelte permettent une gestion d'état réactive et partagée entre composants.

**cart.js** (Développé par moi)
- Initialisation depuis localStorage
- `addToCart(tree)` : Ajoute un arbre au panier (incrémente si existe)
- `removeFromCart(id)` : Retire un arbre
- `updateQuantity(id, quantity)` : Modifie la quantité
- `clearCart()` : Vide le panier
- Persistence automatique dans localStorage

**auth.js**
- Gestion de l'authentification
- `isAuthenticated` : Statut de connexion
- `currentUser` : Données de l'utilisateur connecté
- `login()`, `logout()`, `checkAuth()`

**wishlist.js**
- Gestion des favoris
- `isInWishlist(treeId)` : Vérifie si un arbre est en wishlist
- `toggleLocal(treeId)` : Toggle local (non connecté)
- `toggleWithApi(treeId)` : Toggle avec synchronisation API

### Architecture Back-End (Node.js + Express)

#### Pattern MVC (Model-View-Controller)

```
backend/
├── app.js                    # Point d'entrée
├── config/
│   ├── db.js                 # Configuration Sequelize
│   └── stripe.js             # Configuration Stripe
├── models/                   # Modèles de données
│   ├── user.model.js
│   ├── role.model.js
│   ├── tree.model.js
│   ├── specie.model.js
│   ├── campaign.model.js
│   ├── country.model.js
│   ├── order.model.js
│   ├── order-line.model.js
│   ├── payment-intent-draft.model.js
│   └── index.js              # Associations entre modèles
├── controllers/              # Logique métier
│   ├── api/                  # Contrôleurs API publique
│   │   ├── auth.controller.js
│   │   ├── campaign.controller.js
│   │   ├── tree.controller.js
│   │   ├── order.controller.js
│   │   ├── payment.controller.js
│   │   ├── user.controller.js
│   │   ├── wishlist.controller.js
│   │   └── contact.controller.js
│   └── admin/                # Contrôleurs admin
│       ├── admin.controller.js
│       ├── campaign.controller.js
│       ├── tree.controller.js
│       ├── user.controller.js
│       └── order.controller.js
├── services/                 # Services réutilisables
│   ├── tree.service.js
│   ├── campaign.service.js
│   ├── order.service.js
│   └── payment.service.js
├── routes/                   # Définition des routes
│   ├── index.js              # Router principal
│   ├── auth.routes.js
│   ├── campaign.routes.js
│   ├── tree.routes.js
│   ├── order.routes.js
│   ├── payments.route.js
│   ├── payment.webhook.js    # Webhook Stripe
│   ├── user.routes.js
│   ├── wishlist.routes.js
│   ├── contact.routes.js
│   └── admin.routes.js
├── middlewares/
│   ├── auth.middleware.js    # Vérification authentification
│   ├── admin.middleware.js   # Vérification rôle admin
│   ├── errorHandler.js       # Gestion centralisée des erreurs
│   └── rateLimiter.js        # Protection DoS
└── utils/
    ├── httpStatusCodes.js
    └── errors.js             # Classes d'erreurs personnalisées
```

#### Routes API

**Authentification** (`/api/auth`)
- `POST /signup` : Inscription
- `POST /login` : Connexion
- `POST /logout` : Déconnexion
- `GET /check` : Vérification session

**Campagnes** (`/api/campaigns`)
- `GET /` : Liste des campagnes
- `GET /landing` : Campagnes pour landing page (limitées)
- `GET /:id` : Détail d'une campagne
- `GET /:id/trees` : Arbres d'une campagne

**Arbres** (`/api/trees`)
- `GET /` : Liste des arbres (avec filtres et tri)
- `GET /landing` : Arbres pour landing page
- `GET /:id` : Détail d'un arbre

**Commandes** (`/api/orders`)
- `GET /` : Historique des commandes (user connecté)
- `GET /:id` : Détail d'une commande
- `POST /` : Créer une commande

**Paiements** (`/api/payments`)
- `POST /create-intent` : Créer une intention de paiement Stripe
- `POST /webhook` : Webhook Stripe (confirmation)

**Utilisateurs** (`/api/users`)
- `GET /me` : Profil de l'utilisateur connecté
- `PATCH /me` : Modifier le profil

**Wishlist** (`/api/wishlists`)
- `GET /` : Récupérer la wishlist
- `POST /toggle/:treeId` : Ajouter/Retirer un arbre

**Contact** (`/api/contact`)
- `POST /` : Envoyer un message de contact

**Administration** (`/api/admin`)
- CRUD complet sur campagnes, arbres, utilisateurs, commandes
- Statistiques et rapports

#### Middlewares

**Authentication Middleware**
```javascript
// Vérifie que l'utilisateur est connecté
export const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Non authentifié" });
  }
  next();
};
```

**Admin Middleware**
```javascript
// Vérifie que l'utilisateur est admin
export const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.session.user.id, {
    include: { model: Role, as: "role" }
  });
  if (user.role.name !== "admin") {
    return res.status(403).json({ error: "Accès refusé" });
  }
  next();
};
```

**Error Handler**
```javascript
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Erreur serveur",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};
```

**Rate Limiter**
```javascript
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requêtes par IP
  message: "Trop de requêtes, réessayez plus tard"
});
```

### Communication Front-End ↔ Back-End

**Architecture REST API**

- **Protocole HTTP/HTTPS**
- **Format JSON** pour les échanges de données
- **Stateless** : Chaque requête contient toutes les informations nécessaires
- **Sessions** : Gérées côté serveur avec cookies

**Exemple de Flux**

1. **Utilisateur ajoute un arbre au panier**
   - Front : `addToCart(tree)` → Store Svelte
   - Persistence locale dans localStorage
   - Pas d'appel API (panier local)

2. **Utilisateur passe commande**
   - Front : `POST /api/payments/create-intent` avec le panier
   - Back : Crée un PaymentIntent Stripe
   - Retour : `client_secret` pour le front
   - Front : Affiche le formulaire Stripe
   - User : Entre ses infos bancaires
   - Stripe : Traite le paiement
   - Stripe : Envoie un webhook à `/api/payments/webhook`
   - Back : Crée la commande et les lignes de commande
   - Back : Met à jour les stocks d'arbres
   - Front : Redirige vers la page de confirmation

---

## 8. Fonctionnalités Principales

### 1. Landing Page (Ma contribution principale)

**Fichier** : `src/routes/+page.svelte`

**Fonctionnalités** :
- Présentation de l'association GreenRoots
- Section "Qui sommes-nous ?" avec animation au scroll
- Affichage des campagnes en cours
- Sélection d'arbres mis en avant
- Liens vers les pages de détail

**Caractéristiques techniques** :
- **Scroll-based animations** : Utilisation de `requestAnimationFrame` pour des animations fluides
- **Fetch API asynchrone** : Récupération des campagnes et arbres depuis l'API
- **Responsive design** : Breakpoints pour mobile, tablet, desktop
- **SEO optimisé** : Meta tags, structured data (schema.org)

**Code clé** :
```javascript
// Animation au scroll basée sur la position de la section
function computeProgress() {
  const rect = sectionEl.getBoundingClientRect();
  const vh = window.innerHeight || 1;
  const raw = 1 - (rect.top / (vh * 1));
  const eased = Math.pow(clamp01(raw), 0.65);
  sectionEl.style.setProperty('--scroll', String(eased));
}
```

### 2. Catalogue d'Arbres (Boutique) (Ma contribution)

**Fichier** : `src/routes/trees/+page.svelte`

**Fonctionnalités** :
- Affichage de tous les arbres disponibles
- **Filtrage par campagne** : Dropdown pour sélectionner une campagne
- **Tri par prix** : Croissant ou décroissant
- **Statistiques** : Nombre total d'arbres déjà plantés avec animation
- Grille responsive de TreeCards

**Animation du compteur** :
```javascript
function animateTo(to, duration = 1000) {
  const from = Number.isFinite(displayTotal) ? displayTotal : 0;
  const start = performance.now();
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  function tick(now) {
    const progress = Math.min(1, (now - start) / duration);
    displayTotal = Math.round(from + (to - from) * easeOutCubic(progress));
    if (progress < 1) _raf = requestAnimationFrame(tick);
  }

  _raf = requestAnimationFrame(tick);
}
```

### 3. Composant CampaignCard (Ma contribution)

**Fichier** : `src/lib/assets/components/CampaignCard.svelte`

**Fonctionnalités** :
- Affichage d'une campagne de reforestation
- Image de couverture avec le nom du pays
- **Overlay au hover** : Affiche dates, progression, et bouton CTA
- Barre de progression basée sur les arbres vendus
- Métadonnées SEO (schema.org Event)

**Props** :
- `id` : Identifiant de la campagne
- `name` : Nom de la campagne
- `image` : URL de l'image
- `begin_date`, `end_date` : Dates de début et fin
- `trees` : Tableau des arbres associés (pour calcul de progression)
- `country` : Objet pays avec nom

**Calcul de la progression** :
```javascript
// Utilisation d'une fonction utilitaire
$: progress = campaignProgress(trees);

// Dans utils/ProgressCampaign.js
export function campaignProgress(trees) {
  if (!trees || trees.length === 0) return 0;
  const totalStock = trees.reduce((sum, tree) => sum + tree.stock, 0);
  const totalSold = trees.reduce((sum, tree) => sum + (tree.stock - tree.quantity), 0);
  return totalStock > 0 ? Math.round((totalSold / totalStock) * 100) : 0;
}
```

**Hover Effect** :
```css
.overlay {
  opacity: 0;
  transition: opacity .24s ease;
  background: linear-gradient(#ffffff00, gray);
}
.campaign-card:hover .overlay {
  opacity: 1;
}
```

### 4. Composant TreeCard (Ma contribution)

**Fichier** : `src/lib/assets/components/TreeCard.svelte`

**Fonctionnalités** :
- Affichage d'un arbre disponible à l'achat
- Image avec bouton wishlist (cœur)
- Nom de l'arbre et description de l'espèce
- **Mode expandable** : Clic sur "Voir plus" affiche la description complète en popup
- Barre de progression (arbres vendus / stock total)
- Prix formaté
- Boutons "Voir Détails" et "Ajouter au panier"

**Gestion de la wishlist** :
```javascript
async function toggleWishlist(e) {
  e.stopPropagation();
  if (!isAuthenticated) {
    // Si non connecté, stockage local
    wishlist.toggleLocal(id);
    return;
  }
  try {
    // Si connecté, appel API
    await wishlist.toggleWithApi(id);
  } catch (err) {
    console.error("Wishlist API error:", err);
  }
}
```

**Mode Expanded (Popup)** :
```javascript
function toggleDescription() {
  showFullDescription = !showFullDescription;
  document.body.classList.toggle("expanded-mode", showFullDescription);

  // Désactive les interactions avec la grille pendant l'affichage
  const grid = document.querySelector(".trees-grid");
  if (grid) {
    grid.style.pointerEvents = showFullDescription ? "none" : "auto";
  }
}
```

**Styles pour le popup** :
```css
.tree-card.expanded {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1.05);
  width: 90%;
  max-width: 600px;
  z-index: 20;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

:global(body.expanded-mode::before) {
  content: "";
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 5;
  backdrop-filter: blur(3px);
}
```

### 5. Gestion du Panier - cart.js (Ma contribution)

**Fichier** : `src/lib/stores/cart.js`

**Architecture** : Svelte Writable Store avec persistence localStorage

**Fonctions** :

#### `addToCart(tree)`
```javascript
export function addToCart(tree) {
  cart.update((items) => {
    const existing = items.find((item) => item.id === tree.id);
    if (existing) {
      // Incrémente la quantité si l'arbre est déjà dans le panier
      return items.map((item) =>
        item.id === tree.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }
    // Sinon, ajoute le nouvel arbre avec quantité = 1
    return [...items, { ...tree, quantity: 1 }];
  });
}
```

#### `removeFromCart(id)`
```javascript
export function removeFromCart(id) {
  cart.update((items) => items.filter((item) => item.id !== id));
}
```

#### `updateQuantity(id, quantity)`
```javascript
export function updateQuantity(id, quantity) {
  cart.update((items) =>
    items.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, quantity) } // Min 1
        : item
    )
  );
}
```

#### `clearCart()`
```javascript
export function clearCart() {
  cart.set([]);
}
```

**Persistence** :
```javascript
// Synchronisation automatique avec localStorage
cart.subscribe((value) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(value));
  }
});

// Initialisation depuis localStorage
const storedCart =
  typeof localStorage !== "undefined" && localStorage.getItem("cart");
export const cart = writable(storedCart ? JSON.parse(storedCart) : []);
```

**Utilisation dans les composants** :
```javascript
import { addToCart } from "$lib/stores/cart.js";

// Dans un bouton
<button onclick={() => addToCart(tree)}>
  Ajouter au panier 🛒
</button>
```

### 6. Back-End - Contrôleur Tree (Review par moi)

**Fichier** : `controllers/api/tree.controller.js`

```javascript
export const treeController = {

  // Récupère tous les arbres avec filtres optionnels
  async getAllTrees(req, res) {
    const {campaign_id, sort} = req.query;
    const where = {};

    // Filtre par campagne si fourni
    !isNaN(campaign_id) && campaign_id !== "" &&
      (where.campaign_id = Number(campaign_id));

    // Tri par prix ou par défaut (nom)
    let order = [["name", "DESC"]];
    if (sort === "asc") order = [["price", "ASC"]];
    if (sort === "desc") order = [["price", "DESC"]];

    const trees = await getAllTrees(where, order);
    res.status(httpStatusCodes.OK).json({ trees });
  },

  // Récupère 5 arbres pour la landing page
  async getLandingTrees(req, res) {
    const limit = 5;
    const trees = await getAllTrees({}, [["created_at", "DESC"]], limit);
    if (!trees) {
      throw new NotFoundError("No trees found");
    }
    res.status(httpStatusCodes.OK).json({ trees });
  },

  // Récupère les arbres d'une campagne spécifique
  async getTreesByCampaignId(req, res) {
    const trees = await getAllTrees(
      { campaign_id: req.params.id },
      [["id", "DESC"]]
    );
    res.status(httpStatusCodes.OK).json(trees);
  },

  // Récupère le détail d'un arbre
  async getTreeById(req, res) {
    const tree = await getTreeById(req.params.id);
    if (!tree) {
      throw new NotFoundError("Tree not found");
    }
    res.status(httpStatusCodes.OK).json({ tree });
  },
};
```

### 7. Intégration Stripe (Tony S. - Back-End)

**Workflow du paiement** :

1. **Création de l'intention de paiement**
```javascript
// POST /api/payments/create-intent
export async function createPaymentIntent(req, res) {
  const { cart, userId } = req.body;

  // Calcul du montant total
  const amount = cart.reduce((sum, item) =>
    sum + (item.price * item.quantity), 0
  );

  // Création de l'intention Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "eur",
    metadata: { userId, cart: JSON.stringify(cart) }
  });

  // Sauvegarde du draft
  await PaymentIntentDraft.create({
    stripe_payment_intent_id: paymentIntent.id,
    cart_snapshot: cart,
    amount,
    status: "draft",
    user_id: userId || null
  });

  res.json({ clientSecret: paymentIntent.client_secret });
}
```

2. **Webhook de confirmation**
```javascript
// POST /api/payments/webhook
export async function handleWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    // Récupère le draft
    const draft = await PaymentIntentDraft.findOne({
      where: { stripe_payment_intent_id: paymentIntent.id }
    });

    // Crée la commande
    const order = await Order.create({
      order_number: generateOrderNumber(),
      total_price: draft.amount,
      user_id: draft.user_id
    });

    // Crée les lignes de commande
    for (const item of draft.cart_snapshot) {
      await OrderLine.create({
        tree_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        order_id: order.id,
        tree_id: item.id
      });

      // Met à jour le stock
      await Tree.decrement("quantity", {
        by: item.quantity,
        where: { id: item.id }
      });
    }

    // Met à jour le draft
    draft.status = "succeeded";
    draft.order_id = order.id;
    await draft.save();
  }

  res.json({ received: true });
}
```

### 8. Modèles Sequelize (Sebastien A. - Back-End)

**Fichier** : `models/index.js`

**Associations principales** :

```javascript
// User - Role (Many-to-One)
User.belongsTo(Role, {
  foreignKey: { name: "role_id", allowNull: false },
  as: "role",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT"
});

// User - Order (One-to-Many)
User.hasMany(Order, {
  foreignKey: { name: "user_id", allowNull: false },
  as: "orders"
});

// Order - OrderLine (One-to-Many)
Order.hasMany(OrderLine, {
  foreignKey: { name: "order_id", allowNull: false },
  as: "order_lines"
});

// Tree - Specie (Many-to-One)
Tree.belongsTo(Specie, {
  foreignKey: { name: "specie_id", allowNull: false },
  as: "specie",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT"
});

// Tree - Campaign (Many-to-One)
Tree.belongsTo(Campaign, {
  foreignKey: { name: "campaign_id", allowNull: true },
  as: "campaign",
  onUpdate: "CASCADE"
});

// User - Tree (Many-to-Many) - Wishlist
User.belongsToMany(Tree, {
  through: "user_wishlist",
  as: "wishlist",
  foreignKey: "user_id",
  otherKey: "tree_id"
});
```

**Exemple de modèle** : `models/tree.model.js`

```javascript
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Tree = sequelize.define("tree", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  latin_name: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 }
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: "tree",
  timestamps: false
});
```

### 9. Interface d'Administration (Maxime G. - Front-End Admin)

**Fonctionnalités** :
- Dashboard avec statistiques
- CRUD complet sur :
  - Campagnes (création, modification, suppression)
  - Arbres (gestion du catalogue)
  - Utilisateurs (gestion des rôles)
  - Commandes (consultation et suivi)
- Upload d'images pour campagnes et arbres
- Graphiques de ventes et plantations

---

## 9. Sécurité

### Authentification

**Hachage des Mots de Passe**
```javascript
import bcrypt from "bcrypt";

// À l'inscription
const hashedPassword = await bcrypt.hash(password, 10);
await User.create({ mail, password: hashedPassword, ...otherFields });

// À la connexion
const user = await User.findOne({ where: { mail } });
const isValid = await bcrypt.compare(password, user.password);
```

**Sessions Sécurisées**
```javascript
app.use(session({
  name: "sessionId",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,      // Empêche l'accès JavaScript au cookie
    sameSite: "lax",     // Protection CSRF
    maxAge: 1000 * 60 * 60 * 2  // 2 heures
  }
}));
```

### Protection XSS (Cross-Site Scripting)

```javascript
import { xss } from "express-xss-sanitizer";
app.use(xss());  // Nettoie automatiquement req.body, req.params, req.query
```

### Protection CSRF (Cross-Site Request Forgery)

- Cookies `sameSite: "lax"`
- Vérification de l'origine avec CORS

### Rate Limiting (Protection DoS)

```javascript
import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                  // 100 requêtes max par IP
  message: "Trop de requêtes, réessayez plus tard"
});

app.use("/api", globalLimiter);
```

### CORS (Cross-Origin Resource Sharing)

```javascript
app.use(cors({
  origin: "http://localhost:5173",  // Origine autorisée (front-end)
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
```

### Validation des Données

**Côté Front-End**
- Validation HTML5 (required, type="email", pattern, etc.)
- Validation JavaScript avant soumission
- Feedback utilisateur en temps réel

**Côté Back-End**
- Validation avec Sequelize (contraintes de modèle)
- Validation manuelle dans les contrôleurs
- Sanitisation des inputs

### Variables d'Environnement

```bash
# .env
DATABASE_URL=postgresql://user:password@localhost:5432/greenroots
SESSION_SECRET=super_secret_key_change_in_production
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PORT=3000
NODE_ENV=development
```

**Sécurité** :
- `.env` dans `.gitignore`
- Jamais de secrets hardcodés dans le code
- Utilisation de `dotenv` pour charger les variables

### Paiements Sécurisés avec Stripe

**PCI Compliance**
- Aucune donnée de carte stockée côté serveur
- Stripe Elements pour le formulaire de paiement
- Communication cryptée (HTTPS)

**Webhooks Signés**
```javascript
const sig = req.headers["stripe-signature"];
const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
// Vérifie que le webhook provient bien de Stripe
```

---

## 10. Environnement de Développement

### Configuration Locale

**Prérequis** :
- Node.js v18+ et npm
- PostgreSQL 14+
- Git

**Installation Front-End**
```bash
cd projet-greenroots-main
npm install
npm run dev  # Lance le serveur de dev sur http://localhost:5173
```

**Installation Back-End**
```bash
cd ../
npm install
npm run dev  # Lance l'API sur http://localhost:3000
```

**Base de Données**
```bash
# Créer la base de données
createdb greenroots

# Exécuter les migrations Sequelize
npx sequelize-cli db:migrate

# Seed avec des données de test
npx sequelize-cli db:seed:all
```

### Environnement VM

Le projet a été développé et testé entièrement en local sur des **machines virtuelles (VM)** plutôt que d'être déployé en ligne. Cela a permis :

- **Contrôle total** : Configuration personnalisée de l'environnement
- **Collaboration** : Chaque membre de l'équipe avec sa propre VM
- **Tests en conditions réelles** : Simule un environnement de production
- **Sécurité** : Pas d'exposition de données de développement en ligne

**Configuration VM** :
- OS : Ubuntu 22.04 LTS
- RAM : 4 GB minimum
- Disk : 20 GB
- Réseau : Accès internet + réseau local entre VMs

### Workflows de Développement

**Branches Git**
- `main` : Code stable et testé
- `develop` : Branche de développement active
- `feature/*` : Branches de fonctionnalités individuelles
- `bugfix/*` : Corrections de bugs

**Process de Merge**
1. Développement sur branche feature
2. Pull Request vers develop
3. Code review par au moins 2 membres
4. Tests fonctionnels
5. Merge après validation

**Commandes Git Courantes**
```bash
# Créer une nouvelle branche
git checkout -b feature/nom-fonctionnalite

# Commiter les changements
git add .
git commit -m "feat: description de la fonctionnalité"

# Pousser vers le remote
git push origin feature/nom-fonctionnalite

# Mettre à jour depuis develop
git checkout develop
git pull origin develop
git checkout feature/nom-fonctionnalite
git merge develop
```

### Scripts NPM

**Front-End** (`projet-greenroots-main/package.json`)
```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

**Back-End** (`package.json`)
```json
{
  "scripts": {
    "dev": "nodemon app.js",
    "start": "node app.js",
    "lint": "eslint .",
    "test": "jest"
  }
}
```

---

## 11. Exemples de Code

### Front-End : Composant Réactif avec Animation

**Extrait de `TreeCard.svelte`** (Ma contribution)

```svelte
<script>
  import { onMount, onDestroy } from "svelte";
  import { treeProgress } from "../../utils/ProgressTree.js";
  import { addToCart } from "$lib/stores/cart.js";
  import { wishlist, isInWishlist } from "$lib/stores/wishlist.js";

  export let tree;
  let { id, name, image, price, stock, quantity } = tree;
  const wished = isInWishlist(id);
  let showFullDescription = false;

  // Réactivité : recalcule automatiquement quand stock ou quantity changent
  $: progress = treeProgress(stock, quantity);

  function toggleDescription() {
    showFullDescription = !showFullDescription;
    document.body.classList.toggle("expanded-mode", showFullDescription);
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      showFullDescription = false;
      document.body.classList.remove("expanded-mode");
    }
  }

  onMount(() => {
    document.addEventListener("keydown", onKeydown);
  });

  onDestroy(() => {
    document.removeEventListener("keydown", onKeydown);
    document.body.classList.remove("expanded-mode");
  });
</script>

<article class="tree-card {showFullDescription ? 'expanded' : ''}">
  <img src={image} alt={name} class="tree-img" />

  <button
    class="wish-btn"
    aria-pressed={$wished}
    onclick={() => wishlist.toggleLocal(id)}
  >
    <svg class="heart" viewBox="0 0 24 24">
      <path d="..." class={$wished ? "fill" : "stroke"} />
    </svg>
  </button>

  <div class="tree-info">
    <h3 class="tree-name">{name}</h3>
    {#if tree?.specie?.description}
      <p class="tree-description">
        {showFullDescription ? tree.specie.description : truncate(tree.specie.description)}
      </p>
      <button onclick={toggleDescription}>
        {showFullDescription ? "Voir moins" : "Voir plus"}
      </button>
    {/if}
  </div>

  <div class="btn-container">
    <a href={`/trees/${id}`} class="btn btn-outline">Voir Détails</a>
    <button onclick={() => addToCart(tree)} class="btn btn-fill">
      Ajouter 🛒
    </button>
  </div>
</article>

<style>
  .tree-card {
    background: linear-gradient(0deg, #cac8c8 25%, #575a58 100%);
    border-radius: 18px;
    overflow: hidden;
    transition: all 0.25s ease;
  }

  .tree-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  .tree-card.expanded {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1.05);
    z-index: 20;
  }
</style>
```

### Back-End : Contrôleur avec Gestion d'Erreurs

**Extrait de `order.controller.js`** (Tony S. & Sebastien A.)

```javascript
import { httpStatusCodes, NotFoundError, ValidationError } from "../../utils/index.js";
import { Order, OrderLine, Tree, User } from "../../models/index.js";

export const orderController = {

  // Récupère l'historique des commandes de l'utilisateur connecté
  async getUserOrders(req, res) {
    const userId = req.session.user.id;

    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [
        {
          model: OrderLine,
          as: "order_lines",
          include: [
            {
              model: Tree,
              as: "tree",
              attributes: ["id", "name", "image"]
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]]
    });

    res.status(httpStatusCodes.OK).json({ orders });
  },

  // Crée une nouvelle commande
  async createOrder(req, res) {
    const { cart } = req.body;
    const userId = req.session.user?.id;

    // Validation
    if (!cart || cart.length === 0) {
      throw new ValidationError("Le panier est vide");
    }

    // Vérification des stocks
    for (const item of cart) {
      const tree = await Tree.findByPk(item.id);
      if (!tree) {
        throw new NotFoundError(`Arbre ${item.id} introuvable`);
      }
      if (tree.quantity < item.quantity) {
        throw new ValidationError(
          `Stock insuffisant pour ${tree.name}. Disponible: ${tree.quantity}`
        );
      }
    }

    // Calcul du total
    const total_price = cart.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    // Transaction pour garantir l'atomicité
    const transaction = await sequelize.transaction();

    try {
      // Création de la commande
      const order = await Order.create({
        order_number: generateOrderNumber(),
        total_price,
        user_id: userId
      }, { transaction });

      // Création des lignes de commande et mise à jour des stocks
      for (const item of cart) {
        await OrderLine.create({
          tree_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          order_id: order.id,
          tree_id: item.id
        }, { transaction });

        await Tree.decrement("quantity", {
          by: item.quantity,
          where: { id: item.id },
          transaction
        });
      }

      await transaction.commit();

      res.status(httpStatusCodes.CREATED).json({
        order,
        message: "Commande créée avec succès"
      });

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};

// Génère un numéro de commande unique
function generateOrderNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `GR-${timestamp}-${random}`;
}
```

### Utilitaire : Formatage des Prix

**Fichier** : `src/lib/utils/PriceFormatter.js`

```javascript
/**
 * Convertit un prix en centimes vers un format d'affichage en euros
 * @param {number} priceInCents - Prix en centimes
 * @returns {string} Prix formaté (ex: "12,50 €")
 */
export function formatPriceToDisplay(priceInCents) {
  if (typeof priceInCents !== "number") return "0,00 €";

  const euros = priceInCents / 100;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR"
  }).format(euros);
}

/**
 * Convertit un prix en euros vers des centimes
 * @param {number} priceInEuros - Prix en euros
 * @returns {number} Prix en centimes
 */
export function formatPriceToStore(priceInEuros) {
  return Math.round(priceInEuros * 100);
}
```

**Utilisation** :
```svelte
<script>
  import { formatPriceToDisplay } from "../../utils/PriceFormatter.js";

  export let tree;
  $: formattedPrice = formatPriceToDisplay(tree.price);
</script>

<p class="tree-price">
  Prix unitaire : <span>{formattedPrice}</span>
</p>
```

---

## 12. Conclusion

### Réalisations

Le projet **GreenRoots** a permis de mettre en œuvre une plateforme e-commerce complète dédiée à la reforestation, intégrant :

**Aspects Techniques** :
- Architecture front-end moderne avec **Svelte/SvelteKit**
- API REST robuste avec **Node.js/Express**
- Base de données relationnelle **PostgreSQL** avec ORM Sequelize
- Intégration de paiement sécurisée avec **Stripe**
- Design responsive et accessible

**Aspects Organisationnels** :
- Travail en équipe avec méthodologie **Agile/Scrum**
- Collaboration via Git/GitHub avec code reviews
- Coordination entre développeurs front-end et back-end
- Respect des délais et des objectifs

**Compétences Développées** :
- Développement full-stack JavaScript
- Modélisation de base de données relationnelle
- Gestion d'état avec Svelte stores
- Sécurité web (authentification, XSS, CSRF, rate limiting)
- Intégration d'APIs tierces (Stripe)
- Design UI/UX et responsive design

### Contributions Personnelles

En tant que **Scrum Master et Développeur Full-Stack**, mes contributions principales ont été :

**Gestion de Projet** :
- Animation des cérémonies Scrum (daily stand-ups, sprint reviews)
- Coordination entre les membres de l'équipe
- Résolution des blocages techniques
- Priorisation des user stories

**Développement Front-End** :
- **Landing page** : Page d'accueil avec animations au scroll
- **Pages boutique** : Catalogue d'arbres avec filtres et tri
- **Composants CampaignCard et TreeCard** : Cartes réutilisables avec hover effects et animations
- **Store cart.js** : Gestion complète du panier avec persistence localStorage

**Support Technique** :
- **Review du code back-end** : Validation de la logique métier et des contrôleurs
- **Aide à l'équipe** : Support technique sur tous les aspects du projet
- **Résolution de bugs** : Debugging front-end et back-end

### Difficultés Rencontrées et Solutions

**1. Gestion des Stocks en Temps Réel**
- **Problème** : Risque de survente si plusieurs utilisateurs achètent simultanément
- **Solution** : Transactions SQL avec `FOR UPDATE` et vérifications avant validation

**2. Synchronisation Panier Local / API**
- **Problème** : Fusion du panier local avec le panier serveur à la connexion
- **Solution** : Store Svelte avec logique de merge côté client

**3. Webhooks Stripe en Local**
- **Problème** : Impossible de recevoir les webhooks Stripe sur localhost
- **Solution** : Utilisation de Stripe CLI avec forwarding vers localhost

**4. Performances des Animations**
- **Problème** : Animations saccadées sur les cards au scroll
- **Solution** : Utilisation de `requestAnimationFrame` et `will-change` CSS

**5. SEO avec Svelte**
- **Problème** : Contenu chargé dynamiquement non indexé
- **Solution** : SvelteKit avec SSR + meta tags dynamiques

### Perspectives d'Évolution

**Fonctionnalités Futures** :
- **Certification de plantation** : Génération de certificats PDF pour chaque achat
- **Espace Partenaire** : Interface dédiée aux entreprises et collectivités
- **Dashboard utilisateur** : Visualisation de l'impact environnemental (CO2 capturé, etc.)
- **Notifications** : Suivi des campagnes par email/push
- **Blog** : Articles sur la reforestation et la biodiversité
- **Multilingue** : Support anglais et espagnol

**Améliorations Techniques** :
- **Tests automatisés** : Tests unitaires (Jest) et E2E (Playwright)
- **CI/CD** : Déploiement automatique avec GitHub Actions
- **Monitoring** : Sentry pour le tracking d'erreurs
- **Performance** : Lazy loading des images, service workers
- **Déploiement** : Mise en production sur Vercel (front) + Railway (back)

### Retour d'Expérience

Ce projet a été une expérience extrêmement enrichissante, permettant de mettre en pratique l'ensemble des compétences acquises durant la formation DWWM. Le travail en équipe avec une vraie méthodologie Agile a été particulièrement formateur.

**Points Positifs** :
- Excellente cohésion d'équipe
- Communication fluide et entraide constante
- Respect des bonnes pratiques (clean code, conventions de nommage)
- Fierté du résultat final : une application fonctionnelle et esthétique

**Apprentissages** :
- Gestion de projet Agile en situation réelle
- Importance de la communication dans un projet d'équipe
- Compromis entre perfection technique et contraintes de temps
- Valeur du code review et du partage de connaissances

**Satisfaction** :
Avoir contribué à un projet avec une dimension environnementale positive a été motivant. GreenRoots démontre que le développement web peut avoir un impact concret sur des causes importantes comme la reforestation.

---

## Annexes

### Technologies Utilisées

**Front-End**
- Svelte 4.2.0
- SvelteKit 2.0.0
- Vite 5.0.0

**Back-End**
- Node.js 18.x
- Express 4.18.0
- Sequelize 6.35.0
- PostgreSQL 14.x

**Librairies Principales**
- bcrypt 5.1.0
- stripe 14.0.0
- express-session 1.17.0
- cors 2.8.5
- dotenv 16.0.0

### Liens Utiles

- **Documentation Svelte** : https://svelte.dev/docs
- **Documentation SvelteKit** : https://kit.svelte.dev/docs
- **Documentation Express** : https://expressjs.com/
- **Documentation Sequelize** : https://sequelize.org/docs/v6/
- **Documentation Stripe** : https://stripe.com/docs
- **PostgreSQL** : https://www.postgresql.org/docs/

### Contact

**Équipe GreenRoots**
- Email : contact@greenroots.dev
- GitHub : github.com/greenroots-project

---

**Document rédigé par l'équipe GreenRoots**
**Formation : Développeur Web et Web Mobile (DWWM)**
**Date : 2025**

---

*Ce document présente le projet GreenRoots réalisé dans le cadre de la formation DWWM. Il reflète le travail collaboratif d'une équipe de 5 développeurs sur une période de plusieurs semaines.*
