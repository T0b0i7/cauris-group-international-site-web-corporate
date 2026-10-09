import Head from 'next/head';
import { useMemo, useState } from 'react';
import { Search, Plus, Download, Eye, Pencil, MoreVertical, SlidersHorizontal } from 'lucide-react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Modal } from '@/components/Admin/Modal';
import { useAdmin, Rules, uid } from '@/lib/admin/AdminContext';
import { useToast } from '@/lib/admin/useToast';
import { Utilisateur, Role } from '@/lib/admin/types';

const AV = [
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
];

const demo = [
  { nom: 'Koffi Mensah', fonc: 'Administrateur', email: 'mensah.koffi@gmail.com', role: 'Super administrateur', dept: 'Direction', statut: 'Actif', last: '31 août 2025 14:32' },
  { nom: 'Marie-Louise Agbodjinou', fonc: 'Responsable projet', email: 'marie.abodjinou@gmail.com', role: 'Chef de projet', dept: 'Projets', statut: 'Actif', last: '30 août 2025 16:20' },
  { nom: 'Sébastien Dossou', fonc: 'Ingénieur BTP', email: 'sebastien.dossou@gmail.com', role: 'Ingénieur', dept: 'BTP', statut: 'Actif', last: '30 août 2025 11:45' },
  { nom: 'Aïcha Lawani', fonc: 'Responsable communication', email: 'aicha.lawani@gmail.com', role: 'Communication', dept: 'Marketing', statut: 'Actif', last: '29 août 2025 09:12' },
  { nom: 'Lionel Biaou', fonc: 'Comptable', email: 'lionel.biaou@gmail.com', role: 'Comptable', dept: 'Finance', statut: 'Actif', last: '28 août 2025 17:36' },
  { nom: 'Chantal Agbodjinou', fonc: 'Secrétaire', email: 'chantal.agbodjinou@gmail.com', role: 'Secrétaire', dept: 'Administration', statut: 'Actif', last: '28 août 2025 10:22' },
  { nom: 'Désiré Johnson', fonc: 'Responsable infrastructure', email: 'desire.johnson@gmail.com', role: 'Ingénieur', dept: 'Infrastructure', statut: 'En attente', last: 'Jamais connecté' },
  { nom: 'Koffi Tchibozo', fonc: 'Chef de projet', email: 'tchibozo.k@gmail.com', role: 'Chef de projet', dept: 'Projets', statut: 'Actif', last: '27 août 2025 15:10' },
];

