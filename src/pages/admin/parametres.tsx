import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Modal } from '@/components/Admin/Modal';
import { useAdmin, isEmail } from '@/lib/admin/AdminContext';
import { useToast } from '@/lib/admin/useToast';
import { Parametres } from '@/lib/admin/types';

const tabs = ['Général', 'Compte', 'Sécurité', 'Notifications', 'Apparence', 'Intégrations', 'Sauvegarde'];

export default function AdminParametres() {
  const { db, saveDB, can, exportFile } = useAdmin();
  const { push } = useToast();
  const [tab, setTab] = useState('Général');
  const [f, setF] = useState<Parametres>(db.parametres);
  const [edit, setEdit] = useState(false);
  const [maint, setMaint] = useState(false);
  const [statsPub, setStatsPub] = useState(true);
  const [rapports, setRapports] = useState(true);
  useEffect(() => setF(db.parametres), [db.parametres]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cauris_prefs_v1');
      if (raw) { const p = JSON.parse(raw); setMaint(!!p.maint); setStatsPub(p.statsPub !== false); setRapports(p.rapports !== false); }
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem('cauris_prefs_v1', JSON.stringify({ maint, statsPub, rapports })); } catch {}
  }, [maint, statsPub, rapports]);
  if (!can('admin')) return (<><Head><title>Paramètres</title></Head><AdminLayout title="Paramètres"><p className="adm-err">Réservé au rôle admin.</p></AdminLayout></>);

  const save = () => {
    const errs: string[] = [];
    if (!isEmail(f.email)) errs.push('Email société invalide.');
    if (f.projetsRealises < 0) errs.push('Projets ≥ 0.');
    if (errs.length) return push(errs[0], 'error');
    saveDB({ ...db, parametres: f }, { entite: 'parametres', action: 'update', detail: 'coordonnées' });
    push('Paramètres enregistrés', 'success'); setEdit(false);
  };

  return (
    <>
      <Head><title>Paramètres - Cauris Group</title><meta name="robots" content="noindex" /></Head>
      <AdminLayout title="" subtitle="" bare>
        <div className="art-crumb">Accueil <span>›</span> Paramètres</div>
        <div className="art-head"><div><h1>Paramètres</h1><p>Gérez les paramètres de votre plateforme, la sécurité et vos préférences.</p></div></div>

        <div className="prm-tabs">
          {tabs.map((t) => (<button key={t} className={tab === t ? 'on' : ''} onClick={() => { setTab(t); if (t !== 'Général') push(`${t} (démo visuelle)`, 'info'); }}> {t}</button>))}
        </div>

        <div className="prm-grid">
          <div>
            <div className="art-panel">
              <div className="dash-panel-head"><b>🏢 Informations de l’entreprise</b><span>Modifiez les informations principales de votre entreprise.</span></div>
              <div style={{ textAlign: 'right' }}><button className="art-btn-gold" onClick={() => setEdit(true)}><Pencil size={13} /> Modifier</button></div>
              <div className="prm-company">
                <div className="prm-logo">C<span className="prm-logo-edit">✎</span></div>
                <div>
                  <small>Nom de l’entreprise</small><b>{f.nomSociete}</b>
                  <small>Secteur d’activité</small><b>Construction, BTP, Développement</b>
                  <small>Slogan</small><b>{f.sloganFr}</b>
                </div>
                <div className="prm-right">
                  <small>Adresse</small><b>{f.adresse}</b>
                  <small>Email principal</small><b>{f.email}</b>
                  <small>Téléphone</small><b>{f.phone1}</b>
                </div>
              </div>
            </div>

            <div className="art-panel">
              <b>🎚 Préférences générales</b><p className="muted">Configurez les préférences d’affichage et de fonctionnement.</p>
              <div className="prm-cols">
                <div>
                  <label>Langue de l’interface<select><option>🇫🇷 Français</option><option>🇬🇧 English</option></select></label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <label style={{ flex: 1 }}>Fuseau horaire<select><option>(UTC+01:00) Afrique/Porto-Novo</option></select></label>
                    <label style={{ flex: 1 }}>Format de date<select><option>DD/MM/YYYY</option></select></label>
                  </div>
                </div>
                <div className="prm-toggles">
                  <Toggle off={!maint} title="Activer le mode maintenance" sub="La plateforme sera temporairement inaccessible." onClick={() => setMaint(!maint)} />
                  <Toggle off={statsPub} title="Afficher les statistiques publiques" sub="Les données de base seront visibles pour les visiteurs." onClick={() => setStatsPub(!statsPub)} />
                  <Toggle off={rapports} title="Recevoir les rapports par email" sub="Recevez un récapitulatif quotidien de l’activité." onClick={() => setRapports(!rapports)} />
                </div>
              </div>
            </div>

            <div className="art-panel">
              <b>📍 Localisation &amp; Monnaie</b><p className="muted">Définissez votre localisation et vos préférences monétaires.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                <label>Pays<select><option>Bénin</option></select></label>
                <label>Ville<select><option>Cotonou</option><option>Bassila</option><option>Parakou</option></select></label>
                <label>Devise principale<select><option>Franc CFA (XOF)</option></select></label>
                <label>Région<select><option>Afrique de l’Ouest</option></select></label>
              </div>
            </div>
          </div>

          <aside className="art-side">
            <div className="art-panel">
              <div className="art-panel-head"><b>👤 Votre compte</b><span>Voir profil →</span></div>
              <div style={{ textAlign: 'center' }}>
                <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=200&q=80" alt="" style={{ width: 72, height: 72, borderRadius: '50%' }} />
                <b style={{ display: 'block', marginTop: 8 }}>Koffi Mensah</b>
                <small>Administrateur<br />mensah.koffi@gmail.com<br />+229 01 23 45 67</small>
                <div><span className="prj-pill run">✦ En ligne</span></div>
              </div>
            </div>
            <div className="art-panel">
              <b>⚡ Actions rapides</b>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                <button className="art-btn-line" onClick={() => push('Profil (démo)', 'info')}>Modifier le profil</button>
                <button className="art-btn-line" onClick={() => push('Mot de passe (démo)', 'info')}>Changer le mot de passe</button>
                <button className="art-btn-line" onClick={() => location.href = '/admin/utilisateurs'}>Gérer les utilisateurs</button>
                <button className="art-btn-line" onClick={() => { exportFile(); push('Sauvegarde téléchargée', 'success'); }}>Sauvegarder les données</button>
                <button className="art-btn-line" onClick={() => location.href = '/admin/audit'}>Voir les journaux</button>
              </div>
            </div>
            <div className="art-panel">
              <b>🎧 Besoin d’aide ?</b>
              <p className="muted" style={{ fontSize: 12 }}>Notre équipe est à votre écoute pour vous accompagner dans vos démarches.</p>
              <button className="art-btn-line" style={{ width: '100%' }} onClick={() => push('Support contacté (démo)', 'success')}>✉ Contacter le support</button>
            </div>
          </aside>
        </div>

        <Modal open={edit} title="Modifier l’entreprise" onClose={() => setEdit(false)} onSave={save}>
          <label className="full"><span>Nom société</span><input value={f.nomSociete} onChange={(e) => setF({ ...f, nomSociete: e.target.value })} /></label>
          <label><span>Slogan FR</span><input value={f.sloganFr} onChange={(e) => setF({ ...f, sloganFr: e.target.value })} /></label>
          <label><span>Email</span><input value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
          <label className="full"><span>Adresse</span><input value={f.adresse} onChange={(e) => setF({ ...f, adresse: e.target.value })} /></label>
          <label><span>Tél 1</span><input value={f.phone1} onChange={(e) => setF({ ...f, phone1: e.target.value })} /></label>
          <label><span>Projets réalisés</span><input type="number" min={0} value={f.projetsRealises} onChange={(e) => setF({ ...f, projetsRealises: Number(e.target.value) })} /></label>
        </Modal>
      </AdminLayout>
    </>
  );
}

function Toggle({ off, title, sub, onClick }: { off: boolean; title: string; sub: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'none', border: 0, cursor: 'pointer', textAlign: 'left', padding: '8px 0' }}>
      <span style={{ width: 38, height: 22, borderRadius: 999, background: off ? '#1e8e5a' : '#d1d5db', display: 'inline-block', position: 'relative', flexShrink: 0 }}>
        <i style={{ position: 'absolute', top: 2, left: off ? 18 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .2s' }} />
      </span>
      <span><b style={{ fontSize: 13 }}>{title}</b><small style={{ display: 'block', color: '#8a94a6' }}>{sub}</small></span>
    </button>
  );
}
