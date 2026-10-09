import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { AdminDB, Utilisateur, Role, AuditEntry } from './types';
import { seedDB } from './seed';

const DB_KEY = 'cauris_admin_db_v1';
const SESSION_KEY = 'cauris_admin_session_v1';
const SESSION_MS = 8 * 60 * 60 * 1000;

export interface Session { email: string; nom: string; role: Role; expires: number; }
interface Ctx {
  db: AdminDB;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => string | null;
  logout: () => void;
  can: (action: 'write' | 'admin') => boolean;
  saveDB: (next: AdminDB, audit?: Omit<AuditEntry,'id'|'date'|'utilisateur'>) => void;
  resetDB: () => void;
  reset: () => void;
  exportJSON: () => string;
  exportFile: () => void;
  importJSON: (json: string) => string | null;
}

const AdminCtx = createContext<Ctx | null>(null);
export const useAdmin = () => { const c = useContext(AdminCtx); if (!c) throw new Error('useAdmin hors provider'); return c; };

function loadDB(): AdminDB {
  if (typeof window === 'undefined') return seedDB;
  try {
    const raw = window.localStorage.getItem(DB_KEY);
    if (!raw) { window.localStorage.setItem(DB_KEY, JSON.stringify(seedDB)); return seedDB; }
    const parsed = JSON.parse(raw) as AdminDB;
    if (!parsed.articles || !parsed.utilisateurs) throw new Error('db invalide');
    return { ...seedDB, ...parsed };
  } catch { return seedDB; }
}
function loadSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Session;
    if (Date.now() > s.expires) { window.localStorage.removeItem(SESSION_KEY); return null; }
    return s;
  } catch { return null; }
}

export const uid = (p: string) => `${p}-${Date.now().toString(36)}-${Math.floor(Math.random()*1e4)}`;
export const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,80) || 'sans-titre';
export const isEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());

