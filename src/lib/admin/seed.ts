import { AdminDB } from './types';

const now = new Date().toISOString();

// Images open source Unsplash (licence libre) - construction / BTP
const U1 = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80';
const U2 = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80';
const U3 = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80';
const U4 = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
const A1 = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=200&q=80';
const A2 = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80';
const A3 = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80';

export const seedDB: AdminDB = {
  articles: [
    {
      id: 'art-1', slug: 'forage-eau-potable-bassila', titreFr: 'Forage d’eau potable à Bassila : un chantier Cauris',
      titreEn: 'Drinking water borehole in Bassila: a Cauris worksite', categorie: 'chantier', statut: 'publie',
      datePublication: '2025-05-12', image: U1,
      extraitFr: 'Adduction d’eau complète à Bassila.', extraitEn: 'Full water supply in Bassila.',
      contenuFr: 'Étude du site, foration, équipement de pompage et raccordement. Chaque étape est documentée et garantie.',
      contenuEn: 'Site survey, drilling, pumping equipment and connection. Every step documented and guaranteed.',
      auteur: 'Admin', vues: 214, createdAt: now, updatedAt: now,
    },
    {
      id: 'art-2', slug: 'renovation-batiments-conseils', titreFr: 'Rénovation de bâtiments : nos conseils avant de vous lancer',
      titreEn: 'Building renovation: our advice before you start', categorie: 'conseil', statut: 'publie',
      datePublication: '2025-04-28', image: U2,
      extraitFr: 'Diagnostic, matériaux, réception des travaux.', extraitEn: 'Diagnosis, materials, handover.',
      contenuFr: 'Un diagnostic précis du besoin, des matériaux de qualité suivis de près, et une réception en présence du client.',
      contenuEn: 'Precise needs assessment, closely monitored quality materials, and handover in client presence.',
      auteur: 'Admin', vues: 132, createdAt: now, updatedAt: now,
    },
    {
      id: 'art-3', slug: 'import-export-approvisionnements', titreFr: 'Import-export : sécuriser vos approvisionnements au Bénin',
      titreEn: 'Import-export: securing your supplies in Benin', categorie: 'import-export', statut: 'brouillon',
      datePublication: '2025-04-10', image: U3,
      extraitFr: 'Sourcing international fiable.', extraitEn: 'Reliable international sourcing.',
      contenuFr: 'Sourcing international, importation et exportation de marchandises en toute fiabilité avec suivi documentaire.',
      contenuEn: 'International sourcing, reliable import and export of goods with document tracking.',
      auteur: 'Editeur', vues: 0, createdAt: now, updatedAt: now,
    },
  ],
  projets: [
    { id: 'prj-1', titre: 'Chantier Cauris, Bénin - Bâtiment', categorie: 'buildings', statut: 'publie', lieu: 'Bassila, Bénin', client: 'Particulier', dateDebut: '2025-01-10', dateFin: '2025-03-20', budget: 15000000, image: U4, descriptionFr: 'Construction bâtiment R+1.', descriptionEn: 'R+1 building construction.', vedette: true, createdAt: now, updatedAt: now },
    { id: 'prj-2', titre: 'Adduction eau - Infrastructure', categorie: 'offices', statut: 'en_cours', lieu: 'Bassila', client: 'Collectivité', dateDebut: '2025-04-01', dateFin: '2025-07-30', budget: 8500000, image: U1, descriptionFr: 'Forage + réseau.', descriptionEn: 'Borehole + network.', vedette: false, createdAt: now, updatedAt: now },
    { id: 'prj-3', titre: 'Rénovation bureaux', categorie: 'rebuild', statut: 'publie', lieu: 'Parakou', client: 'Entreprise', dateDebut: '2024-11-05', dateFin: '2025-01-15', budget: 6200000, image: U2, descriptionFr: 'Rénovation complète.', descriptionEn: 'Full renovation.', vedette: false, createdAt: now, updatedAt: now },
    { id: 'prj-4', titre: 'Déploiement réseau télécom', categorie: 'archi', statut: 'brouillon', lieu: 'Djougou', client: 'Opérateur', dateDebut: '2025-08-01', dateFin: '2025-10-31', budget: 22000000, image: U3, descriptionFr: 'Infra réseau.', descriptionEn: 'Network infra.', vedette: false, createdAt: now, updatedAt: now },
  ],
  services: [
    { id: 'srv-1', code: 's1', titreFr: 'BTP - Bâtiment & Travaux Publics', titreEn: 'Construction & Public Works', descFr: 'Construction, rénovation et entretien.', descEn: 'Construction, renovation and maintenance.', image: U1, actif: true, ordre: 1 },
    { id: 'srv-2', code: 's2', titreFr: 'Hydraulique', titreEn: 'Hydraulics', descFr: 'Adduction d’eau, forages.', descEn: 'Water supply, boreholes.', image: U2, actif: true, ordre: 2 },
    { id: 'srv-3', code: 's3', titreFr: 'Électricité', titreEn: 'Electricity', descFr: 'Installations et maintenance.', descEn: 'Installations and maintenance.', image: U3, actif: true, ordre: 3 },
    { id: 'srv-4', code: 's4', titreFr: 'Commerce Général', titreEn: 'General Trading', descFr: 'Fourniture de matériaux.', descEn: 'Supply of materials.', image: U4, actif: true, ordre: 4 },
    { id: 'srv-5', code: 's5', titreFr: 'Déploiement de réseaux', titreEn: 'Network Deployment', descFr: 'Infrastructures télécom.', descEn: 'Telecom infrastructure.', image: U1, actif: true, ordre: 5 },
    { id: 'srv-6', code: 's6', titreFr: 'Import / Export', titreEn: 'Import / Export', descFr: 'Sourcing international.', descEn: 'International sourcing.', image: U2, actif: true, ordre: 6 },
  ],
  temoignages: [
    { id: 'tem-1', nom: 'Adame Nesane', role: 'Client', message: 'Équipe sérieuse et polyvalente. Travail soigné, délais respectés.', note: 5, statut: 'valide', image: A1, createdAt: now },
    { id: 'tem-2', nom: 'Adam Nahan', role: 'Client', message: 'Forage réalisé rapidement, très professionnel.', note: 4, statut: 'valide', image: A2, createdAt: now },
    { id: 'tem-3', nom: 'Mariam K.', role: 'Partenaire', message: 'En attente de validation, chantier en cours.', note: 5, statut: 'en_attente', image: A3, createdAt: now },
  ],
  messages: [
    { id: 'msg-1', nom: 'Jean Dossou', email: 'jean@example.com', objet: 'Devis forage', message: 'Bonjour, je souhaite un devis pour un forage à Bassila.', statut: 'nouveau', assigneA: '', createdAt: now },
    { id: 'msg-2', nom: 'Awa Traoré', email: 'awa@example.com', objet: 'Rénovation', message: 'Rénovation d’un bâtiment R+1, merci de me recontacter.', statut: 'en_cours', assigneA: 'admin@cauris.group', createdAt: now },
  ],
  newsletter: [
    { id: 'nl-1', email: 'client1@example.com', statut: 'actif', consentRgpd: true, createdAt: now },
    { id: 'nl-2', email: 'client2@example.com', statut: 'actif', consentRgpd: true, createdAt: now },
  ],
  utilisateurs: [
    { id: 'usr-1', nom: 'Administrateur', email: 'admin@cauris.group', role: 'admin', actif: true, password: 'Cauris2026!', createdAt: now },
    { id: 'usr-2', nom: 'Editeur', email: 'editeur@cauris.group', role: 'editeur', actif: true, password: 'Editeur2026!', createdAt: now },
    { id: 'usr-3', nom: 'Lecteur', email: 'lecteur@cauris.group', role: 'lecteur', actif: true, password: 'Lecteur2026!', createdAt: now },
  ],
  parametres: {
    nomSociete: 'Cauris Group International SARL', sloganFr: "L'expertise au service du développement",
    sloganEn: 'Expertise at the service of development', adresse: 'Maison ALEY Abani, Quartier Zongo, Bassila, Bénin',
    bp: 'BP : 421 Bassila', phone1: '(+229) 01 94 64 64 71', phone2: '(+229) 01 62 07 90 90',
    email: 'caurisgroupbtp@gmail.com', horairesSemaine: '8h – 18h', horairesSamedi: '8h – 12h',
    horairesDimanche: 'Fermé', projetsRealises: 120, polesExpertise: 6, engagementQualite: '100%',
  },
  audit: [],
};
