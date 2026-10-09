import { AdminDB } from './types';
import { uid } from './AdminContext';

const NAMES = ['Awa Koné', 'Ibrahim Bah', 'Fatou Diallo', 'Yao Kouassi', 'Mariam Traoré'];
const OBJETS = ['Devis forage', 'Rénovation R+1', 'Devis électricité', 'Adduction eau', 'Devis BTP'];
const MSGS = [
  'Bonjour, je souhaite un devis pour un forage à Bassila.',
  'Rénovation d’un bâtiment, merci de me recontacter.',
  'Installation électrique complète, demande de devis.',
  'Projet d’adduction d’eau pour notre quartier.',
];

export function simulateVisit(db: AdminDB): AdminDB {
  if (!db.articles.length) return db;
  const i = Math.floor(Math.random() * db.articles.length);
  const articles = db.articles.map((a, k) => (k === i ? { ...a, vues: (a.vues || 0) + 1 + Math.floor(Math.random() * 5) } : a));
  return { ...db, articles };
}

export function simulateMessage(db: AdminDB): AdminDB {
  const i = Math.floor(Math.random() * NAMES.length);
  const n = {
    id: uid('msg'), nom: NAMES[i], email: `client${Date.now() % 100000}@example.com`,
    objet: OBJETS[i % OBJETS.length], message: MSGS[i % MSGS.length],
    statut: 'nouveau' as const, assigneA: '', createdAt: new Date().toISOString(),
  };
  return { ...db, messages: [n, ...db.messages] };
}

export function runFullSimulation(db: AdminDB, steps = 6): AdminDB {
  let next = { ...db };
  for (let s = 0; s < steps; s++) {
    next = simulateVisit(next);
    if (s % 2 === 0) next = simulateMessage(next);
  }
  return next;
}
