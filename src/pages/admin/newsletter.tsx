import Head from 'next/head';
import { useMemo, useState } from 'react';
import { Search, Plus, Eye, Pencil, MoreVertical, Mail, Users, MousePointerClick, Link2, TrendingUp } from 'lucide-react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Modal } from '@/components/Admin/Modal';
import { useAdmin, isEmail, uid } from '@/lib/admin/AdminContext';
import { useToast } from '@/lib/admin/useToast';

type Camp = { id: string; sujet: string; extrait: string; type: 'Actualité' | 'Promotion' | 'Institutionnel' | 'Conseil'; date: string; heure: string; dest: number; ouv: string; delta: string; img: string };

const U = [
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1429497419816-9ca5cfb4571a?auto=format&fit=crop&w=400&q=80',
];

const base: Camp[] = [
  { id: 'c1', sujet: 'Nos nouveaux projets en cours', extrait: 'Découvrez les dernières avancées de nos chantiers au Bénin...', type: 'Actualité', date: '28 août 2025', heure: '10:24', dest: 3482, ouv: '32,6%', delta: '↑ +5%', img: U[0] },
  { id: 'c2', sujet: 'Offres spéciales construction', extrait: 'Profitez de nos solutions sur mesure pour vos projets immobiliers...', type: 'Promotion', date: '20 août 2025', heure: '09:17', dest: 3251, ouv: '26,8%', delta: '↑ +3%', img: U[1] },
  { id: 'c3', sujet: 'Cauris Group : notre vision', extrait: 'Ensemble pour un avenir durable et des infrastructures de qualité.', type: 'Institutionnel', date: '12 août 2025', heure: '14:03', dest: 3102, ouv: '30,1%', delta: '↑ +4%', img: U[2] },
  { id: 'c4', sujet: 'Conseils & Experts', extrait: 'Nos conseils pour bien préparer votre projet de construction.', type: 'Conseil', date: '05 août 2025', heure: '11:32', dest: 2876, ouv: '24,7%', delta: '↑ +2%', img: U[3] },
  { id: 'c5', sujet: 'Retour sur nos réalisations', extrait: 'Zoom sur le projet Résidence Les Palmiers.', type: 'Actualité', date: '28 juil. 2025', heure: '16:20', dest: 2634, ouv: '29,9%', delta: '↑ +5%', img: U[4] },
];

