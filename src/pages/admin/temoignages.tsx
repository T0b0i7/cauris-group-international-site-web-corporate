import Head from 'next/head';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Star } from 'lucide-react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Modal } from '@/components/Admin/Modal';
import { useAdmin, Rules, uid } from '@/lib/admin/AdminContext';
import { useToast } from '@/lib/admin/useToast';
import { Temoignage } from '@/lib/admin/types';

const U = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80',
];
const displayCats = ['Construction', 'Aménagement intérieur', 'Travaux VRD', 'Construction industrielle', 'Études & Conseil', 'Construction'];
const displayProjs = [
  { t: 'Résidence Les Palmiers', l: 'Cotonou, Bénin' },
  { t: 'Villa moderne', l: 'Abomey-Calavi, Bénin' },
  { t: 'Voirie et réseaux divers', l: 'Parakou, Bénin' },
  { t: 'Entrepôt logistique', l: 'Porto-Novo, Bénin' },
  { t: 'Étude de faisabilité', l: 'Cotonou, Bénin' },
  { t: 'Immeuble résidentiel', l: 'Calavi, Bénin' },
];

function initials(nom: string) {
  return nom.split(' ').map((w) => w.charAt(0)).join('').slice(0, 2).toUpperCase();
}
function fmtDate(iso: string) {
  try { return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso)); } catch { return iso; }
}

type Tab = 'tous' | 'part' | 'ent' | 'projets' | 'services';
function isEnt(t: Temoignage) { return /partenaire|entreprise|sarl|bet|tsi|pro/i.test(t.role); }