// Règles de gestion centralisées - toute création/édition doit passer par ces validateurs
export const Rules = {
  article(a: { titreFr: string; titreEn: string; slug: string; categorie: string; statut: string; datePublication: string; contenuFr: string; image: string }, existingSlugs: string[], selfId?: string): string[] {
    const e: string[] = [];
    if (!a.titreFr || a.titreFr.trim().length < 5) e.push('Titre FR requis (min 5 caractères).');
    if (!a.titreEn || a.titreEn.trim().length < 5) e.push('Titre EN requis (min 5 caractères).');
    if (!a.slug) e.push('Slug requis.');
    else if (existingSlugs.filter(s => s !== selfId).includes(a.slug)) e.push('Slug déjà utilisé - doit être unique.');
    if (!['entreprise','chantier','conseil','import-export'].includes(a.categorie)) e.push('Catégorie invalide.');
    if (!['brouillon','publie','archive'].includes(a.statut)) e.push('Statut invalide.');
    if (!a.datePublication) e.push('Date de publication requise.');
    if (!a.contenuFr || a.contenuFr.trim().length < 20) e.push('Contenu FR requis (min 20 caractères).');
    if (!a.image) e.push('Image requise.');
    return e;
  },
  projet(p: { titre: string; categorie: string; statut: string; dateDebut: string; dateFin: string; budget: number }): string[] {
    const e: string[] = [];
    if (!p.titre || p.titre.trim().length < 5) e.push('Titre requis (min 5 caractères).');
    if (!['buildings','offices','rebuild','archi'].includes(p.categorie)) e.push('Catégorie invalide.');
    if (!['brouillon','en_cours','publie','archive'].includes(p.statut)) e.push('Statut invalide.');
    if (p.dateDebut && p.dateFin && p.dateDebut > p.dateFin) e.push('Règle de gestion : date de début ≤ date de fin.');
    if (!(p.budget >= 0)) e.push('Budget doit être ≥ 0.');
    return e;
  },
  temoignage(t: { nom: string; message: string; note: number }): string[] {
    const e: string[] = [];
    if (!t.nom || t.nom.trim().length < 2) e.push('Nom requis.');
    if (!t.message || t.message.trim().length < 10) e.push('Message requis (min 10 caractères).');
    if (!(t.note >= 1 && t.note <= 5)) e.push('Note entre 1 et 5.');
    return e;
  },
  message(m: { nom: string; email: string; objet: string; message: string }): string[] {
    const e: string[] = [];
    if (!m.nom || m.nom.trim().length < 2) e.push('Nom requis.');
    if (!isEmail(m.email)) e.push('Email invalide.');
    if (!m.objet || m.objet.trim().length < 3) e.push('Objet requis.');
    if (!m.message || m.message.trim().length < 10) e.push('Message requis (min 10 caractères).');
    return e;
  },
  utilisateur(u: { nom: string; email: string; password: string }, emails: string[], selfId?: string): string[] {
    const e: string[] = [];
    if (!u.nom || u.nom.trim().length < 2) e.push('Nom requis.');
    if (!isEmail(u.email)) e.push('Email invalide.');
    else if (emails.filter(x => x !== selfId).includes(u.email.toLowerCase().trim())) e.push('Email déjà utilisé.');
    if (u.password && u.password.length < 8) e.push('Mot de passe min 8 caractères.');
    return e;
  },
};

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<AdminDB>(seedDB);
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => { setDb(loadDB()); setSession(loadSession()); setReady(true); }, []);

  const persist = (next: AdminDB) => { setDb(next); try { window.localStorage.setItem(DB_KEY, JSON.stringify(next)); } catch {} };

  const saveDB = useCallback((next: AdminDB, audit?: Omit<AuditEntry,'id'|'date'|'utilisateur'>) => {
    let finalDB = next;
    if (audit) {
      const entry: AuditEntry = { id: uid('aud'), date: new Date().toISOString(), utilisateur: loadSession()?.email ?? 'systeme', ...audit };
      finalDB = { ...next, audit: [entry, ...next.audit].slice(0, 500) };
    }
    persist(finalDB);
  }, []);

  const login = useCallback((email: string, password: string): string | null => {
    try {
      const cleanEmail = email.toLowerCase().trim();
      let current = loadDB();
      if (!current.utilisateurs || !current.utilisateurs.length) current = seedDB;
      const u: Utilisateur | undefined = current.utilisateurs.find((x) => x.email.toLowerCase().trim() === cleanEmail);
      if (!u) return 'Compte introuvable. Vérifiez l’email.';
      if (!u.actif) return 'Compte désactivé. Contactez l’administrateur.';
      if (u.password !== password) return 'Mot de passe incorrect.';
      const s: Session = { email: u.email, nom: u.nom, role: u.role, expires: Date.now() + SESSION_MS };
      try { window.localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch {}
      setSession(s);
      setDb(current);
      try {
        const withAudit = { ...current, audit: [{ id: uid('aud'), date: new Date().toISOString(), utilisateur: u.email, entite: 'session', action: 'login', detail: `Connexion ${u.role}` }, ...(current.audit || [])].slice(0, 500) };
        setDb(withAudit);
        window.localStorage.setItem(DB_KEY, JSON.stringify(withAudit));
      } catch {}
      return null;
    } catch { return 'Erreur technique, réessayez.'; }
  }, []);

  const logout = useCallback(() => { try { window.localStorage.removeItem(SESSION_KEY); } catch {} setSession(null); }, []);
  const can = useCallback((action: 'write' | 'admin') => {
    if (!session) return false;
    if (action === 'admin') return session.role === 'admin';
    return session.role === 'admin' || session.role === 'editeur';
  }, [session]);

  const resetDB = useCallback(() => persist(seedDB), []);
  const reset = resetDB;
  const exportJSON = useCallback(() => JSON.stringify(db, null, 2), [db]);
  const exportFile = useCallback(() => {
    try {
      const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'cauris-backup.json'; a.click();
      URL.revokeObjectURL(url);
    } catch {}
  }, [db]);
  const importJSON = useCallback((json: string): string | null => {
    try {
      const p = JSON.parse(json) as AdminDB;
      if (!p.articles || !p.projets || !p.utilisateurs) return 'Fichier invalide : clés manquantes.';
      persist({ ...seedDB, ...p });
      return null;
    } catch { return 'JSON invalide.'; }
  }, []);

  const value = useMemo(() => ({ db, session, loading: !ready, login, logout, can, saveDB, resetDB, reset, exportJSON, exportFile, importJSON }), [db, session, ready, login, logout, can, saveDB, resetDB, exportJSON, exportFile, importJSON]);
  if (!ready) return null;
  return <AdminCtx.Provider value={value}>{children}</AdminCtx.Provider>;
}
