# LPC-SvelteKit

Application web moderne construite avec SvelteKit 2.0 et TypeScript.

## 🚀 Technologies

- **Frontend**: SvelteKit 2.0, TailwindCSS, DaisyUI
- **Backend**: SvelteKit Server, Prisma ORM
- **Auth**: Auth.js (anciennement NextAuth)
- **Base de données**: PostgreSQL (via Prisma)
- **Éditeur**: EditorJS
- **Upload**: UploadThing
- **Validation**: Zod
- **Notifications**: French Toast

## 📦 Installation

```bash
# Cloner le repo
git clone
cd lpc-sveltekit

# Installer les dépendances
npm install

# Configuration de la base de données
# Créez un fichier .env avec vos variables d'environnement
```

## 🔧 Variables d'Environnement

Créez un fichier `.env` à la racine du projet:

````env
DATABASE_URL="votre-url-postgresql"
JWT_SECRET_Key
AUTH_SECRET
GOOGLE_ID
GOOGLE_SECRET
UPLOADTHING_TOKEN
NODEMAILER_USER
NODEMAILER_PASS


## 🏃‍♂️ Développement

```bash
# Lancer en mode développement
npm run dev

# Vérification des types
npm run check

# Linting et formatage
npm run lint
npm run format

# Build pour production
npm run build
````

## 🌱 Base de données

```bash
# Générer le client Prisma et appliquer les migrations
npm run postinstall

# Seed la base de données
npm run seed
```

## 📝 Scripts Disponibles

- `dev`: Lance le serveur de développement
- `build`: Build pour production
- `preview`: Preview de la build
- `check`: Vérifie les types TypeScript
- `format`: Formate le code avec Prettier
- `lint`: Vérifie le style du code
- `seed`: Seed la base de données
- `postinstall`: Génère le client Prisma et applique les migrations

## 🛠️ Stack Technique Détaillée

### Frontend

- SvelteKit 2.0
- TailwindCSS avec plugins forms et typography
- DaisyUI pour les composants UI
- EditorJS pour l'édition de contenu riche

### Backend

- SvelteKit Server
- Prisma ORM
- Auth.js pour l'authentification
- Nodemailer pour les emails
- Bcrypt pour le hashing
- JWT pour les tokens

### Outils de Développement

- TypeScript
- ESLint
- Prettier
- Vite
- JSCPD pour la détection de code dupliqué

## 📈 Analytics

Intégration de Vercel Analytics pour le suivi des performances.

## 🔒 Sécurité

- Authentification via Auth.js
- Hashing des mots de passe avec Bcrypt
- Validation des données avec Zod
- Sanitization HTML avec DOMPurify

## 🚀 Déploiement

Le projet est configuré pour un déploiement sur Vercel avec l'adaptateur `@sveltejs/adapter-vercel`.