export default function AdminTemoignages() {
  const { db, saveDB, can } = useAdmin();
  const { push } = useToast();
  const [q, setQ] = useState('');
  const [tab, setTab] = useState<Tab>('tous');
  const [editing, setEditing] = useState<Temoignage | null>(null);
  const [nom, setNom] = useState('');
  const [message, setMessage] = useState('');
  const [note, setNote] = useState(5);
  const ro = !can('write');

  const valides = db.temoignages.filter((t) => t.statut === 'valide');
  const moyenne = valides.length ? (valides.reduce((s, t) => s + t.note, 0) / valides.length) : 4.8;
  const list = useMemo(() => {
    let l = [...db.temoignages];
    if (tab === 'part') l = l.filter((t) => !isEnt(t));
    if (tab === 'ent') l = l.filter((t) => isEnt(t));
    if (tab === 'projets') l = l.filter((_, i) => i % 2 === 0);
    if (tab === 'services') l = l.filter((_, i) => i % 2 === 1);
    if (q.trim()) { const s = q.toLowerCase(); l = l.filter((t) => `${t.nom} ${t.message} ${t.role}`.toLowerCase().includes(s)); }
    return l;
  }, [db.temoignages, tab, q]);

  const add = () => {
    if (ro) return;
    const errs = Rules.temoignage({ nom, message, note });
    if (errs.length) return push(errs[0], 'error');
    const n: Temoignage = { id: uid('tem'), nom, role: 'Client', message, note, statut: 'en_attente', image: U[0], createdAt: new Date().toISOString() };
    saveDB({ ...db, temoignages: [n, ...db.temoignages] }, { entite: 'temoignage', action: 'create', detail: nom });
    push('Témoignage ajouté (en attente)', 'success'); setNom(''); setMessage(''); setNote(5);
  };
  const setStatut = (id: string, s: Temoignage['statut']) => {
    if (ro) return;
    saveDB({ ...db, temoignages: db.temoignages.map((t) => (t.id === id ? { ...t, statut: s } : t)) }, { entite: 'temoignage', action: `statut:${s}`, detail: id });
    push(`Passé en ${s}`, 'success');
  };

  return (
    <>
      <Head><title>Témoignages - Cauris Group</title><meta name="robots" content="noindex" /></Head>
      <AdminLayout title="" subtitle="" bare>
        <div className="art-wrap">
          <div className="art-main">
            <div className="art-crumb">Accueil <span>›</span> Témoignages</div>
            <div className="srv-hero">
              <div><h1>Témoignages</h1><p>La confiance de nos clients, notre plus grande réussite.</p></div>
              <div className="srv-hero-quote"><span>Construire des projets,<br />c’est aussi bâtir des relations de confiance.</span></div>
            </div>

            <div className="art-stats">
              {[
                { v: `${valides.length || 18}`, l: 'Témoignages publiés', s: 'Cette année', t: '↑ +6%' },
                { v: `${moyenne.toFixed(1)}/5`, l: 'Note moyenne', s: `Basée sur ${valides.length || 18} avis`, t: '↑ +0.2' },
                { v: '100%', l: 'Clients satisfaits', s: 'Taux de satisfaction', t: '↑ +8%' },
                { v: `${db.temoignages.length || 12}`, l: 'Entreprises et particuliers', s: 'Clients témoins', t: '↑ +4%' },
              ].map((x) => (<div key={x.l} className="art-stat"><span className="art-stat-ico">✦</span><span><b>{x.v} <em className="up">{x.t}</em></b><small>{x.l}</small><small className="dim">{x.s}</small></span></div>))}
            </div>

            <div className="prj-tabs">
              <div className="prj-tabs-left">
                {([['tous', `Tous (${db.temoignages.length || 18})`], ['part', `Particuliers (${db.temoignages.filter((t) => !isEnt(t)).length || 12})`], ['ent', `Entreprises (${db.temoignages.filter(isEnt).length || 6})`], ['projets', 'Projets (8)'], ['services', 'Services (7)']] as [Tab, string][]).map(([k, l]) => (
                  <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>
                ))}
              </div>
              <div className="art-head-search"><Search size={14} /><input placeholder="Rechercher un témoignage..." value={q} onChange={(e) => setQ(e.target.value)} /></div>
            </div>

            <div className="tem-grid">
              <AnimatePresence>
                {list.map((t, i) => (
                  <motion.article key={t.id} className="tem-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} layout>
                    <div className="tem-img"><img src={U[i % U.length]} alt="" /><span className="tem-badge">{displayCats[i % displayCats.length]}</span><span className="tem-quote">“</span></div>
                    <p className="tem-msg">« {t.message} »</p>
                    <div className="tem-who"><span className="tem-av">{initials(t.nom)}</span><span><b>{t.nom}</b><small>{t.role} - {fmtDate(t.createdAt)}</small></span><span className="tem-stars">{Array.from({ length: 5 }).map((_, s) => (<Star key={s} size={12} fill={s < t.note ? '#c9a227' : 'none'} color="#c9a227" />))}</span></div>
                    <div className="tem-proj">⌂ {displayProjs[i % displayProjs.length].t}<small>{displayProjs[i % displayProjs.length].l}</small></div>
                    {!ro && (
                      <div className="tem-modo">
                        <span className={`prj-pill ${t.statut === 'valide' ? 'run' : t.statut === 'rejete' ? 'late' : 'plani'}`}>{t.statut}</span>
                        <button onClick={() => setStatut(t.id, 'valide')}>Valider</button>
                        <button onClick={() => setStatut(t.id, 'rejete')}>Rejeter</button>
                        <button onClick={() => setEditing(t)}>Éditer</button>
                      </div>
                    )}
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
            {list.length === 0 && <div className="empty">Aucun témoignage dans cet onglet.</div>}
            <div className="prj-pager"><span>Affichage de 1 à {list.length} sur {list.length} témoignages</span><span><button>‹</button><button className="on">1</button><button>2</button><button>3</button><button>›</button></span></div>

            {!ro && (
              <div className="art-panel" style={{ marginTop: 14 }}>
                <b>Ajouter (modération : en attente → validé)</b>
                <div className="form-grid" style={{ marginTop: 10 }}>
                  <label><span>Nom</span><input value={nom} onChange={(e) => setNom(e.target.value)} /></label>
                  <label><span>Note (1-5)</span><input type="number" min={1} max={5} value={note} onChange={(e) => setNote(Number(e.target.value))} /></label>
                  <label className="full"><span>Message</span><textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} /></label>
                </div>
                <button className="art-btn-gold" style={{ marginTop: 10 }} onClick={add}><Plus size={14} /> Ajouter</button>
              </div>
            )}
          </div>

          <aside className="art-side">
            <div className="art-panel">
              <div className="art-panel-head"><b>Témoignages récents</b><span>Voir tout →</span></div>
              {db.temoignages.slice(0, 5).map((t, i) => (
                <div key={t.id} className="art-latest"><img src={U[i % U.length]} alt="" /><div><b>{t.nom}</b><small>{t.message.slice(0, 42)}...<br />{fmtDate(t.createdAt)}</small></div><span>›</span></div>
              ))}
            </div>
            <div className="prj-cta">
              <b>Vous avez réalisé un projet avec nous ?</b>
              <p>Partagez votre expérience et aidez-nous à construire un avenir meilleur.</p>
              {!ro && <button className="art-btn-gold" onClick={() => document.querySelector<HTMLInputElement>('.art-panel input')?.focus()}>✎ Laisser un témoignage</button>}
            </div>
          </aside>
        </div>

        <Modal open={!!editing} title="Éditer témoignage" onClose={() => setEditing(null)} onSave={() => {
          if (!editing || ro) return;
          const errs = Rules.temoignage(editing);
          if (errs.length) return push(errs[0], 'error');
          saveDB({ ...db, temoignages: db.temoignages.map((x) => (x.id === editing.id ? editing : x)) }, { entite: 'temoignage', action: 'update', detail: editing.nom });
          push('Témoignage mis à jour', 'success'); setEditing(null);
        }}>
          {editing && (
            <>
              <label><span>Nom</span><input value={editing.nom} onChange={(e) => setEditing({ ...editing, nom: e.target.value })} /></label>
              <label><span>Note</span><input type="number" min={1} max={5} value={editing.note} onChange={(e) => setEditing({ ...editing, note: Number(e.target.value) })} /></label>
              <label className="full"><span>Message</span><textarea rows={3} value={editing.message} onChange={(e) => setEditing({ ...editing, message: e.target.value })} /></label>
            </>
          )}
        </Modal>
      </AdminLayout>
    </>
  );
}
