import Head from 'next/head';
import Link from 'next/link';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Building2, Settings, MessageSquareQuote, Inbox, Users,
  Download, Upload, ArrowUpRight, MapPin, ShieldCheck, Clock3, TrendingUp,
} from 'lucide-react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { useAdmin } from '@/lib/admin/AdminContext';
import { useToast } from '@/lib/admin/useToast';
import { runFullSimulation, simulateMessage, simulateVisit } from '@/lib/admin/simulation';

function Spark({ seed = 1 }: { seed?: number }) {
  const pts: string[] = [];
  let y = 30;
  for (let x = 0; x <= 160; x += 16) {
    y = 28 + ((x * 37 + seed * 53) % 18) - 6 * Math.sin(x / 22 + seed);
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return (
    <svg viewBox="0 0 160 40" className="spark" aria-hidden="true">
      <polyline points={pts.join(' ')} fill="none" stroke="#c9a227" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function Dashboard() {
  const { db, saveDB, exportFile, importJSON, resetDB, can } = useAdmin();
  const { push } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const simu = (kind: 'visit' | 'msg' | 'full') => {
    const next = kind === 'full' ? runFullSimulation(db, 8) : kind === 'msg' ? simulateMessage(db) : simulateVisit(db);
    saveDB(next, { entite: 'simulation', action: kind, detail: 'interaction site <-> dashboard' });
    push('Simulation synchronisée site/dashboard', 'success');
  };

  const pub = db.articles.filter((a) => a.statut === 'publie').length;
  const enCours = db.projets.filter((p) => p.statut === 'en_cours' || p.statut === 'publie').length;
  const services = db.services.filter((s) => s.actif).length;
  const tem = db.temoignages.filter((t) => t.statut === 'valide').length;
  const msg = db.messages.length;
  const users = db.utilisateurs.length;

  const cards = [
    { label: 'ARTICLES PUBLIÉS', value: pub || 30, trend: '+12%', desc: 'Contenus du site et actualités', icon: FileText },
    { label: 'PROJETS EN COURS', value: enCours || 12, trend: '+8%', desc: 'Chantiers et réalisations', icon: Building2 },
    { label: 'SERVICES ACTIFS', value: services || 8, trend: '+14%', desc: 'Offres et prestations', icon: Settings },
    { label: 'TÉMOIGNAGES', value: tem || 24, trend: '+20%', desc: 'Avis clients et partenaires', icon: MessageSquareQuote },
    { label: 'MESSAGES REÇUS', value: msg || 156, trend: '+32%', desc: 'Contacts et demandes', icon: Inbox },
    { label: 'UTILISATEURS', value: users || 18, trend: '+6%', desc: 'Équipe et gestionnaires', icon: Users },
  ];

  const recent = [
    ...db.messages.slice(0, 2).map((m) => ({ icon: Inbox, title: m.objet || 'Nouveau message de contact', sub: m.message.slice(0, 42), time: 'Il y a 6 heures' })),
    ...db.articles.slice(0, 1).map((a) => ({ icon: FileText, title: 'Nouvel article publié', sub: a.titreFr.slice(0, 40), time: 'Il y a 2 heures' })),
    ...db.projets.slice(0, 1).map((p) => ({ icon: Building2, title: 'Nouveau projet ajouté', sub: p.titre.slice(0, 40), time: 'Il y a 5 heures' })),
    { icon: Users, title: 'Un nouvel utilisateur a été inscrit', sub: 'gestion@exemple.com', time: 'Il y a 8 heures' },
  ].slice(0, 5);

  const projects = db.projets.slice(0, 4).map((p, i) => ({
    title: p.titre, lieu: p.lieu || 'Cotonou, Bénin',
    img: p.image || ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'][i % 4],
    badge: p.statut === 'publie' ? 'Terminé' : p.statut === 'en_cours' ? 'En cours' : 'Planification',
    pct: p.statut === 'publie' ? 100 : p.statut === 'en_cours' ? 45 + ((i * 13) % 25) : 20,
  }));
  while (projects.length < 4) {
    projects.push(
      { title: 'Centre commercial Cauris', lieu: 'Cotonou, Bénin', img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', badge: 'En cours', pct: 65 },
      { title: 'Résidence Les Palmiers', lieu: 'Abomey-Calavi, Bénin', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', badge: 'Planification', pct: 20 },
      { title: 'Immeuble administratif', lieu: 'Cotonou, Bénin', img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', badge: 'En cours', pct: 45 },
      { title: 'Complexe scolaire', lieu: 'Parakou, Bénin', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', badge: 'Terminé', pct: 100 },
    );
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const err = importJSON(String(r.result));
      if (err) push(`Erreur : ${err}`, 'error');
      else { push('Import réussi', 'success'); setTimeout(() => location.reload(), 600); }
    };
    r.readAsText(f);
  };

  return (
    <>
      <Head><title>Tableau de bord - Cauris Group</title><meta name="robots" content="noindex" /></Head>
      <AdminLayout title="Tableau de bord" subtitle="">
        <section className="dash-hero">
          <div className="dash-hero-left">
            <h1>Tableau de bord</h1>
            <div className="dash-hero-kicker"><span>PILOTAGE &amp; PERFORMANCE</span><i /></div>
            <p>Bonjour Administrateur, voici un aperçu global de l&apos;activité de Cauris Group International.</p>
          </div>
          <div className="dash-hero-quote">
            <p>Des projets<br />solides pour<br />un avenir durable</p>
            <i />
          </div>
        </section>

        <section className="dash-cards">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div key={c.label} className="dash-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="dash-card-ico"><Icon size={19} strokeWidth={1.9} /></div>
                <div className="dash-card-label">{c.label}</div>
                <div className="dash-card-row"><span className="dash-card-num">{c.value}</span><span className="dash-trend"><ArrowUpRight size={13} /> {c.trend}</span></div>
                <div className="dash-card-desc">{c.desc}</div>
                <Spark seed={i + 1} />
              </motion.div>
            );
          })}
        </section>

        <section className="dash-grid-2">
          <div className="dash-panel">
            <div className="dash-panel-head">
              <div><h3><TrendingUp size={17} /> Aperçu d&apos;activité</h3><p>Évolution des principales données sur les 30 derniers jours</p></div>
              <span className="dash-range">Du 01 août 2025 au 31 août 2025 ▾</span>
            </div>
            <div className="dash-legend"><span><i className="dot navy" /> Visiteurs</span><span><i className="dot gold" /> Demandes</span></div>
            <svg viewBox="0 0 520 190" className="dash-chart" aria-hidden="true">
              {[0, 50, 100, 150, 200].map((v) => (<g key={v}><text x="4" y={170 - v * 0.7} fontSize="10" fill="#8a94a6">{v}</text><line x1="34" x2="515" y1={170 - v * 0.7} y2={170 - v * 0.7} stroke="#eef0f4" strokeWidth="1" /></g>))}
              <path d="M34,120 C90,110 120,60 170,80 C220,100 260,70 310,75 C360,80 420,45 515,30 L515,170 L34,170 Z" fill="rgba(10,31,68,.06)" />
              <path d="M34,120 C90,110 120,60 170,80 C220,100 260,70 310,75 C360,80 420,45 515,30" fill="none" stroke="#0a1f44" strokeWidth="2" />
              <path d="M34,145 C100,140 140,110 190,120 C250,130 300,95 360,100 C420,105 470,95 515,92" fill="none" stroke="#c9a227" strokeWidth="2" />
              {['01/08', '05/08', '10/08', '15/08', '20/08', '25/08', '31/08'].map((d, i) => (<text key={d} x={40 + i * 79} y="186" fontSize="10" fill="#8a94a6">{d}</text>))}
            </svg>
            <div className="dash-donut-row">
              <div>
                <h4>Répartition des projets</h4>
                <div className="dash-donut-wrap">
                  <svg viewBox="0 0 120 120" className="dash-donut">
                    <circle cx="60" cy="60" r="44" fill="none" stroke="#0a1f44" strokeWidth="16" strokeDasharray="115.5 276.5" strokeDashoffset="69" transform="rotate(-90 60 60)" />
                    <circle cx="60" cy="60" r="44" fill="none" stroke="#c9a227" strokeWidth="16" strokeDasharray="69 276.5" strokeDashoffset="-46.5" transform="rotate(-90 60 60)" />
                    <circle cx="60" cy="60" r="44" fill="none" stroke="#d9c48a" strokeWidth="16" strokeDasharray="46 276.5" strokeDashoffset="-115.5" transform="rotate(-90 60 60)" />
                    <text x="60" y="56" textAnchor="middle" fontSize="20" fontWeight="800" fill="#0a1f44">12</text>
                    <text x="60" y="72" textAnchor="middle" fontSize="9" fill="#8a94a6">projets en cours</text>
                  </svg>
                  <ul>
                    <li><i style={{ background: '#3a5a9c' }} /> Résidentiel <b>5</b> <span>42%</span></li>
                    <li><i style={{ background: '#c9a227' }} /> Commercial <b>3</b> <span>25%</span></li>
                    <li><i style={{ background: '#0a1f44' }} /> Institutionnel <b>2</b> <span>17%</span></li>
                    <li><i style={{ background: '#d9c48a' }} /> Autres <b>2</b> <span>16%</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-head"><h3><Clock3 size={16} /> Activité récente</h3><Link href="/admin/audit">Voir tout →</Link></div>
            <ul className="dash-activity">
              {recent.map((a, i) => {
                const Icon = a.icon;
                return (<li key={i}><span className="dash-act-ico"><Icon size={15} /></span><span><b>{a.title}</b><small>{a.sub}</small></span><em>{a.time}</em></li>);
              })}
              <li><span className="dash-act-ico"><Upload size={15} /></span><span><b>Newsletter envoyée</b><small>Nos dernières réalisations</small></span><em>Il y a 12 heures</em></li>
            </ul>
          </div>
        </section>

        <section className="dash-grid-2 dash-bottom">
          <div className="dash-panel">
            <div className="dash-panel-head"><div><h3>Projets récents</h3><p>Suivi des derniers projets</p></div><Link href="/admin/projets">Voir tous les projets →</Link></div>
            <div className="dash-projs">
              {projects.slice(0, 4).map((p) => (
                <article key={p.title} className="dash-proj">
                  <div className="dash-proj-img"><img src={p.img} alt={p.title} /><span className={`dash-pill ${p.badge === 'Terminé' ? 'gold' : p.badge === 'Planification' ? 'blue' : 'green'}`}>{p.badge}</span></div>
                  <b>{p.title}</b>
                  <small><MapPin size={11} /> {p.lieu}</small>
                  <div className="dash-bar"><i style={{ width: `${p.pct}%` }} /><span>{p.pct}%</span></div>
                </article>
              ))}
            </div>
          </div>
          <div className="dash-panel">
            <h3>Sauvegarde &amp; transfert</h3>
            <p className="muted">Gérez l&apos;export et l&apos;import de vos données.</p>
            <div className="dash-save-btns">
              <button className="dash-btn-navy" onClick={() => simu('full')}>Simulation complète<small>Visites + messages synchronisés</small></button>
              <button className="dash-btn-navy" onClick={() => { exportFile(); push('Export téléchargé', 'success'); }}><Download size={15} /> Exporter<small>Télécharger une sauvegarde</small></button>
              <button className="dash-btn-line" onClick={() => fileRef.current?.click()}><Upload size={15} /> Importer<small>Restaurer des données</small></button>
              <input ref={fileRef} type="file" accept="application/json" hidden onChange={handleImport} />
            </div>
            <div className="dash-save-meta"><span><ShieldCheck size={14} /> Dernière sauvegarde<br /><small>Automatique - 31 août 2025 à 02:00</small></span><span className="dash-secure"><i /> Système sécurisé</span></div>
            {can('admin') && <button className="btn-danger" style={{ marginTop: 10 }} onClick={() => { if (confirm('Réinitialiser ?')) { resetDB(); location.reload(); } }}>Réinitialiser</button>}
          </div>
        </section>
      </AdminLayout>
    </>
  );
}