export default function AdminUsers() {
  const { db, saveDB, can } = useAdmin();
  const { push } = useToast();
  const [q, setQ] = useState('');
  const [fRole, setFRole] = useState('tous');
  const [fStat, setFStat] = useState('tous');
  const [show, setShow] = useState(false);
  const [nom, setNom] = useState(''); const [email, setEmail] = useState(''); const [role, setRole] = useState<Role>('editeur'); const [pass, setPass] = useState('');
  const [sel, setSel] = useState<string[]>([]);
  const isAdmin = can('admin');

  const rows = useMemo(() => {
    const real = db.utilisateurs.map((u, i) => ({
      id: u.id, nom: u.nom, email: u.email,
      fonc: u.role === 'admin' ? 'Administrateur' : u.role === 'editeur' ? 'Équipe' : 'Invité',
      role: u.role === 'admin' ? 'Super administrateur' : u.role === 'editeur' ? 'Chef de projet' : 'Invité',
      dept: u.role === 'admin' ? 'Direction' : 'Projets',
      statut: u.actif ? 'Actif' : 'En attente',
      last: new Date(u.createdAt || Date.now()).toLocaleDateString('fr-FR'),
      img: AV[i % AV.length], real: u,
    }));
    const merged = [...real];
    demo.forEach((d, i) => { if (!merged.some((m) => m.email === d.email)) merged.push({ id: `demo-${i}`, ...d, img: AV[i % AV.length], real: null as unknown as Utilisateur }); });
    return merged.filter((r) => {
      if (fRole !== 'tous' && !r.role.toLowerCase().includes(fRole)) return false;
      if (fStat === 'actif' && r.statut !== 'Actif') return false;
      if (fStat === 'attente' && r.statut !== 'En attente') return false;
      if (q.trim() && !`${r.nom} ${r.email} ${r.role}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [db.utilisateurs, q, fRole, fStat]);

  const create = () => {
    const errs = Rules.utilisateur({ nom, email, password: pass }, db.utilisateurs.map((u) => u.email.toLowerCase()));
    if (!pass || pass.length < 8) errs.push('Mot de passe 8 caractères min.');
    if (errs.length) return push(errs[0], 'error');
    const n: Utilisateur = { id: uid('usr'), nom, email: email.trim(), role, actif: true, password: pass, createdAt: new Date().toISOString() };
    saveDB({ ...db, utilisateurs: [n, ...db.utilisateurs] }, { entite: 'utilisateur', action: 'create', detail: email });
    push('Utilisateur créé', 'success'); setShow(false); setNom(''); setEmail(''); setPass('');
  };

  const toggle = (id: string) => {
    if (id.startsWith('demo-')) return push('Ligne démo non modifiable', 'info');
    saveDB({ ...db, utilisateurs: db.utilisateurs.map((u) => (u.id === id ? { ...u, actif: !u.actif } : u)) }, { entite: 'utilisateur', action: 'toggle', detail: id });
  };

  return (
    <>
      <Head><title>Utilisateurs - Cauris Group</title><meta name="robots" content="noindex" /></Head>
      <AdminLayout title="" subtitle="" bare>
        {!isAdmin ? <p className="adm-err">Réservé au rôle admin.</p> : (
        <>
        <div className="art-crumb">Accueil <span>›</span> Utilisateurs</div>
        <div className="art-head">
          <div><h1>Utilisateurs</h1><p>Gérez les membres de votre équipe et leurs accès à la plateforme.</p></div>
          <div className="art-head-actions">
            <button className="art-btn-gold" onClick={() => setShow(true)}><Plus size={14} /> Nouvel utilisateur</button>
            <button className="art-btn-line" onClick={() => { const b = new Blob([JSON.stringify(db.utilisateurs, null, 2)], { type: 'application/json' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'utilisateurs.json'; a.click(); }}><Download size={14} /> Exporter</button>
          </div>
        </div>

        <div className="art-stats">
          {[
            { v: `${db.utilisateurs.length + 39 || 42}`, l: 'UTILISATEURS TOTAUX', s: 'Par rapport au mois dernier', t: '↑ +8%' },
            { v: '5', l: 'ADMINISTRATEURS', s: 'Accès complet', t: '↑ +0%' },
            { v: '32', l: 'ÉQUIPES / COLLABORATEURS', s: 'Accès restreints', t: '↑ +10%' },
            { v: `${db.utilisateurs.filter((u) => !u.actif).length || 3}`, l: 'EN ATTENTE', s: 'Comptes à valider', t: '↓ -25%', down: true },
          ].map((x) => (<div key={x.l} className="art-stat"><span className="art-stat-ico">*</span><span><b>{x.v} <em className={x.down ? 'down' : 'up'}>{x.t}</em></b><small>{x.l}</small><small className="dim">{x.s}</small></span></div>))}
        </div>

        <div className="usr-grid">
          <div>
            <div className="prj-tabs">
              <div className="art-head-search" style={{ flex: 1 }}><Search size={14} /><input placeholder="Rechercher un utilisateur par nom, email, rôle..." value={q} onChange={(e) => setQ(e.target.value)} /></div>
              <select value={fRole} onChange={(e) => setFRole(e.target.value)}><option value="tous">Tous les rôles</option><option value="super">Super administrateur</option><option value="chef">Chef de projet</option><option value="ingénieur">Ingénieur</option></select>
              <select value={fStat} onChange={(e) => setFStat(e.target.value)}><option value="tous">Tous les statuts</option><option value="actif">Actif</option><option value="attente">En attente</option></select>
              <button className="art-btn-line" onClick={() => push(`Filtres actifs : rôle=${fRole}, statut=${fStat}${q ? `, recherche="${q}"` : ''}`, 'success')}><SlidersHorizontal size={13} /> Filtres</button>
            </div>
            <div className="prj-table-wrap">
              <table className="prj-table">
                <thead><tr><th><input type="checkbox" onChange={(e) => setSel(e.target.checked ? rows.map((r) => r.id) : [])} /></th><th>Utilisateur</th><th>Email</th><th>Rôle</th><th>Département</th><th>Statut</th><th>Dernière connexion</th><th>Actions</th></tr></thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td><input type="checkbox" checked={sel.includes(r.id)} onChange={() => setSel((s) => (s.includes(r.id) ? s.filter((x) => x !== r.id) : [...s, r.id]))} /></td>
                      <td><span className="prj-proj"><img src={r.img} alt="" style={{ borderRadius: '50%' }} /><span><b>{r.nom}</b><small>{r.fonc}</small></span></span></td>
                      <td>{r.email}</td>
                      <td><span className="nl-type">{r.role}</span></td>
                      <td>{r.dept}</td>
                      <td>{r.statut === 'Actif' ? <span style={{ color: '#1e8e5a', fontWeight: 700 }}> Actif</span> : <span style={{ color: '#c98a12', fontWeight: 700 }}> En attente</span>}</td>
                      <td>{r.last}</td>
                      <td><span className="row-actions"><button title="Voir"><Eye size={14} /></button><button title="Activer/Bloquer" onClick={() => toggle(r.id)}><Pencil size={14} /></button><button title="Plus">⋮</button></span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length === 0 && <div className="empty">Aucun utilisateur.</div>}
              <div className="prj-pager"><span>Affichage de 1 à {rows.length} sur {rows.length} utilisateurs</span><span><button>‹</button><button className="on">1</button><button>›</button><button>»</button></span></div>
            </div>
          </div>
          <aside className="art-side">
            <div className="art-panel">
              <b>⧩ Filtres avancés</b>
              <label>Rôle<select value={fRole} onChange={(e) => setFRole(e.target.value)}><option value="tous">Tous les rôles</option><option value="super">Super administrateur</option><option value="chef">Chef de projet</option><option value="ingénieur">Ingénieur</option></select></label>
              <label>Département<select><option>Tous les départements</option><option>Direction</option><option>Projets</option><option>BTP</option></select></label>
              <label>Statut<select value={fStat} onChange={(e) => setFStat(e.target.value)}><option value="tous">Tous les statuts</option><option value="actif">Actif</option><option value="attente">En attente</option></select></label>
              <label>Date d’inscription<input type="date" /> </label>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}><button className="art-btn-line" style={{ flex: 1 }} onClick={() => { setFRole('tous'); setFStat('tous'); setQ(''); }}>Réinitialiser</button><button className="art-btn-gold" style={{ flex: 1 }} onClick={() => push('Filtres appliqués', 'success')}>Appliquer</button></div>
            </div>
            <div className="art-panel">
              <div className="art-panel-head"><b>Activité récente</b><span>Voir tout →</span></div>
              {[['Koffi Mensah', 'S’est connecté', '31 août 2025 • 14:32'], ['Marie-Louise Agbodjinou', 'A mis à jour son profil', '30 août 2025 • 16:20'], ['Nouveau utilisateur', 'En attente de validation', '30 août 2025 • 09:45'], ['Sébastien Dossou', 'A changé de rôle', '29 août 2025 • 11:12']].map(([a, b, c], i) => (
                <div key={a} className="art-latest"><img src={AV[i % AV.length]} alt="" style={{ borderRadius: '50%' }} /><div><b>{a}</b><small>{b}<br />{c}</small></div></div>
              ))}
            </div>
          </aside>
        </div>

        <Modal open={show} title="Nouvel utilisateur" onClose={() => setShow(false)} onSave={create} saveLabel="Créer">
          <label><span>Nom</span><input value={nom} onChange={(e) => setNom(e.target.value)} /></label>
          <label><span>Email</span><input value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label><span>Rôle</span><select value={role} onChange={(e) => setRole(e.target.value as Role)}><option value="admin">admin</option><option value="editeur">editeur</option><option value="lecteur">lecteur</option></select></label>
          <label><span>Mot de passe</span><input type="password" value={pass} onChange={(e) => setPass(e.target.value)} /></label>
        </Modal>
        </>
        )}
      </AdminLayout>
    </>
  );
}
