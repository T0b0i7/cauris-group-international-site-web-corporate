// Types centraux du backoffice Cauris Group - compatibles export statique (localStorage)
export type Role = 'admin' | 'editeur' | 'lecteur';
export type StatutPublication = 'brouillon' | 'publie' | 'archive';
export type StatutProjet = 'brouillon' | 'en_cours' | 'publie' | 'archive';
export type StatutTemoignage = 'en_attente' | 'valide' | 'rejete';
export type StatutMessage = 'nouveau' | 'en_cours' | 'traite' | 'clos';
export type StatutNewsletter = 'actif' | 'desinscrit';

export interface Article {
  id: string;
  slug: string;
  titreFr: string;
  titreEn: string;
  categorie: 'entreprise' | 'chantier' | 'conseil' | 'import-export';
  statut: StatutPublication;
  datePublication: string; // ISO yyyy-mm-dd
  image: string;
  extraitFr: string;
  extraitEn: string;
  contenuFr: string;
  contenuEn: string;
  auteur: string;
  vues: number;
  createdAt: string;
  updatedAt: string;
}

export interface Projet {
  id: string;
  titre: string;
  categorie: 'buildings' | 'offices' | 'rebuild' | 'archi';
  statut: StatutProjet;
  lieu: string;
  client: string;
  dateDebut: string;
  dateFin: string;
  budget: number;
  image: string;
  descriptionFr: string;
  descriptionEn: string;
  vedette: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  id: string;
  code: 's1' | 's2' | 's3' | 's4' | 's5' | 's6';
  titreFr: string;
  titreEn: string;
  descFr: string;
  descEn: string;
  image: string;
  actif: boolean;
  ordre: number;
}

export interface Temoignage {
  id: string;
  nom: string;
  role: string;
  message: string;
  note: number; // 1..5
  statut: StatutTemoignage;
  image: string;
  createdAt: string;
}

export interface MessageContact {
  id: string;
  nom: string;
  email: string;
  objet: string;
  message: string;
  statut: StatutMessage;
  assigneA: string;
  createdAt: string;
}

export interface Abonne {
  id: string;
  email: string;
  statut: StatutNewsletter;
  consentRgpd: boolean;
  createdAt: string;
}

export interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  role: Role;
  actif: boolean;
  password: string; // démo : stocké en clair côté navigateur, à brancher sur vraie API en prod
  createdAt: string;
}

export interface Parametres {
  nomSociete: string;
  sloganFr: string;
  sloganEn: string;
  adresse: string;
  bp: string;
  phone1: string;
  phone2: string;
  email: string;
  horairesSemaine: string;
  horairesSamedi: string;
  horairesDimanche: string;
  projetsRealises: number;
  polesExpertise: number;
  engagementQualite: string;
}

export interface AuditEntry {
  id: string;
  date: string;
  utilisateur: string;
  entite: string;
  action: string;
  detail: string;
}

export interface AdminDB {
  articles: Article[];
  projets: Projet[];
  services: ServiceItem[];
  temoignages: Temoignage[];
  messages: MessageContact[];
  newsletter: Abonne[];
  utilisateurs: Utilisateur[];
  parametres: Parametres;
  audit: AuditEntry[];
}
