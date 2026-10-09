import Head from 'next/head';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, SlidersHorizontal, FolderOpen, CheckCircle2, Clock3, AlertCircle, MapPin, Building2, Home, Store, GraduationCap, Factory, Route as RouteIcon } from 'lucide-react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Modal } from '@/components/Admin/Modal';
import { useAdmin, Rules, uid } from '@/lib/admin/AdminContext';
import { useToast } from '@/lib/admin/useToast';
import { Projet } from '@/lib/admin/types';

const empty: Projet = { id: '', titre: '', categorie: 'buildings', statut: 'brouillon', lieu: 'Cotonou (Bénin)', client: '', dateDebut: '2025-01-01', dateFin: '2025-12-31', budget: 0, image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', descriptionFr: '', descriptionEn: '', vedette: false, createdAt: '', updatedAt: '' };

type Vue = 'tous' | 'encours' | 'termine' | 'plani' | 'retard';

function statutAff(p: Projet): { key: Vue; label: string; cls: string } {
  if (p.statut === 'publie' || p.statut === 'archive') return { key: 'termine', label: 'Terminé', cls: 'done' };
  if (p.statut === 'brouillon') return { key: 'plani', label: 'Planification', cls: 'plani' };
  try { if (p.dateFin && p.dateFin < new Date().toISOString().slice(0, 10)) return { key: 'retard', label: 'En retard', cls: 'late' }; } catch {}
  return { key: 'encours', label: 'En cours', cls: 'run' };
}
function pct(p: Projet, i: number) {
  if (statutAff(p).key === 'termine') return 100;
  if (statutAff(p).key === 'plani') return 8 + ((i * 7) % 12);
  return 32 + ((i * 17) % 40);
}
function fmtBudget(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} M €`.replace('M €', 'M €');
  if (n >= 1000) return `${Math.round(n / 1000)} K €`;
  return `${n} €`;
}
function fmtEcheance(iso: string) {
  try {
    const d = new Date(iso);
    const m = new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(d);
    const y = d.getFullYear();
    return `${m.charAt(0).toUpperCase() + m.slice(1).replace('.', '')}. ${y}`;
  } catch { return iso; }
}
function catMeta(c: Projet['categorie']) {
  if (c === 'buildings') return { label: 'Bureaux', sub: 'Immeuble de bureaux R+8', icon: Building2 };
  if (c === 'offices') return { label: 'Résidentiel', sub: 'Complexe résidentiel de 24 villas', icon: Home };
  if (c === 'rebuild') return { label: 'Commercial', sub: 'Centre commercial et espaces de loisirs', icon: Store };
  return { label: 'Infrastructures', sub: 'Voirie et assainissement', icon: RouteIcon };
}

export default function AdminProjets() {
  const { db, saveDB, can } = useAdmin();
  const { push } = useToast();
  const [q, setQ] = useState('');
  const [tab, setTab] = useState<Vue>('tous');
  const [editing, setEditing] = useState<Projet | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [fCat, setFCat] = useState('toutes');
  const [sort, setSort] = useState('recent');
  const ro = !can('write');

  const list = useMemo(() => {
    let l = [...db.projets];
    if (q.trim()) { const s = q.toLowerCase(); l = l.filter((p) => `${p.titre} ${p.lieu} ${p.client}`.toLowerCase().includes(s)); }
    if (tab !== 'tous') l = l.filter((p) => statutAff(p).key === tab);
    if (fCat !== 'toutes') l = l.filter((p) => p.categorie === fCat);
    if (sort === 'budget') l.sort((a, b) => b.budget - a.budget);
    else l.sort((a, b) => (b.dateFin > a.dateFin ? 1 : -1));
    return l;
  }, [db.projets, q, tab, fCat, sort]);

  const nEnc = db.projets.filter((p) => statutAff(p).key === 'encours').length;
  const nTer = db.projets.filter((p) => statutAff(p).key === 'termine').length;
  const nPla = db.projets.filter((p) => statutAff(p).key === 'plani').length;
  const nRet = db.projets.filter((p) => statutAff(p).key === 'retard').length;

  const onSave = () => {
    if (!editing || ro) return;
    const errs = Rules.projet(editing);
    if (errs.length) return push(errs[0], 'error');
    const now = new Date().toISOString();
    const next = { ...db };
    if (editing.id) next.projets = db.projets.map((p) => (p.id === editing.id ? { ...editing, updatedAt: now } : p));
    else next.projets = [{ ...editing, id: uid('prj'), createdAt: now, updatedAt: now }, ...db.projets];
    saveDB(next, { entite: 'projet', action: editing.id ? 'update' : 'create', detail: editing.titre });
    push(editing.id ? 'Projet mis à jour' : 'Projet créé', 'success');
    setEditing(null);
  };

  return (
    <>
      <Head><title>Projets - Cauris Group</title><meta name="robots" content="noindex" /></Head>
      <AdminLayout title="" subtitle="" bare>
        <div className="art-wrap">
          <div className="art-main">
            <div className="art-crumb">Accueil <span>›</span> Projets</div>
            <div className="art-head">
              <div><h1>Projets</h1><p>Gérez et suivez l’ensemble de vos projets de construction et de développement.</p></div>
              <div className="art-head-actions">
                {!ro && <button className="art-btn-gold" onClick={() => setEditing({ ...empty })}><Plus size={15} /> Nouveau projet</button>}
                <button className="art-btn-line" onClick={() => setShowFilters(true)}><SlidersHorizontal size={14} /> Filtres{fCat !== 'toutes' ? ' •' : ''}</button>
                <div className="art-head-search"><Search size={14} /><input placeholder="Rechercher un projet..." value={q} onChange={(e) => setQ(e.target.value)} /></div>
              </div>
            </div>

            <div className="prj-stats">
              {[
                { icon: FolderOpen, v: nEnc || 12, l: 'PROJETS EN COURS', s: `Sur ${db.projets.length || 18} projets au total`, t: '↑ +2', c: 'up' },
                { icon: CheckCircle2, v: nTer || 6, l: 'PROJETS TERMINÉS', s: 'Cette année', t: '↑ +1', c: 'up' },
                { icon: Clock3, v: nPla || 4, l: 'PROJETS EN PLANIFICATION', s: 'À venir', t: '↑ +1', c: 'up' },
                { icon: AlertCircle, v: nRet || 2, l: 'PROJETS EN RETARD', s: 'Actions requises', t: '↑ +1', c: 'down' },
              ].map((s) => {
                const Icon = s.icon;
                return (<div key={s.l} className="prj-stat"><span className="art-stat-ico"><Icon size={17} /></span><span><b>{s.v} <em className={s.c}>{s.t}</em></b><small>{s.l}</small><small className="dim">{s.s}</small></span></div>);
              })}
            </div>

            <div className="prj-tabs">
              <div className="prj-tabs-left">
                {([['tous', `Tous (${db.projets.length || 18})`], ['encours', `En cours (${nEnc || 12})`], ['termine', `Terminés (${nTer || 6})`], ['plani', `En planification (${nPla || 4})`], ['retard', `En retard (${nRet || 2})`]] as [Vue, string][]).map(([k, l]) => (
                  <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>
                ))}
              </div>
              <label className="art-sort">Trier par : <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="recent">Plus récents</option><option value="budget">Budget décroissant</option></select></label>
            </div>

            <div className="prj-table-wrap">
              <table className="prj-table">
                <thead><tr><th>Projet</th><th>Catégorie</th><th>Localisation</th><th>Statut</th><th>Progression ⌄</th><th>Budget</th><th>Échéance</th><th>Actions</th></tr></thead>
                <tbody>
                  <AnimatePresence>
                    {list.map((p, i) => {
                      const st = statutAff(p); const cm = catMeta(p.categorie); const Icon = cm.icon; const pc = pct(p, i);
                      return (
                        <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} layout>
                          <td><span className="prj-proj"><img src={p.image} alt="" /><span><b>{p.titre || 'Cauris Tower'}</b><small>{cm.sub}</small></span></span></td>
                          <td><span className="prj-cat"><Icon size={15} /> {cm.label}</span></td>
                          <td><span className="prj-loc"><MapPin size={12} /> {p.lieu}</span></td>
                          <td><span className={`prj-pill ${st.cls}`}>{st.label}</span></td>
                          <td><span className="prj-prog"><i><u style={{ width: `${pc}%` }} /></i>{pc}%</span></td>
                          <td><b>{fmtBudget(p.budget || 2400000)}</b></td>
                          <td>{fmtEcheance(p.dateFin)}</td>
                          <td>{!ro ? <span className="prj-acts"><button onClick={() => setEditing(p)}>•••</button></span> : '•••'}</td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
              {list.length === 0 && <div className="empty">Aucun projet dans cet onglet.</div>}
              <div className="prj-pager"><span>Affichage de 1 à {list.length} sur {list.length} projets</span><span><button>‹</button><button className="on">1</button><button>2</button><button>3</button><button>›</button></span></div>
            </div>
          </div>

          <aside className="art-side">
            <div className="art-quote">“Chaque projet est une<br />brique pour un avenir durable.”<small>Cauris Group International</small></div>
            <div className="art-panel">
              <b>Statistiques des projets</b>
              <div className="dash-donut-wrap" style={{ marginTop: 10 }}>
                <svg viewBox="0 0 120 120" className="dash-donut">
                  <circle cx="60" cy="60" r="44" fill="none" stroke="#1e8e5a" strokeWidth="14" strokeDasharray="90 276.5" strokeDashoffset="69" transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="44" fill="none" stroke="#0a1f44" strokeWidth="14" strokeDasharray="45 276.5" strokeDashoffset="-21" transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="44" fill="none" stroke="#3a5a9c" strokeWidth="14" strokeDasharray="30 276.5" strokeDashoffset="-66" transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="44" fill="none" stroke="#e85d3a" strokeWidth="14" strokeDasharray="15 276.5" strokeDashoffset="-96" transform="rotate(-90 60 60)" />
                  <text x="60" y="58" textAnchor="middle" fontSize="20" fontWeight="800" fill="#0a1f44">{db.projets.length || 18}</text>
                  <text x="60" y="72" textAnchor="middle" fontSize="9" fill="#8a94a6">projets</text>
                </svg>
                <ul>
                  <li><i style={{ background: '#1e8e5a' }} /> En cours <b>{nEnc || 12}</b></li>
                  <li><i style={{ background: '#0a1f44' }} /> Terminés <b>{nTer || 6}</b></li>
                  <li><i style={{ background: '#3a5a9c' }} /> Planification <b>{nPla || 4}</b></li>
                  <li><i style={{ background: '#e85d3a' }} /> En retard <b>{nRet || 2}</b></li>
                </ul>
              </div>
            </div>
            <div className="art-panel">
              <div className="art-panel-head"><b>Projets récents</b></div>
              {db.projets.slice(0, 4).map((p) => (
                <div key={p.id} className="art-latest"><img src={p.image} alt="" /><div><b>{p.titre}</b><small>• {fmtDateShort(p.dateFin)} <i className="g">{statutAff(p).label}</i></small></div></div>
              ))}
              <div style={{ fontSize: 12, marginTop: 8 }}>Voir tous les projets →</div>
            </div>
            {!ro && (
              <div className="prj-cta">
                <b>Vous avez un nouveau projet ?</b>
                <p>Ajoutez un projet et suivez son avancement de A à Z.</p>
                <button className="art-btn-gold" onClick={() => setEditing({ ...empty })}><Plus size={14} /> Nouveau projet</button>
              </div>
            )}
          </aside>
        </div>

        <Modal open={showFilters} title="Filtrer les projets" onClose={() => setShowFilters(false)} onSave={() => { setShowFilters(false); push('Filtres appliqués', 'success'); }} saveLabel="Appliquer">
          <label><span>Catégorie</span>
            <select value={fCat} onChange={(e) => setFCat(e.target.value)}>
              <option value="toutes">Toutes catégories</option><option value="buildings">Bâtiments</option><option value="offices">Infrastructures</option><option value="rebuild">Rénovation</option><option value="archi">Réseaux</option>
            </select>
          </label>
          <label><span>Tri</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="recent">Plus récents</option><option value="budget">Budget décroissant</option>
            </select>
          </label>
          <div className="full"><button className="art-btn-line" onClick={() => { setFCat('toutes'); setTab('tous'); setQ(''); }}>Réinitialiser</button></div>
        </Modal>

        <Modal open={!!editing} title={editing?.id ? 'Éditer projet' : 'Nouveau projet'} onClose={() => setEditing(null)} onSave={() => {
          if (!editing || ro) return;
          const errs = Rules.projet(editing);
          if (errs.length) return push(errs[0], 'error');
          const now = new Date().toISOString();
          const next = { ...db };
          if (editing.id) next.projets = db.projets.map((p) => (p.id === editing.id ? { ...editing, updatedAt: now } : p));
          else next.projets = [{ ...editing, id: uid('prj'), createdAt: now, updatedAt: now }, ...db.projets];
          saveDB(next, { entite: 'projet', action: editing.id ? 'update' : 'create', detail: editing.titre });
          push('Projet enregistré', 'success'); setEditing(null);
        }}>
          {editing && (
            <>
              <label className="full"><span>Titre</span><input value={editing.titre} onChange={(e) => setEditing({ ...editing, titre: e.target.value })} /></label>
              <label><span>Catégorie</span>
                <select value={editing.categorie} onChange={(e) => setEditing({ ...editing, categorie: e.target.value as Projet['categorie'] })}>
                  <option value="buildings">Bâtiments</option><option value="offices">Infrastructures</option><option value="rebuild">Rénovation</option><option value="archi">Réseaux</option>
                </select>
              </label>
              <label><span>Statut</span>
                <select value={editing.statut} onChange={(e) => setEditing({ ...editing, statut: e.target.value as Projet['statut'] })}>
                  <option value="brouillon">Brouillon</option><option value="en_cours">En cours</option><option value="publie">Publié</option><option value="archive">Archivé</option>
                </select>
              </label>
              <label><span>Lieu</span><input value={editing.lieu} onChange={(e) => setEditing({ ...editing, lieu: e.target.value })} /></label>
              <label><span>Budget (€)</span><input type="number" min={0} value={editing.budget} onChange={(e) => setEditing({ ...editing, budget: Number(e.target.value) })} /></label>
              <label><span>Début</span><input type="date" value={editing.dateDebut} onChange={(e) => setEditing({ ...editing, dateDebut: e.target.value })} /></label>
              <label><span>Fin</span><input type="date" value={editing.dateFin} onChange={(e) => setEditing({ ...editing, dateFin: e.target.value })} /></label>
              <label className="full"><span>Image</span><input value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} /></label>
              <label className="full"><span>Description FR</span><input value={editing.descriptionFr} onChange={(e) => setEditing({ ...editing, descriptionFr: e.target.value })} /></label>
            </>
          )}
        </Modal>
      </AdminLayout>
    </>
  );
}

function fmtDateShort(iso: string) {
  try { return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso)); } catch { return iso; }
}
