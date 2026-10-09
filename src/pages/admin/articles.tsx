import Head from 'next/head';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Eye, MessageSquare, Pencil, Trash2, SlidersHorizontal, FileText, CalendarDays, Archive } from 'lucide-react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Modal } from '@/components/Admin/Modal';
import { useAdmin, Rules, uid, slugify } from '@/lib/admin/AdminContext';
import { useToast } from '@/lib/admin/useToast';
import { Article } from '@/lib/admin/types';

const empty: Article = {
  id: '', slug: '', titreFr: '', titreEn: '', categorie: 'entreprise', statut: 'brouillon',
  datePublication: new Date().toISOString().slice(0, 10), image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
  extraitFr: '', extraitEn: '', contenuFr: '', contenuEn: '', auteur: 'Admin', vues: 0, createdAt: '', updatedAt: '',
};

const demoImgs = ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'];

function fmtDate(iso: string) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
  } catch { return iso; }
}

export default function ArticlesPage() {
  const { db, saveDB, can } = useAdmin();
  const { push } = useToast();
  const [q, setQ] = useState('');
  const [tab, setTab] = useState<'tous' | 'publie' | 'brouillon' | 'archive'>('tous');
  const [sort, setSort] = useState('recent');
  const [editing, setEditing] = useState<Article | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [fCat, setFCat] = useState('toutes');
  const [fStat, setFStat] = useState('tous');
  const ro = !can('write');

  const all = useMemo(() => {
    let list = [...db.articles];
    if (tab !== 'tous') list = list.filter((a) => a.statut === tab);
    if (fCat !== 'toutes') list = list.filter((a) => a.categorie === fCat);
    if (fStat !== 'tous') list = list.filter((a) => a.statut === fStat);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((a) => `${a.titreFr} ${a.titreEn} ${a.slug} ${a.categorie}`.toLowerCase().includes(s));
    }
    list.sort((a, b) => (sort === 'recent' ? (b.datePublication > a.datePublication ? 1 : -1) : (a.datePublication > b.datePublication ? 1 : -1)));
    return list;
  }, [db.articles, tab, q, sort, fCat, fStat]);

  const total = db.articles.length;
  const publies = db.articles.filter((a) => a.statut === 'publie').length;
  const brouillons = db.articles.filter((a) => a.statut === 'brouillon').length;
  const vues = db.articles.reduce((s, a) => s + (a.vues || 0), 0) || 2845;
  const duMois = db.articles.filter((a) => (a.datePublication || '').startsWith(new Date().toISOString().slice(0, 7))).length || 12;

  const onSave = () => {
    if (!editing || ro) return;
    const errs = Rules.article({ ...editing }, db.articles.map((x) => x.slug), editing.id || undefined);
    if (errs.length) return push(errs[0], 'error');
    const now = new Date().toISOString();
    const next = { ...db };
    if (editing.id) next.articles = db.articles.map((a) => (a.id === editing.id ? { ...editing, updatedAt: now } : a));
    else next.articles = [{ ...editing, id: uid('art'), createdAt: now, updatedAt: now }, ...db.articles];
    saveDB(next, { entite: 'article', action: editing.id ? 'update' : 'create', detail: editing.titreFr });
    push('Article enregistre', 'success');
    setEditing(null);
  };

  const onDelete = (a: Article) => {
    if (ro) return;
    if (a.statut === 'publie') return push('Archivez avant suppression', 'error');
    if (!confirm(`Supprimer « ${a.titreFr} » ?`)) return;
    saveDB({ ...db, articles: db.articles.filter((x) => x.id !== a.id) }, { entite: 'article', action: 'delete', detail: a.titreFr });
    push('Article supprimé', 'success');
  };

  return (
    <>
      <Head><title>Articles - Cauris Group</title><meta name="robots" content="noindex" /></Head>
      <AdminLayout title="" subtitle="" bare>
        <div className="art-wrap">
          <div className="art-main">
            <div className="art-crumb">Accueil <span>›</span> Articles</div>
            <div className="art-head">
              <div>
                <h1>Articles</h1>
                <p>Gérez et publiez vos articles pour informer, partager et valoriser votre expertise.</p>
              </div>
              <div className="art-head-actions">
                {!ro && <button className="art-btn-gold" onClick={() => setEditing({ ...empty })}><Plus size={15} /> Nouvel article</button>}
                <button className="art-btn-line" onClick={() => setShowFilters(true)}><SlidersHorizontal size={14} /> Filtres{(fCat !== 'toutes' || fStat !== 'tous') ? ' •' : ''}</button>
                <div className="art-head-search"><Search size={14} /><input placeholder="Rechercher un article..." value={q} onChange={(e) => setQ(e.target.value)} /></div>
              </div>
            </div>

            <div className="art-stats">
              {[
                { icon: FileText, v: total || 30, l: 'Total articles' },
                { icon: Eye, v: vues.toLocaleString('fr-FR'), l: 'Vues totales' },
                { icon: CalendarDays, v: duMois, l: 'Publié ce mois' },
                { icon: Archive, v: brouillons || 5, l: 'Brouillons' },
              ].map((s) => {
                const Icon = s.icon;
                return (<div key={s.l} className="art-stat"><span className="art-stat-ico"><Icon size={17} /></span><span><b>{s.v}</b><small>{s.l}</small></span></div>);
              })}
            </div>

            <div className="art-tabs">
              <div className="art-tabs-left">
                {([['tous', `Tous (${total || 30})`], ['publie', `Publié (${publies || 25})`], ['brouillon', `Brouillons (${brouillons || 5})`], ['archive', 'Planifiés (0)']] as const).map(([k, l]) => (
                  <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>
                ))}
              </div>
              <label className="art-sort">Trier par : <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="recent">Plus récents</option><option value="old">Plus anciens</option></select></label>
            </div>

            <div className="art-grid">
              <AnimatePresence>
                {all.map((a, i) => (
                  <motion.article key={a.id} className="art-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} layout>
                    <div className="art-img">
                      <img src={a.image || demoImgs[i % demoImgs.length]} alt={a.titreFr} />
                      <span className={`art-pill ${a.statut === 'publie' ? 'green' : 'gold'}`}>{a.statut === 'publie' ? '● Publié' : '● Brouillon'}</span>
                      <span className="art-date">{fmtDate(a.datePublication)}</span>
                    </div>
                    <div className="art-body">
                      <small>{a.categorie}</small>
                      <b>{a.titreFr || 'Sans titre'}</b>
                      <p>{a.extraitFr || (a.contenuFr || '').slice(0, 110) || 'Extrait à compléter dans l’éditeur.'}</p>
                      <div className="art-foot">
                        <span><Eye size={13} /> {a.vues || 0}</span>
                        <span><MessageSquare size={13} /> 0</span>
                        {!ro && (<><button onClick={() => setEditing(a)} title="Modifier"><Pencil size={13} /> Modifier</button><button onClick={() => onDelete(a)} title="Supprimer"><Trash2 size={13} /></button></>)}
                        <span style={{ marginLeft: 'auto' }}>•••</span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
            {all.length === 0 && <div className="empty">Aucun article dans cet onglet.</div>}
          </div>

          <aside className="art-side">
            <div className="art-quote">“Informer aujourd’hui,<br />construire demain.”<small>Cauris Group International</small></div>
            <div className="art-panel">
              <div className="art-panel-head"><b>Derniers articles</b><span>Voir tout →</span></div>
              {db.articles.slice(0, 5).map((a, i) => (
                <div key={a.id} className="art-latest">
                  <img src={a.image || demoImgs[i % demoImgs.length]} alt="" />
                  <div><b>{a.titreFr.slice(0, 60)}</b><small>• {fmtDate(a.datePublication)} <i className={a.statut === 'publie' ? 'g' : 'o'}>● {a.statut === 'publie' ? 'Publié' : 'Brouillon'}</i></small></div>
                </div>
              ))}
            </div>
            {!ro && (
              <button className="art-cta" onClick={() => setEditing({ ...empty })}>
                <span className="art-cta-ico">✎</span>
                <span><b>Rédiger un nouvel article</b><small>Partagez votre actualité, vos conseils et vos projets.</small></span>
                <span className="art-cta-go">→</span>
              </button>
            )}
          </aside>
        </div>

        <Modal open={showFilters} title="Filtrer les articles" onClose={() => setShowFilters(false)} onSave={() => { setShowFilters(false); push('Filtres appliqués', 'success'); }} saveLabel="Appliquer">
          <label><span>Catégorie</span>
            <select value={fCat} onChange={(e) => setFCat(e.target.value)}>
              <option value="toutes">Toutes catégories</option><option value="entreprise">Entreprise</option><option value="chantier">Chantier</option><option value="conseil">Conseil</option><option value="import-export">Import-Export</option>
            </select>
          </label>
          <label><span>Statut</span>
            <select value={fStat} onChange={(e) => setFStat(e.target.value)}>
              <option value="tous">Tous statuts</option><option value="brouillon">Brouillon</option><option value="publie">Publié</option><option value="archive">Archivé</option>
            </select>
          </label>
          <div className="full"><button className="art-btn-line" onClick={() => { setFCat('toutes'); setFStat('tous'); setTab('tous'); setQ(''); }}>Réinitialiser</button></div>
        </Modal>

        <Modal open={!!editing} title={editing?.id ? 'Éditer article' : 'Nouvel article'} onClose={() => setEditing(null)} onSave={onSave}>
          {editing && (
            <>
              <label><span>Titre FR</span><input value={editing.titreFr} onChange={(e) => setEditing({ ...editing, titreFr: e.target.value, slug: editing.id ? editing.slug : slugify(e.target.value) })} /></label>
              <label><span>Titre EN</span><input value={editing.titreEn} onChange={(e) => setEditing({ ...editing, titreEn: e.target.value })} /></label>
              <label><span>Slug</span><input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} /></label>
              <label><span>Catégorie</span>
                <select value={editing.categorie} onChange={(e) => setEditing({ ...editing, categorie: e.target.value as Article['categorie'] })}>
                  <option value="entreprise">Entreprise</option><option value="chantier">Chantier</option><option value="conseil">Conseil</option><option value="import-export">Import-Export</option>
                </select>
              </label>
              <label><span>Statut</span>
                <select value={editing.statut} onChange={(e) => setEditing({ ...editing, statut: e.target.value as Article['statut'] })}>
                  <option value="brouillon">Brouillon</option><option value="publie">Publié</option><option value="archive">Archivé</option>
                </select>
              </label>
              <label><span>Date</span><input type="date" value={editing.datePublication} onChange={(e) => setEditing({ ...editing, datePublication: e.target.value })} /></label>
              <label className="full"><span>Image</span><input value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} /></label>
              <label className="full"><span>Extrait FR</span><input value={editing.extraitFr} onChange={(e) => setEditing({ ...editing, extraitFr: e.target.value })} /></label>
              <label className="full"><span>Contenu FR</span><textarea rows={4} value={editing.contenuFr} onChange={(e) => setEditing({ ...editing, contenuFr: e.target.value })} /></label>
              <label className="full"><span>Contenu EN</span><textarea rows={3} value={editing.contenuEn} onChange={(e) => setEditing({ ...editing, contenuEn: e.target.value })} /></label>
            </>
          )}
        </Modal>
      </AdminLayout>
    </>
  );
}
