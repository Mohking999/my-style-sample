# MyStyle — Algerian Fashion E-commerce (ماي ستايل)

MyStyle est une boutique de mode en ligne contemporaine pour l'Algérie, inspirée de l'esthétique éditoriale minimaliste (Zara, Pull&Bear) avec une identité algérienne affirmée : prêt-à-porter urbain, pièces habillées, et haute couture traditionnelle (Karakou algérois, Chedda de Tlemcen, Blouza d'Oran, Gandoura de Constantine, Burnous en poil de chameau).

---

## 1. Choix Technologiques & Justifications

- **Frontend :**
  - **React 18 + TypeScript (Strict) :** Typage statique rigoureux pour l'ensemble des entités e-commerce, formulaires et états.
  - **Vite :** Démarrage instantané, rechargement à chaud (HMR) ultra-rapide et bundle optimisé.
  - **Tailwind CSS :** Tokens sur mesure (vert forêt, blanc cassé, or artisanal, rouge algérien subtil pour les soldes) et classes logiques (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`) pour le support bidirectionnel LTR / RTL.
  - **i18next & react-i18next :** Support trilingue (Français par défaut, Arabe complet avec RTL automatique, Anglais).
  - **TanStack Query :** Cache et synchronisation dynamique des données (produits, panier, commandes, wilayas).
  - **Lucide Icons :** Icônes modernes et accessibles.
  - **Canvas Confetti :** Célébration visuelle lors de la confirmation d'une commande.

- **Backend & Base de Données :**
  - **Node.js + Express :** API REST sécurisée avec validation serveur, protection CORS, cookies HttpOnly et contrôle d'accès par rôles (client, tailleur, staff, admin).
  - **Prisma ORM + SQLite :** Utilisé en développement pour garantir une autonomie complète sans nécessiter de serveur de base de données externe ou identifiants préconfigurés. 100% prêt pour PostgreSQL en production en changeant simplement le provider dans `schema.prisma` et la variable `DATABASE_URL`.
  - **Bcrypt & JWT :** Hachage cryptographique des mots de passe et gestion sécurisée des sessions.

---

## 2. Fonctionnalités Implémentées

### 🛍️ Catalogue & Navigation
- **Page d'accueil éditoriale :** Hero banner majestueux, 4 campagnes saisonnières (*Algérie Moderne, Élégance Traditionnelle, Mariage & Cérémonie, Essentiels Urbains*), nouveaux arrivages, sélection tendance et mise en avant des maîtres artisans de nos régions.
- **Grille de produits & Filtres dans l'URL :** Filtres par catégorie, type (*Prêt-à-porter* vs *Sur-Mesure*), tailles, couleurs, fourchette de prix en DZD et disponibilité en stock. Tri par nouveauté, popularité ou prix. Tous les filtres sont conservés dans l'URL pour un partage aisé.
- **Fiche produit détaillée :** Galerie photos 4:5 avec miniatures, sélection de taille et couleur, état du stock en temps réel (*En stock, Dernières pièces, Rupture*), modal guide des tailles complet, pièces similaires.
- **Recherche interactive :** Barre de recherche avec mots-clés fréquents (*Karakou, Burnous, Chedda, Lin, etc.*) et affichage instantané.

### 🇩🇿 Spécificités Algériennes & Commerce
- **Les 58 Wilayas d'Algérie :** Base complète des 58 wilayas avec calcul automatique des tarifs de livraison à domicile ou en point relais (Stop Desk).
- **Validation du téléphone algérien :** Prise en charge des formats `05`, `06`, `07`, `+213` et `213`.
- **Paiement à la livraison (Cash on Delivery) :** Sélectionné par défaut, permettant au client de vérifier son colis avant paiement.
- **Suivi de colis & Historique :** Page de suivi en direct (`/orders/track`) avec stepper visuel (`pending → confirmed → preparing → shipped → delivered`) et bordereau d'expédition imprimable.
- **Codes promotionnels :** Validation stricte côté serveur avec calcul en DZD (`SAHRA10` pour -10%, `BIENVENUE` pour -1 000 DA).

### ✂️ Confection Sur-Mesure (Made-to-Order)
- Formulaire dédié pour les pièces d'apparat traditionnelles : mensurations en centimètres (poitrine, taille, hanches, longueur), choix de broderie (*Majboud, Fetla, Perlage*), tissu et date souhaitée.
- Workflow complet d'atelier :
  `submitted → quote_sent → accepted → in_production → ready → shipped → delivered`.
- L'artisan ou l'administrateur envoie un devis chiffré avec délai en jours ; le client l'accepte ou le décline directement depuis son compte.

### 🛡️ Tableau de Bord Administration (`/admin`)
- **Vue d'ensemble :** Chiffre d'affaires en DZD, commandes par statut, alertes stock faible, demandes d'atelier récentes.
- **Catalogue :** Création, modification et suppression de produits avec variantes.
- **Commandes :** Changement de statut, historique d'expédition et impression de bordereaux.
- **Atelier Sur-Mesure :** Établissement de devis et passage en confection.
- **Gestion du stock :** Alertes de réapprovisionnement et ajustement rapide en un clic.
- **Répertoire clients :** Historique d'achat et dépenses cumulées.
- **Gestion des wilayas :** Modification des frais d'expédition pour chacune des 58 wilayas.
- **Codes promo :** Création et suivi des codes de réduction.

---

## 3. Comptes Démo Préconfigurés

| Rôle | Email | Mot de passe | Description |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@mystyle.dz` | `admin1234` | Directeur — Accès total au dashboard admin |
| **Tailleur** | `tailor@mystyle.dz` | `tailor1234` | Maître artisan — Gestion de l'atelier et devis |
| **Client** | `client@mystyle.dz` | `client1234` | Leila Mansouri — Commandes et demandes test |

*(Des boutons de connexion rapide en 1 clic sont également disponibles sur la page de connexion).*

---

## 4. Démarrage Local

### Prérequis
- Node.js version 18+ (testé avec succès sous Node.js v24)
- npm

### Installation & Lancement
```bash
# 1. Cloner ou ouvrir le projet
cd "d:/my style"

# 2. Installer les dépendances (déjà fait si présent)
npm install

# 3. Synchroniser la base de données et initialiser les données
npx prisma db push
npm run seed

# 4. Lancer l'application complète (Frontend + API Backend)
npm run dev:all
```
L'application sera accessible sur :
- **Boutique Frontend :** [http://localhost:5173](http://localhost:5173)
- **API Backend :** [http://localhost:5000](http://localhost:5000)
- **Tableau de Bord Admin :** [http://localhost:5173/admin](http://localhost:5173/admin)

### Tests Automatisés
Pour exécuter la suite de tests unitaires et le test de bout en bout (E2E) :
```bash
npm test
```

---

## 5. Déploiement Backend sur Cloudflare (Workers + D1)

Le backend a été entièrement déployé sur l'infrastructure **Cloudflare Workers** avec base de données distribuée **Cloudflare D1** :

- **API Live Cloudflare Workers :** [https://mystyle-api.djebiriabdrazak.workers.dev](https://mystyle-api.djebiriabdrazak.workers.dev)
- **Base de données Cloudflare D1 :** `mystyle-db` (ID: `bac50a88-9b01-468c-86fc-8de7051cf092`)
- **Framework Edge :** Hono (`hono`) avec support Node.js compat (`crypto`, `buffer`, etc.)
- **Données en production :** 42 pièces de mode, les 58 wilayas algériennes, 9 catégories, codes promos et comptes de démonstration.

### Commandes Cloudflare Wrangler :
```bash
# Tester le worker en local avec émulation D1
npm run worker:dev

# Déployer les mises à jour sur Cloudflare Workers
npm run deploy:worker

# Exécuter les migrations SQL sur la base D1 distante
npm run d1:migrate
```

---

## 6. Hypothèses & Limitations Connues

1. **Architecture Bi-Mode :** L'application supporte à la fois le serveur local Node.js + Express + Prisma SQLite (`npm run server`) et le déploiement Cloudflare Workers (Hono) + Cloudflare D1 (`npm run deploy:worker`).
2. **Paiement CIB / Edahabia :** Conformément à l'énoncé, le paiement à la livraison en espèces (COD) est actif par défaut. L'intégration de la passerelle SATIM / CIB pour le paiement par carte est représentée dans l'interface et prête pour l'API bancaire de production.
3. **Images :** Les visuels utilisent des photographies éditoriales haute résolution 4:5 sans logo de marque concurrente, hébergées via CDN sécurisé. En production Cloudflare Workers, Cloudflare R2 peut être configuré pour le stockage d'images par les administrateurs.

