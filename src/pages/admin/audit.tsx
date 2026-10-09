import Head from 'next/head';
import { useMemo, useState } from 'react';
import { Search, Plus, Download } from 'lucide-react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Modal } from '@/components/Admin/Modal';
import { useAdmin, uid } from '@/lib/admin/AdminContext';
import { useToast } from '@/lib/admin/useToast';

const demo = [
  { d: '31 août 2025 14:32', type: 'Projet', t: 'Mise à jour du projet Résidence Les Palmiers', s: 'Le statut du projet passe en ‘En cours’.', u: 'Koffi Mensah', r: 'Administrateur' },
  { d: '31 août 2025 11:20', type: 'Utilisateur', t: 'Connexion de Marie-Louise Agbodjinou', s: 'L’utilisateur s’est connecté au système.', u: 'Marie-Louise Agbodjinou', r: 'Responsable projet' },
  { d: '31 août 2025 09:15', type: 'Article', t: 'Nouvel article publié : Innovations BTP 2025', s: 'L’article a été publié sur le site.', u: 'Sébastien Dossou', r: 'Ingénieur BTP' },
  { d: '30 août 2025 16:45', type: 'Système', t: 'Sauvegarde automatique des données', s: 'La sauvegarde a été effectuée avec succès.', u: 'Système', r: 'Automatique' },
  { d: '30 août 2025 14:02', type: 'Message', t: 'Nouveau message reçu', s: 'De : Chantal Agbodjinou – Sujet : Demande d’information', u: 'Chantal Agbodjinou', r: 'Secrétaire' },
  { d: '29 août 2025 10:37', type: 'Projet', t: 'Ajout d’un document au projet Centre Commercial', s: 'Plan d’architecture ajouté par Lionel Biaou.', u: 'Lionel Biaou', r: 'Architecte' },
  { d: '28 août 2025 15:22', type: 'Paramètre', t: 'Modification des paramètres de sécurité', s: 'La politique de mot de passe a été mise à jour.', u: 'Administrateur', r: 'Super administrateur' },
  { d: '27 août 2025 09:12', type: 'Service', t: 'Nouvelle demande de service', s: 'Demande de devis pour aménagement intérieur.', u: 'Koffi Tchibozo', r: 'Client' },
];

const AV = [
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
];

function badge(type: string) {
  if (type === 'Projet') return 'j-projet';
  if (type === 'Utilisateur') return 'j-user';
  if (type === 'Article' || type === 'Service') return 'j-green';
  if (type === 'Message') return 'j-orange';
  if (type === 'Paramètre') return 'j-user';
  return 'j-gray';
}

