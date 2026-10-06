# CAURIS GROUP INTERNATIONAL — Site Web Corporate

Site vitrine corporate de **CAURIS GROUP INTERNATIONAL**.

## Stack normée

- Next.js 13.3.0 / React 18.2.0 / TypeScript 5.0.4
- Styles : `src/styles/` (globals.css, sintec.css, responsive.css)
- Pages : `src/pages/` (index, about-us, services, projects, blog, single-blog, contact)
- Composants : `src/components/` (Header, MainMenu, TopNav, HomeBanner, About, Services, Portfolio, Stats, Testimonials, Blog, ContactUs, Footer, etc.)
- Hooks : `src/hooks/`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Conventions

- Nom dossier : `cauris-group-international-site-web-corporate`
- Conversations projet : `./conversations/` (fichiers datés `AAAA-MM-JJ-sujet.md`, mis à jour au fil de l'eau)
- Branding : remplacer toute mention "Sintec" par "CAURIS GROUP INTERNATIONAL" dans UI, `_document.tsx`, Footer, Header.
- Langue : FR par défaut pour le contenu corporate.

## À normaliser ensuite

- [ ] `_document.tsx` : title / meta / favicon CAURIS
- [ ] `Header.tsx`, `Footer.tsx`, `MainMenu.tsx` : nom, logo, liens, contacts
- [ ] `public/` : logo + favicon CAURIS
- [ ] Contenus pages : FR corporate
