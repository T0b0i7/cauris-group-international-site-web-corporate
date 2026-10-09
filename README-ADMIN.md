# Backoffice Cauris Group — Documentation

Console d'administration du site vitrine `cauris-group-international-site-web-corporate`.
Stack : Next.js 13.3 / React 18 / TypeScript 5, export statique, persistance navigateur `localStorage`.

## Accès

```bash
npm run dev
```

Ouvrir `http://localhost:3000/admin/login`

Comptes de démonstration :
| Email | Mot de passe | Droits |
|---|---|---|
| `admin@cauris.group` | `Cauris2026!` | Tout : contenus, messages, utilisateurs, paramètres, journal, import/export |
| `editeur@cauris.group` | `Editeur2026!` | Écriture contenus, messages, newsletter. Sans utilisateurs, paramètres, journal |
| `lecteur@cauris.group` | `Lecteur2026!` | Lecture seule, écriture bloquée |

Session 8 h dans `cauris_admin_session_v1`. Déconnexion via sidebar. Routes `/admin/*` avec `noindex`. En production statique : `https://domaine.tld/admin/login`.

## Architecture

```
src/lib/admin/types.ts         Modèles : Article, Projet, ServiceItem, Temoignage, MessageContact, Abonne, Utilisateur, Parametres, AuditEntry, AdminDB
src/lib/admin/seed.ts          Jeu initial : 3 articles, 4 projets, 6 services, 3 témoignages, 2 messages, 2 abonnés, 3 utilisateurs, paramètres, audit vide
src/lib/admin/AdminContext.tsx Provider : chargement localStorage, login/logout, can(write/admin), saveDB + audit auto, export/import JSON, reset, Rules, slugify, uid, isEmail
src/components/Admin/AdminLayout.tsx Coquille : sidebar 288 px numérotée 01-10, 4 groupes, topbar sticky, garde session, badge rôle
src/styles/admin.css            Design system : encre #0d1930, papier #f4f1e8, ambre #f5b301, serif display + sans, cartes ombre dure, tables, formulaires, login split-screen
src/pages/admin/login.tsx       Connexion : panneau marque, preuves 120+/6/48h, boutons rôles 1-clic, afficher mot de passe
src/pages/admin/index.tsx       Tableau de bord : 6 compteurs, sauvegarde/restauration
src/pages/admin/articles.tsx     CRUD articles
src/pages/admin/projets.tsx      CRUD projets
src/pages/admin/services.tsx    Activation + ordre services
src/pages/admin/temoignages.tsx Modération témoignages
src/pages/admin/messages.tsx    Pipeline messages
src/pages/admin/newsletter.tsx  Abonnés
src/pages/admin/utilisateurs.tsx Comptes (admin seul)
src/pages/admin/parametres.tsx  Coordonnées + chiffres (admin seul)
src/pages/admin/audit.tsx        Journal 500 entrées (admin seul)
```

Clés navigateur : `cauris_admin_db_v1`, `cauris_admin_session_v1`.

## Modules

### Tableau de bord `/admin`
Compteurs articles publiés, projets, messages nouveaux, abonnés actifs, témoignages en attente, utilisateurs. Export JSON vers `cauris-backup.json`, import avec validation des clés, réinitialisation seed réservée admin.

### Articles `/admin/articles`
Champs : titre FR/EN, slug auto, catégorie `entreprise|chantier|conseil|import-export`, statut `brouillon|publie|archive`, date, image `/images/...`, extraits, contenus FR/EN, auteur, vues. Recherche plein texte. Suppression refusée si `publie`.

### Projets `/admin/projets`
Champs : titre, catégorie `buildings|offices|rebuild|archi`, statut `brouillon|en_cours|publie|archive`, lieu, client, début, fin, budget FCFA, image, descriptions FR/EN, vedette. Le site public affiche `publie + en_cours`.

### Services `/admin/services`
Codes fixes `s1..s6`. Édition titres/descriptions, activation on/off, ordre ↑↓. Seuls les actifs ordonnés remontent.

### Témoignages `/admin/temoignages`
Champs : nom, message, note 1-5. Création en `en_attente`. Actions valider/rejeter. Seuls `valide` affichés sur le site.

### Messages `/admin/messages`
Alimenté par le formulaire public `ContactUs` avec validation. Filtres `tous|nouveau|en_cours|traite|clos`. Changement de statut, assignation agent, suppression au titre du droit à l'effacement.

### Newsletter `/admin/newsletter`
Inscription avec contrôle unicité insensible à la casse, `consentRgpd=true`. Désinscrire/réactiver, suppression définitive.

### Utilisateurs `/admin/utilisateurs`
Création nom, email unique, rôle, mot de passe 8 caractères min. Activation on/off. Désactivé = connexion impossible. Matrice : lecteur lecture seule, éditeur sans users/paramètres/journal, admin tout.

### Paramètres `/admin/parametres`
Nom société, slogans FR/EN, adresse, BP, tél 1/2, email société, horaires semaine/samedi, projets réalisés, pôles 1-20, engagement qualité.

### Journal `/admin/audit`
Chaque `saveDB` et `login` ajoute `{date, utilisateur, entite, action, detail}`. Conservé à 500, affiché anti-chronologique.

## Règles de gestion appliquées

Article : titre FR/EN 5 caractères min, slug unique, catégorie et statut dans listes fermées, date requise, contenu FR 20 caractères min, image requise. Projet : titre 5 min, catégorie/statut fermés, `dateDebut <= dateFin`, `budget >= 0`. Témoignage : nom 2 min, message 10 min, note 1-5. Message : nom 2 min, email regex, objet 3 min, message 10 min. Utilisateur/newsletter : email regex + unicité, mot de passe 8 min. Paramètres : email valide, projets >= 0, pôles 1-20. Sécurité : suppression article/projet publié interdite sans archivage, pages utilisateurs/paramètres/journal réservées admin, lecteur bloqué en écriture via `can()`.

## Site public branché

`Blog.tsx` lit les 3 derniers `publie` FR/EN avec repli statique. `Portfolio.tsx` lit `publie + en_cours` avec repli. `ContactUs.tsx` valide via `Rules.message` puis insère en `nouveau` + audit `create-site`. `_app.tsx` enveloppe `AdminProvider > LanguageProvider` + `admin.css`.

## Design

Direction `Carnet de chantier éditorial` : encre dominante, ambre signal, papier chaud. Display serif Fraunces/Georgia, texte Space Grotesk/system-ui, mono pour numéros et micro-labels. Sidebar bleu encre à trame blueprint, liens numérotés, actif ambre. Cartes ivoire bordure 2 px encre + ombre 6 px. Tables en-tête encre. Un seul mouvement d'entrée `rise`. Focus visible ambre. Contrastes conformes, responsive 960 px : sidebar empilée, login 1 colonne, formulaires 1 colonne.

## Limites et passage en production

Démo sans backend : mots de passe en clair dans `localStorage`, pas de chiffrement, pas de multi-poste. Pour production : brancher API + base, hacher Argon2/bcrypt, JWT httpOnly, RBAC serveur, audit immuable, upload d'images, pagination serveur, tests.