export default function AdminAudit() {
  const { db, saveDB, can } = useAdmin();
  const { push } = useToast();
  const [q, setQ] = useState('');
  const [fType, setFType] = useState('tous');
  const [fUser, setFUser] = useState('tous');
  const [show, setShow] = useState(false);
  const [titre, setTitre] = useState(''); const [type, setType] = useState('Système');
  const ro = !can('write');

  const rows = useMemo(() => {
    const real = db.audit.map((a) => ({
      d: new Date(a.date).toLocaleString('fr-FR'), type: a.entite.charAt(0).toUpperCase() + a.entite.slice(1),
      t: `${a.action} : ${a.detail}`.slice(0, 90), s: a.detail.slice(0, 80), u: a.utilisateur, r: a.entite,
    }));
    const all = [...real, ...demo.map((x) => ({ ...x }))];
    return all.filter((r) => {
      if (fType !== 'tous' && r.type.toLowerCase() !== fType) return false;
      if (fUser !== 'tous' && !r.u.toLowerCase().includes(fUser)) return false;
      if (q.trim() && !`${r.t} ${r.s} ${r.u} ${r.type}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    }).slice(0, 48);
  }, [db.audit, q, fType, fUser]);

  const users = useMemo(() => Array.from(new Set(rows.map((r) => r.u))).slice(0, 12), [rows]);

  const create = () => {
    if (ro) return;
    if (!titre || titre.trim().length < 4) return push('Titre requis', 'error');
    saveDB({ ...db, audit: [{ id: uid('aud'), date: new Date().toISOString(), utilisateur: 'admin', entite: type.toLowerCase(), action: 'manuel', detail: titre.trim() }, ...db.audit].slice(0, 500) }, undefined);
    push('Entrée ajoutée', 'success'); setShow(false); setTitre('');
  };

  return (
    <>
      <Head><title>Journal - Cauris Group</title><meta name="robots" content="noindex" /></Head>
      <AdminLayout title="" subtitle="" bare>
        <div className="art-crumb">Accueil <span>›</span> Journal</div>
        <div className="art-head">
          <div><h1>Journal</h1><p>Consultez et gérez les activités, événements et mises à jour du système.</p></div>
          <div className="art-head-actions">
            {!ro && <button className="art-btn-gold" onClick={() => setShow(true)}><Plus size={14} /> Nouvelle entrée</button>}
            <button className="art-btn-line" onClick={() => { const b = new Blob([JSON.stringify(db.audit, null, 2)], { type: 'application/json' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'journal.json'; a.click(); }}><Download size={14} /> Exporter</button>
          </div>
        </div>

        <div className="art-stats">
          {[
            { v: `${db.audit.length + 48 || 48}`, l: 'Total des entrées', s: 'Cette semaine', t: '↑ +12%' },
            { v: '18', l: 'Activités utilisateurs', s: 'Cette semaine', t: '↑ +8%' },
            { v: '12', l: 'Mises à jour système', s: 'Cette semaine', t: '↑ +25%' },
            { v: '5', l: 'Événements importants', s: 'Cette semaine', t: '↑ +5%' },
          ].map((x) => (<div key={x.l} className="art-stat"><span className="art-stat-ico">▤</span><span><b>{x.v} <em className="up">{x.t}</em></b><small>{x.l}</small><small className="dim">{x.s}</small></span></div>))}
        </div>

        <div className="j-grid">
          <div>
            <div className="prj-tabs">
              <div className="art-head-search" style={{ flex: 1 }}><Search size={14} /><input placeholder="Rechercher dans le journal..." value={q} onChange={(e) => setQ(e.target.value)} /></div>
              <select value={fType} onChange={(e) => setFType(e.target.value)}><option value="tous">Tous les types</option><option value="projet">Projet</option><option value="utilisateur">Utilisateur</option><option value="article">Article</option><option value="message">Message</option><option value="système">Système</option></select>
              <select value={fUser} onChange={(e) => setFUser(e.target.value)}><option value="tous">Tous les utilisateurs</option>{users.map((u) => (<option key={u} value={u.toLowerCase()}>{u}</option>))}</select>
              <span className="dash-range">📅 01/08/2025 - 31/08/2025</span>
            </div>
            <div className="prj-table-wrap">
              <table className="prj-table">
                <thead><tr><th>Date &amp; Heure</th><th>Type</th><th>Titre / Description</th><th>Utilisateur</th><th>Détails</th></tr></thead>
                <tbody>
                  {rows.slice(0, 8).map((r, i) => (
                    <tr key={`${r.d}-${i}`}>
                      <td><span className="j-date"><i>▤</i> {r.d}</span></td>
                      <td><span className={`nl-type ${badge(r.type)}`}>{r.type}</span></td>
                      <td><b>{r.t}</b><br /><small>{r.s}</small></td>
                      <td><span className="prj-proj"><img src={AV[i % AV.length]} alt="" style={{ borderRadius: '50%' }} /><span><b>{r.u}</b><small>{r.r}</small></span></span></td>
                      <td><button className="art-btn-line" onClick={() => push(r.t, 'info')}>Voir plus →</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length === 0 && <div className="empty">Aucune entrée.</div>}
              <div className="prj-pager"><span>Affichage de 1 à 8 sur 48 entrées</span><span><button>‹</button><button className="on">1</button><button>2</button><button>3</button><button>4</button><button>5</button><button>›</button></span></div>
            </div>
          </div>
          <aside className="art-side">
            <div className="art-panel">
              <b> Répartition par type</b>
              <div className="dash-donut-wrap" style={{ marginTop: 10 }}>
                <svg viewBox="0 0 120 120" className="dash-donut">
                  <circle cx="60" cy="60" r="44" fill="none" stroke="#3a5a9c" strokeWidth="14" strokeDasharray="88 276.5" strokeDashoffset="69" transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="44" fill="none" stroke="#7b5ea7" strokeWidth="14" strokeDasharray="38 276.5" strokeDashoffset="-19" transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="44" fill="none" stroke="#1e8e5a" strokeWidth="14" strokeDasharray="33 276.5" strokeDashoffset="-57" transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="44" fill="none" stroke="#5b6b84" strokeWidth="14" strokeDasharray="27 276.5" strokeDashoffset="-90" transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="44" fill="none" stroke="#e85d3a" strokeWidth="14" strokeDasharray="22 276.5" strokeDashoffset="-117" transform="rotate(-90 60 60)" />
                  <text x="60" y="58" textAnchor="middle" fontSize="20" fontWeight="800" fill="#0a1f44">48</text>
                  <text x="60" y="72" textAnchor="middle" fontSize="9" fill="#8a94a6">entrées</text>
                </svg>
                <ul>
                  <li><i style={{ background: '#3a5a9c' }} /> Projets <b>32%</b></li>
                  <li><i style={{ background: '#7b5ea7' }} /> Utilisateurs <b>14%</b></li>
                  <li><i style={{ background: '#1e8e5a' }} /> Articles <b>12%</b></li>
                  <li><i style={{ background: '#5b6b84' }} /> Système <b>10%</b></li>
                  <li><i style={{ background: '#e85d3a' }} /> Messages <b>8%</b></li>
                  <li><i style={{ background: '#d9c48a' }} /> Autres <b>24%</b></li>
                </ul>
              </div>
            </div>
            <div className="art-panel">
              <div className="art-panel-head"><b>Entrées récentes</b><span>Voir tout →</span></div>
              {demo.slice(0, 5).map((d, i) => (
                <div key={d.t} className="art-latest"><span className="art-stat-ico" style={{ width: 30, height: 30 }}>▤</span><div><b>{d.t.slice(0, 34)}</b><small>{d.d}</small></div></div>
              ))}
            </div>
            <div className="prj-cta">
              <b>Le journal vous aide à garder une trace de toutes les activités.</b>
              <p>Restez informé, restez maître de vos projets.</p>
              <button className="art-btn-gold" onClick={() => push('Historique complet (48 entrées)', 'info')}>Voir toute l’historique →</button>
            </div>
          </aside>
        </div>

        <Modal open={show} title="Nouvelle entrée" onClose={() => setShow(false)} onSave={create} saveLabel="Ajouter">
          <label><span>Type</span><select value={type} onChange={(e) => setType(e.target.value)}><option>Système</option><option>Projet</option><option>Article</option><option>Message</option><option>Utilisateur</option></select></label>
          <label className="full"><span>Titre / détail</span><input value={titre} onChange={(e) => setTitre(e.target.value)} /></label>
        </Modal>
      </AdminLayout>
    </>
  );
}
