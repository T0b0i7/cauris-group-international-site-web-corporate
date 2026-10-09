import Head from 'next/head';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Briefcase, Building2, Users, ShieldCheck, Clock3, Headset, Pencil } from 'lucide-react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Modal } from '@/components/Admin/Modal';
import { useAdmin } from '@/lib/admin/AdminContext';
import { useToast } from '@/lib/admin/useToast';
import { ServiceItem } from '@/lib/admin/types';

const cats = ['Construction', 'Rénovation', 'Études & Conseil', 'Aménagement'] as const;
type Cat = typeof cats[number];
function catOf(s: ServiceItem, i: number): Cat {
  if (s.code === 's1') return 'Construction';
  if (s.code === 's3') return 'Rénovation';
  if (s.code === 's5' || s.code === 's6') return 'Études & Conseil';
  return (['Construction', 'Rénovation', 'Études & Conseil', 'Aménagement'] as Cat[])[i % 4];
}
const catImgs: Record<Cat, string> = {
  'Construction': 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
  'Rénovation': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
  'Études & Conseil': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
  'Aménagement': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
};

export default function AdminServices() {
  const { db, saveDB, can } = useAdmin();
  const { push } = useToast();
  const [q, setQ] = useState('');
  const [tab, setTab] = useState<'tous' | Cat>('tous');
  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const ro = !can('write');

  const ordered = useMemo(() => [...db.services].sort((a, b) => a.ordre - b.ordre), [db.services]);
  const list = ordered.map((s, i) => ({ s, cat: catOf(s, i) })).filter(({ s, cat }) => {
    if (tab !== 'tous' && cat !== tab) return false;
    if (q.trim() && !`${s.titreFr} ${s.titreEn} ${cat}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const count = (c: Cat) => ordered.filter((_, i) => catOf(ordered[i], i) === c).length;
  const actifs = db.services.filter((s) => s.actif).length;

  const toggle = (id: string) => {
    if (ro) return;
    saveDB({ ...db, services: db.services.map((s) => (s.id === id ? { ...s, actif: !s.actif } : s)) }, { entite: 'service', action: 'toggle-actif', detail: id });
    push('Statut mis à jour', 'success');
  };

  const onSave = () => {
    if (!editing || ro) return;
    if (!editing.titreFr || editing.titreFr.trim().length < 3) return push('Titre FR requis', 'error');
    saveDB({ ...db, services: db.services.map((s) => (s.id === editing.id ? editing : s)) }, { entite: 'service', action: 'update', detail: editing.titreFr });
    push('Service mis à jour', 'success'); setEditing(null);
  };

  return (
    <>
      <Head><title>Services - Cauris Group</title><meta name="robots" content="noindex" /></Head>
      <AdminLayout title="" subtitle="" bare>
        <div className="art-wrap">
          <div className="art-main">
            <div className="art-crumb">Accueil <span>›</span> Services</div>
            <div className="srv-hero">
              <div><h1>Services</h1><p>Des solutions complètes pour vos projets de construction et de développement.</p></div>
              <div className="srv-hero-quote"><span>Des services de qualité,<br />pour des projets durables.</span></div>
            </div>

            <div className="art-stats">
              {[
                { icon: Briefcase, v: `${actifs || 8}`, l: "SERVICES ACTIFS", s: 'Offres disponibles' },
                { icon: Building2, v: '124', l: 'PROJETS RÉALISÉS', s: 'Depuis notre création' },
                { icon: Users, v: '98%', l: 'CLIENTS SATISFAITS', s: 'Taux de satisfaction' },
                { icon: ShieldCheck, v: '5+', l: "ANNÉES D'EXPÉRIENCE", s: 'Dans le BTP et la construction' },
              ].map((x) => {
                const Icon = x.icon;
                return (<div key={x.l} className="art-stat"><span className="art-stat-ico"><Icon size={17} /></span><span><b>{x.v}</b><small>{x.l}</small><small className="dim">{x.s}</small></span></div>);
              })}
            </div>

            <div className="prj-tabs">
              <div className="prj-tabs-left">
                <button className={tab === 'tous' ? 'on' : ''} onClick={() => setTab('tous')}>Tous les services ({ordered.length || 8})</button>
                {cats.map((c) => (<button key={c} className={tab === c ? 'on' : ''} onClick={() => setTab(c)}>{c} ({count(c)})</button>))}
              </div>
              <div className="art-head-search"><Search size={14} /><input placeholder="Rechercher un service..." value={q} onChange={(e) => setQ(e.target.value)} /></div>
            </div>

            <div className="srv-grid">
              <AnimatePresence>
                {list.map(({ s, cat }) => (
                  <motion.article key={s.id} className="srv-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} layout>
                    <div className="srv-img"><img src={s.image || catImgs[cat]} alt={s.titreFr} /><span className="srv-badge">{cat}</span></div>
                    <div className="srv-ico">+</div>
                    <div className="srv-body">
                      <b>{s.titreFr}</b>
                      <p>{s.descFr || 'Description à compléter.'}</p>
                      <div className="srv-foot">
                        <span className={s.actif ? 'on' : 'off'}> {s.actif ? 'Actif' : 'Inactif'}</span>
                        {!ro && (<><button onClick={() => setEditing(s)}><Pencil size={12} /> Éditer</button><button onClick={() => toggle(s.id)}>{s.actif ? 'Désactiver' : 'Activer'}</button></>)}
                        <span style={{ marginLeft: 'auto' }} className="srv-more">En savoir plus →</span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
            {list.length === 0 && <div className="empty">Aucun service dans cette catégorie.</div>}
            <p style={{ fontSize: 12, color: '#8a94a6' }}>Règle : codes s1..s6 fixes, titres, descriptions, ordre et activation modifiables.</p>
          </div>

          <aside className="art-side">
            <div className="srv-cta">
              <b>Votre projet,<br />notre expertise</b>
              <p>Bénéficiez d’un accompagnement sur mesure pour tous vos besoins de construction et de développement.</p>
              <button className="art-btn-gold" onClick={() => push('Demande de devis transmise', 'success')}>Demander un devis →</button>
            </div>
            <div className="art-panel">
              <b>Pourquoi nous choisir ?</b>
              {[
                { icon: ShieldCheck, t: 'Qualité garantie', s: 'Matériaux et finitions haut de gamme' },
                { icon: Users, t: 'Équipe expérimentée', s: 'Professionnels qualifiés et engagés' },
                { icon: Clock3, t: 'Respect des délais', s: 'Livraison dans les temps' },
                { icon: Headset, t: 'Accompagnement personnalisé', s: 'Du conseil à la livraison' },
              ].map((x) => {
                const Icon = x.icon;
                return (<div key={x.t} className="art-latest"><span className="art-stat-ico"><Icon size={15} /></span><div><b>{x.t}</b><small>{x.s}</small></div></div>);
              })}
            </div>
            <div className="art-panel">
              <b>Besoin d’un conseil ?</b>
              <p className="muted" style={{ fontSize: 12 }}>Notre équipe est à votre écoute pour vous accompagner dans votre projet.</p>
              <button className="art-btn-line" onClick={() => push('Message transmis à l’équipe', 'success')}>✆ Nous contacter</button>
            </div>
            {!ro && <button className="art-btn-line" onClick={() => push('6 pôles fixes : utilisez Éditer sur une carte', 'info')}><Plus size={13} /> Gérer les pôles</button>}
          </aside>
        </div>

        <Modal open={!!editing} title="Éditer service" onClose={() => setEditing(null)} onSave={onSave}>
          {editing && (
            <>
              <label><span>Titre FR</span><input value={editing.titreFr} onChange={(e) => setEditing({ ...editing, titreFr: e.target.value })} /></label>
              <label><span>Titre EN</span><input value={editing.titreEn} onChange={(e) => setEditing({ ...editing, titreEn: e.target.value })} /></label>
              <label className="full"><span>Description FR</span><textarea rows={3} value={editing.descFr} onChange={(e) => setEditing({ ...editing, descFr: e.target.value })} /></label>
              <label className="full"><span>Description EN</span><textarea rows={3} value={editing.descEn} onChange={(e) => setEditing({ ...editing, descEn: e.target.value })} /></label>
              <label className="full"><span>Image</span><input value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} /></label>
            </>
          )}
        </Modal>
      </AdminLayout>
    </>
  );
}