export default function AdminNewsletter() {
  const { db, saveDB, can } = useAdmin();
  const { push } = useToast();
  const [q, setQ] = useState('');
  const [camps, setCamps] = useState<Camp[]>(base);
  const [show, setShow] = useState(false);
  const [sujet, setSujet] = useState(''); const [type, setType] = useState<Camp['type']>('Actualité');
  const [email, setEmail] = useState(''); const [err, setErr] = useState('');
  const [showModels, setShowModels] = useState(false);
  const ro = !can('write');

  const models: { t: Camp['type']; s: string; d: string }[] = [
    { t: 'Actualité', s: 'Nos chantiers du mois', d: ' chantiers en cours et livraisons.' },
    { t: 'Promotion', s: 'Offre chantier : diagnostic gratuit', d: ' diagnostic gratuit pour tout devis signé.' },
    { t: 'Conseil', s: '5 conseils avant de construire', d: ' conseils d’experts pour vos projets.' },
  ];

  const actifs = db.newsletter.filter((n) => n.statut === 'actif').length;
  const filtered = useMemo(() => {
    if (!q.trim()) return camps;
    const s = q.toLowerCase();
    return camps.filter((c) => `${c.sujet} ${c.type}`.toLowerCase().includes(s));
  }, [camps, q]);

  const createCamp = () => {
    if (ro) return;
    if (!sujet || sujet.trim().length < 5) return push('Sujet requis (5 caractères)', 'error');
    setCamps([{ id: uid('nl'), sujet: sujet.trim(), extrait: 'Brouillon de campagne à compléter.', type, date: 'À l’instant', heure: '', dest: actifs || 3482, ouv: '0%', delta: '↑ +0%', img: U[0] }, ...camps]);
    push('Newsletter créée', 'success'); setShow(false); setSujet('');
  };

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault(); if (ro) return;
    if (!isEmail(email)) { setErr('Email invalide.'); return; }
    if (db.newsletter.some((n) => n.email.toLowerCase() === email.toLowerCase().trim())) { setErr('Email déjà inscrit.'); return; }
    setErr('');
    saveDB({ ...db, newsletter: [{ id: uid('nl'), email: email.trim(), statut: 'actif', consentRgpd: true, createdAt: new Date().toISOString() }, ...db.newsletter] }, { entite: 'newsletter', action: 'subscribe', detail: email });
    push('Abonné ajouté', 'success'); setEmail('');
  };

  return (
    <>
      <Head><title>Newsletters - Cauris Group</title><meta name="robots" content="noindex" /></Head>
      <AdminLayout title="" subtitle="" bare>
        <div className="art-crumb">Accueil <span>›</span> Newsletter</div>
        <div className="art-head">
          <div><h1>Newsletters</h1><p>Créez, gérez et suivez vos campagnes d’emailing.</p></div>
          <div className="art-head-actions">
            {!ro && <button className="art-btn-gold" onClick={() => setShow(true)}><Plus size={14} /> Nouvelle newsletter</button>}
            <button className="art-btn-line" onClick={() => setShowModels(true)}>Modèles</button>
            <div className="art-head-search"><Search size={14} /><input placeholder="Rechercher une newsletter..." value={q} onChange={(e) => setQ(e.target.value)} /></div>
          </div>
        </div>

        <div className="nl-stats">
          {[
            { icon: Mail, v: '12', l: 'Campagnes envoyées', s: 'Ce mois-ci', t: '↑ +20%' },
            { icon: Users, v: (actifs || 3482).toLocaleString('fr-FR'), l: 'Abonnés', s: 'Total', t: '↑ +12%' },
            { icon: SendIcon, v: '28,4%', l: "Taux d'ouverture", s: 'Moyenne', t: '↑ +6%' },
            { icon: Link2, v: '12,7%', l: 'Taux de clics', s: 'Moyenne', t: '↑ +4%' },
            { icon: TrendingUp, v: '0,8%', l: 'Désabonnements', s: 'Moyenne', t: '↓ -0,5%', down: true },
          ].map((x) => {
            const Icon = x.icon;
            return (<div key={x.l} className="art-stat"><span className="art-stat-ico"><Icon size={16} /></span><span><b>{x.v} <em className={x.down ? 'down' : 'up'}>{x.t}</em></b><small>{x.l}</small><small className="dim">{x.s}</small></span></div>);
          })}
        </div>

        <div className="nl-grid">
          <div className="nl-table-wrap">
            <div className="dash-panel-head" style={{ padding: '16px 18px 0' }}><b>Dernières newsletters</b><span>Voir toutes →</span></div>
            <table className="prj-table">
              <thead><tr><th>Sujet</th><th>Type</th><th>Date d’envoi</th><th>Destinataires</th><th>Taux d’ouverture</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td><span className="prj-proj"><img src={c.img} alt="" style={{ width: 64, height: 48 }} /><span><b>{c.sujet}</b><small>{c.extrait}</small></span></span></td>
                    <td><span className={`nl-type ${c.type}`}>{c.type}</span></td>
                    <td>{c.date}<br /><small>{c.heure}</small></td>
                    <td><b>{c.dest.toLocaleString('fr-FR')}</b></td>
                    <td><b>{c.ouv}</b><br /><small className="up">{c.delta}</small></td>
                    <td><span className="row-actions"><button title="Voir"><Eye size={14} /></button><button title="Éditer"><Pencil size={14} /></button><button title="Plus">⋮</button></span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="empty">Aucune campagne trouvée.</div>}
            <div className="prj-pager"><span>Affichage de 1 à {filtered.length} sur 12 newsletters</span><span><button>‹</button><button className="on">1</button><button>2</button><button>3</button><button>›</button></span></div>

            {!ro && (
              <form onSubmit={subscribe} style={{ display: 'flex', gap: 8, padding: 14, borderTop: '1px solid #f1ecdd' }}>
                <input placeholder="Ajouter un abonné (email)" value={email} onChange={(e) => setEmail(e.target.value)} style={{ flex: 1, border: '1px solid #e4ddc8', borderRadius: 8, padding: '9px 12px' }} />
                <button className="art-btn-gold" type="submit">Inscrire</button>
              </form>
            )}
            {err && <div className="adm-err" style={{ margin: '0 14px 14px' }}>{err}</div>}
          </div>

          <aside className="art-side">
            <div className="nl-cta">
              <b>Communiquez<br />avec votre audience</b>
              <p>Partagez vos actualités, vos projets et vos offres avec vos abonnés. Une communication efficace pour renforcer votre image et fidéliser votre communauté.</p>
              {!ro && <button className="art-btn-gold" onClick={() => setShow(true)}>Créer une newsletter →</button>}
            </div>
            <div className="art-panel">
              <div className="art-panel-head"><b>Derniers abonnés</b><span>Voir tout →</span></div>
              {db.newsletter.slice(0, 4).map((n, i) => (
                <div key={n.id} className="art-latest">
                  <span className="msg-av">@</span>
                  <div><b>{n.email.split('@')[0].replace(/^\w/, (c) => c.toUpperCase())}</b><small>{n.email}<br />• {new Date(n.createdAt).toLocaleDateString('fr-FR')} • <i className={n.statut === 'actif' ? 'g' : 'o'}>{n.statut === 'actif' ? ['Construction', 'Immobilier', 'BTP', 'Services'][i % 4] : 'Désinscrit'}</i> <i className="g"> Nouveau</i></small></div>
                  {!ro && <span style={{ display: 'flex', gap: 6 }}><button onClick={() => saveDB({ ...db, newsletter: db.newsletter.map((x) => (x.id === n.id ? { ...x, statut: x.statut === 'actif' ? 'desinscrit' : 'actif' } : x)) }, { entite: 'newsletter', action: 'toggle', detail: n.email })} title="Basculer">⇄</button></span>}
                </div>
              ))}
            </div>
            <div className="art-panel">
              <b>💡 Astuce</b>
              <p className="muted" style={{ fontSize: 12 }}>Programmez vos newsletters pour atteindre votre audience au meilleur moment.</p>
              <div style={{ fontSize: 12 }}>En savoir plus →</div>
            </div>
          </aside>
        </div>

        <Modal open={showModels} title="Choisir un modèle" onClose={() => setShowModels(false)} onSave={() => setShowModels(false)} saveLabel="Fermer">
          {models.map((m) => (
            <button key={m.s} className="art-panel" style={{ textAlign: 'left', cursor: 'pointer' }} onClick={() => { setSujet(m.s); setType(m.t); setShowModels(false); setShow(true); }}>
              <b>{m.s}</b><p className="muted" style={{ fontSize: 12 }}>{m.t} — {m.d}</p>
            </button>
          ))}
        </Modal>

        <Modal open={show} title="Nouvelle newsletter" onClose={() => setShow(false)} onSave={createCamp} saveLabel="Créer">
          <label><span>Sujet</span><input value={sujet} onChange={(e) => setSujet(e.target.value)} /></label>
          <label><span>Type</span>
            <select value={type} onChange={(e) => setType(e.target.value as Camp['type'])}>
              <option>Actualité</option><option>Promotion</option><option>Institutionnel</option><option>Conseil</option>
            </select>
          </label>
        </Modal>
      </AdminLayout>
    </>
  );
}

function SendIcon(props: { size?: number }) {
  return (<span style={{ fontSize: props.size }}>➤</span>);
}
