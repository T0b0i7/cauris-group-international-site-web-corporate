import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Bell, Search, CalendarDays, LogOut, User } from 'lucide-react';
import { useAdmin } from '@/lib/admin/AdminContext';
import { Sidebar } from './Sidebar';
import { ToastContainer } from './Toast';

function todayLabel() {
  try {
    const d = new Date();
    const date = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d);
    const time = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(d);
    return { date, time };
  } catch { return { date: '', time: '' }; }
}

export default function AdminLayout({ title, children, subtitle, bare = false }: { title: string; children: React.ReactNode; subtitle?: string; bare?: boolean }) {
  const { session, loading, db, logout } = useAdmin();
  const router = useRouter();
  const [q, setQ] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = todayLabel();

  useEffect(() => {
    if (!loading && !session && router.pathname !== '/admin/login') router.replace('/admin/login');
  }, [loading, session, router]);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  if (loading || !session) {
    return (
      <div className="loading-screen">
        <motion.div className="loader" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} />
      </div>
    );
  }

  const unread = db.messages.filter((m) => m.statut === 'nouveau').length;
  const isDashboard = router.pathname === '/admin';

  return (
    <div className="dash-shell">
      <Sidebar />
      <main className="dash-main">
        <header className="dash-topbar">
          <button className="dash-burger" aria-label="Menu" onClick={() => document.querySelector('.dash-side')?.classList.toggle('collapsed')}>☰</button>
          <div className="dash-search">
            <Search size={15} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && q.trim()) router.push(`/admin/articles`); }}
              placeholder="Rechercher un projet, un article, un utilisateur..."
            />
          </div>
          <div className="dash-top-right">
            <button className="dash-bell" aria-label="notifications" onClick={() => router.push('/admin/messages')}>
              <Bell size={18} />
              {unread > 0 && <span className="dash-bell-badge">{unread}</span>}
            </button>
            <div className="dash-profile" ref={menuRef}>
              <button className="dash-admin-chip" onClick={() => setMenuOpen((v) => !v)} aria-haspopup="true" aria-expanded={menuOpen}>
                <span className="dash-avatar">{session.nom.charAt(0)}</span>
                <span className="dash-admin-txt"><b>{session.nom}</b><small>{session.role === 'admin' ? 'Super administrateur' : session.role}</small></span>
                <span className="dash-caret">▾</span>
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div className="dash-profile-menu" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                    <button onClick={() => { setMenuOpen(false); router.push('/admin/utilisateurs'); }}><User size={14} /> Mon profil</button>
                    <button className="danger" onClick={() => { logout(); router.replace('/admin/login'); }}><LogOut size={14} /> Déconnexion</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="dash-date"><CalendarDays size={15} /><span>{t.date}<br /><b>{t.time}</b></span></div>
          </div>
        </header>
        {isDashboard || bare ? (
          <div className="dash-content-full">{children}</div>
        ) : (
          <>
            <div className="dash-page-head"><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
            <div className="dash-content">
              {session.role === 'lecteur' && <p className="adm-alert">Mode lecture seule - toute écriture est bloquée (rôle lecteur).</p>}
              {children}
            </div>
          </>
        )}
        <div style={{ padding: '0 28px 18px' }}><Link href="/">← Voir le site public</Link></div>
      </main>
      <ToastContainer />
    </div>
  );
}
