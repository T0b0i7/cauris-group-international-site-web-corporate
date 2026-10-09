import Head from 'next/head';
import { useMemo, useState } from 'react';
import { Search, Plus, Phone, Video, MoreVertical, Paperclip, Smile, Send, Download, Mail, StickyNote } from 'lucide-react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Modal } from '@/components/Admin/Modal';
import { useAdmin, Rules, uid } from '@/lib/admin/AdminContext';
import { useToast } from '@/lib/admin/useToast';
import { MessageContact } from '@/lib/admin/types';

const AV = [
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
];
const CHANT = [
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
];

function initials(n: string) { return n.split(' ').map((w) => w.charAt(0)).join('').slice(0, 2).toUpperCase(); }

export default function AdminMessages() {
  const { db, saveDB, can } = useAdmin();
  const { push } = useToast();
  const [q, setQ] = useState('');
  const [tab, setTab] = useState<'tous' | 'nonlus' | 'clients' | 'part'>('tous');
  const [sel, setSel] = useState<string | null>(db.messages[0]?.id ?? null);
  const [draft, setDraft] = useState('');
  const [thread, setThread] = useState<Record<string, { me: boolean; txt: string; h: string }[]>>({});
  const [showNew, setShowNew] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [fStat, setFStat] = useState('tous');
  const [nnom, setNnom] = useState(''); const [nemail, setNemail] = useState(''); const [nobjet, setNobjet] = useState(''); const [nmsg, setNmsg] = useState('');
  const ro = !can('write');

  const list = useMemo(() => {
    let l = [...db.messages];
    if (tab === 'nonlus') l = l.filter((m) => m.statut === 'nouveau');
    if (tab === 'clients') l = l.filter((_, i) => i % 2 === 0);
    if (tab === 'part') l = l.filter((_, i) => i % 2 === 1);
    if (fStat !== 'tous') l = l.filter((m) => m.statut === fStat);
    if (q.trim()) { const s = q.toLowerCase(); l = l.filter((m) => `${m.nom} ${m.email} ${m.objet} ${m.message}`.toLowerCase().includes(s)); }
    return l;
  }, [db.messages, tab, q, fStat]);

  const cur = db.messages.find((m) => m.id === sel) ?? list[0];
  const demoNames = ['André Sossou', 'Mireille Dossou', 'Koffi Tchibozo', 'Lionel Biaou', 'Chantal Agbodjinou', 'Désiré Johnson', 'Équipe Cauris', 'Léonard Tokpoh'];
  const demoRoles = ['Client - Résidence Les Palmiers', 'Partenaire - Fournisseur', 'Client - Centre commercial Cauris', 'Prospect', 'Client - Groupe scolaire La Paix', 'Fournisseur - Équipements', 'Communication interne', 'Client - Immeuble administratif'];
  const demoPrev = ['Bonjour, j’aimerais avoir plus d’informations...', 'Parfait, merci pour votre retour rapide !', 'Le devis est bien reçu. Pouvez-vous me confirmer...', 'Je souhaiterais visiter votre site pour un projet...', 'Merci pour les documents, tout est parfait !', 'Nous avons bien reçu votre demande. Nous...', 'Voici le planning de la réunion de ce vendredi.', 'Très bon travail sur la présentation du projet !'];
  const demoTimes = ['10:24', '09:48', 'Hier', 'Hier', '29 août', '28 août', '27 août', '26 août'];
  const curThread = (cur && thread[cur.id]) || [
    { me: false, txt: 'Bonjour, j’aimerais avoir plus d’informations sur l’avancement des travaux de ma maison à Cotonou. Est-ce que tout se passe comme prévu ?', h: '10:02' },
    { me: true, txt: 'Bonjour Monsieur Sossou, Oui, tout se déroule comme prévu. Les fondations sont terminées et la prochaine étape concerne l’élévation des murs. Nous vous envoyons ci-joint quelques photos du chantier.', h: '10:12' },
  ];

  const send = () => {
    if (!draft.trim() || !cur || ro) return;
    setThread((t) => ({ ...t, [cur.id]: [...curThread, { me: true, txt: draft.trim(), h: '10:24' }] }));
    saveDB({ ...db, messages: db.messages.map((m) => (m.id === cur.id ? { ...m, statut: 'en_cours' as const } : m)) }, { entite: 'message', action: 'reply', detail: cur.email });
    setDraft(''); push('Message envoyé', 'success');
  };

  const createMsg = () => {
    if (ro) return;
    const errs = Rules.message({ nom: nnom, email: nemail, objet: nobjet || 'Contact', message: nmsg });
    if (errs.length) return push(errs[0], 'error');
    const n: MessageContact = { id: uid('msg'), nom: nnom, email: nemail, objet: nobjet || 'Contact', message: nmsg, statut: 'nouveau', assigneA: '', createdAt: new Date().toISOString() };
    saveDB({ ...db, messages: [n, ...db.messages] }, { entite: 'message', action: 'create', detail: nemail });
    push('Message créé', 'success'); setShowNew(false); setNnom(''); setNemail(''); setNobjet(''); setNmsg(''); setSel(n.id);
  };

  return (
    <>
      <Head><title>Messages - Cauris Group</title><meta name="robots" content="noindex" /></Head>
      <AdminLayout title="" subtitle="" bare>
        <div className="art-crumb">Accueil <span>›</span> Messages</div>
        <div className="art-head">
          <div><h1>Messages</h1><p>Échanges avec vos clients, partenaires et membres de l’équipe.</p></div>
          <div className="art-head-actions">
            {!ro && <button className="art-btn-gold" onClick={() => setShowNew(true)}><Plus size={14} /> Nouveau message</button>}
            <div className="art-head-search"><Search size={14} /><input placeholder="Rechercher une conversation..." value={q} onChange={(e) => setQ(e.target.value)} /></div>
            <button className="art-btn-line" onClick={() => setShowFilters(true)}>Filtres{fStat !== 'tous' ? ' •' : ''}</button>
          </div>
        </div>

        <div className="art-stats">
          {[
            { v: `${db.messages.length || 156}`, l: 'Messages reçus', s: "Aujourd'hui", t: '↑ +12%' },
            { v: '48', l: 'Messages envoyés', s: "Aujourd'hui", t: '↑ +8%' },
            { v: '24', l: 'Conversations actives', s: 'En cours', t: '↑ +5%' },
            { v: '12', l: 'Nouveaux contacts', s: 'Cette semaine', t: '↑ +20%' },
          ].map((x) => (<div key={x.l} className="art-stat"><span className="art-stat-ico">✉</span><span><b>{x.v} <em className="up">{x.t}</em></b><small>{x.l}</small><small className="dim">{x.s}</small></span></div>))}
        </div>

        <div className="msg-grid">
          <div className="msg-list">
            <div className="prj-tabs-left" style={{ padding: 10 }}>
              {([['tous', `Toutes (${db.messages.length || 156})`], ['nonlus', `Non lus (${db.messages.filter((m) => m.statut === 'nouveau').length || 12})`], ['clients', 'Clients (48)'], ['part', 'Partenaires (23)']] as const).map(([k, l]) => (
                <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)} style={{ border: tab === k ? '0' : undefined, background: tab === k ? '#0a1f44' : undefined, color: tab === k ? '#fff' : undefined, borderRadius: 8, padding: '7px 12px', fontSize: 12 }}>{l}</button>
              ))}
            </div>
            {list.map((m, i) => (
              <button key={m.id} className={`msg-row${cur?.id === m.id ? ' on' : ''}`} onClick={() => setSel(m.id)}>
                {i === 0 ? <img src={AV[0]} alt="" /> : <span className={`msg-av${i === 6 ? ' team' : ''}`}>{i === 6 ? '⛑' : initials(demoNames[i % demoNames.length])}</span>}
                <span className="msg-row-txt"><b>{demoNames[i % demoNames.length]}</b><small>{demoRoles[i % demoRoles.length]}</small><small>{demoPrev[i % demoPrev.length]}</small></span>
                <span className="msg-row-meta"><small>{demoTimes[i % demoTimes.length]}</small>{i === 0 ? <i className="msg-unread">2</i> : i === 1 ? <i className="msg-unread">1</i> : <i className="msg-check">✓✓</i>}</span>
              </button>
            ))}
            <div className="prj-pager">Affichage de 1 à 8 sur 156 messages</div>
          </div>

          <div className="msg-chat">
            {cur ? (
              <>
                <div className="msg-chat-head">
                  <img src={AV[0]} alt="" />
                  <span><b>{cur.nom}</b><small>Client - Résidence Les Palmiers</small><small className="online"> En ligne</small></span>
                  <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}><Phone size={15} /><Video size={15} /><MoreVertical size={15} /></span>
                </div>
                <div className="msg-body">
                  <div className="msg-bub you">Bonjour, j’aimerais avoir plus d’informations sur l’avancement des travaux de ma maison à Cotonou. Est-ce que tout se passe comme <b>prévu ?</b><small>10:02</small></div>
                  <div className="msg-bub-wrap-me">
                    <div className="msg-bub me">Bonjour Monsieur Sossou,<br />Oui, tout se déroule comme prévu. Les fondations sont terminées et la prochaine étape concerne l’élévation des murs. Nous vous envoyons ci-joint quelques photos du chantier.<small>10:12 ✓✓</small></div>
                    <span className="msg-c">C</span>
                  </div>
                  {curThread.slice(2).map((b, i) => (
                    <div key={i} className={`msg-bub ${b.me ? 'me' : 'you'}`}>{b.txt}<small>{b.h}{b.me ? ' ✓✓' : ''}</small></div>
                  ))}
                  <div className="msg-photos">{CHANT.map((c) => (<img key={c} src={c} alt="chantier" />))}</div>
                  <div className="msg-file">Photos_chantier_palmiers.zip<small>2,4 Mo</small><Download size={14} /></div>
                  <div className="msg-bub you">Merci beaucoup pour ces informations. C’est rassurant. Pourriez-vous aussi me confirmer la date de livraison ?<small>10:24</small></div>
                </div>
                {!ro && (
                  <div className="msg-input"><Paperclip size={15} /><input placeholder="Écrivez votre message..." value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} /><Smile size={15} /><button className="msg-send" onClick={send}><Send size={15} /></button></div>
                )}
                {!ro && (
                  <div style={{ display: 'flex', gap: 8, padding: '0 14px 12px', fontSize: 12 }}>
                    <select value={cur.statut} onChange={(e) => saveDB({ ...db, messages: db.messages.map((m) => (m.id === cur.id ? { ...m, statut: e.target.value as MessageContact['statut'] } : m)) }, { entite: 'message', action: 'statut', detail: cur.id })}>
                      <option value="nouveau">nouveau</option><option value="en_cours">en cours</option><option value="traite">traité</option><option value="clos">clos</option>
                    </select>
                    <button onClick={() => { if (confirm('Supprimer (droit à l’effacement) ?')) saveDB({ ...db, messages: db.messages.filter((m) => m.id !== cur.id) }, { entite: 'message', action: 'delete', detail: cur.id }); }}>Supprimer</button>
                  </div>
                )}
              </>
            ) : <div className="empty">Sélectionnez une conversation.</div>}
          </div>

          <aside className="msg-side">
            {cur && (
              <>
                <div className="art-panel" style={{ textAlign: 'center' }}>
                  <img src={AV[0]} alt="" style={{ width: 56, height: 56, borderRadius: '50%' }} />
                  <b style={{ display: 'block', marginTop: 6 }}>{cur.nom}</b>
                  <small>{cur.email}<br />+229 97 12 34 56</small>
                  <div><span className="prj-pill run">Client</span></div>
                </div>
                <div className="art-panel">
                  <b>Informations</b>
                  <div className="art-latest"><span>🏢</span><div><small>Projet concerné</small><b>Résidence Les Palmiers</b></div></div>
                  <div className="art-latest"><span>🕒</span><div><small>Dernier contact</small><b>Aujourd’hui à 10:24</b></div></div>
                  <div className="art-latest"><span>👤</span><div><small>Statut</small><b className="prj-pill run">En cours</b></div></div>
                </div>
                <div className="art-panel">
                  <b>Pièces jointes</b>
                  <div className="art-latest"><span>📄</span><div><b>Devis_Les_Palmiers.pdf</b><small>1,8 Mo</small></div><Download size={14} /></div>
                  <div className="art-latest"><span>📄</span><div><b>Plan_architectural.pdf</b><small>4,2 Mo</small></div><Download size={14} /></div>
                  <div style={{ fontSize: 12 }}>Voir toutes les pièces jointes →</div>
                </div>
                <div className="art-panel">
                  <b>Actions rapides</b>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button className="art-btn-line" style={{ flex: 1 }} onClick={() => push('Appel lancé (démo)', 'info')}>Appeler</button>
                    <button className="art-btn-line" style={{ flex: 1 }} onClick={() => push('E-mail ouvert (démo)', 'info')}><Mail size={13} /> E-mail</button>
                  </div>
                  <button className="art-btn-line" style={{ width: '100%', marginTop: 8 }} onClick={() => push('Note ajoutée (démo)', 'success')}><StickyNote size={13} /> Ajouter une note</button>
                </div>
              </>
            )}
          </aside>
        </div>

        <Modal open={showFilters} title="Filtrer les conversations" onClose={() => setShowFilters(false)} onSave={() => { setShowFilters(false); push('Filtres appliqués', 'success'); }} saveLabel="Appliquer">
          <label><span>Statut</span>
            <select value={fStat} onChange={(e) => setFStat(e.target.value)}>
              <option value="tous">Tous statuts</option><option value="nouveau">Nouveau</option><option value="en_cours">En cours</option><option value="traite">Traité</option><option value="clos">Clos</option>
            </select>
          </label>
          <label><span>Onglet</span>
            <select value={tab} onChange={(e) => setTab(e.target.value as typeof tab)}>
              <option value="tous">Toutes</option><option value="nonlus">Non lus</option><option value="clients">Clients</option><option value="part">Partenaires</option>
            </select>
          </label>
          <div className="full"><button className="art-btn-line" onClick={() => { setFStat('tous'); setTab('tous'); setQ(''); }}>Réinitialiser</button></div>
        </Modal>

        <Modal open={showNew} title="Nouveau message" onClose={() => setShowNew(false)} onSave={createMsg}>
          <label><span>Nom</span><input value={nnom} onChange={(e) => setNnom(e.target.value)} /></label>
          <label><span>Email</span><input value={nemail} onChange={(e) => setNemail(e.target.value)} /></label>
          <label><span>Objet</span><input value={nobjet} onChange={(e) => setNobjet(e.target.value)} /></label>
          <label className="full"><span>Message</span><textarea rows={3} value={nmsg} onChange={(e) => setNmsg(e.target.value)} /></label>
        </Modal>
      </AdminLayout>
    </>
  );
}
