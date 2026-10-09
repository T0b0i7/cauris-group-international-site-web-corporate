import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, FileText, Building2, Layers, Quote, Inbox, Send, Users, Settings, ScrollText } from 'lucide-react';
import { useAdmin } from '@/lib/admin/AdminContext';
import { img } from '@/lib/base';

const items = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, adminOnly: false },
  { href: '/admin/articles', label: 'Articles', icon: FileText, adminOnly: false },
  { href: '/admin/projets', label: 'Projets', icon: Building2, adminOnly: false },
  { href: '/admin/services', label: 'Services', icon: Layers, adminOnly: false },
  { href: '/admin/temoignages', label: 'Témoignages', icon: Quote, adminOnly: false },
  { href: '/admin/messages', label: 'Messages', icon: Inbox, adminOnly: false, badgeKey: 'messages' },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Send, adminOnly: false },
  { href: '/admin/utilisateurs', label: 'Utilisateurs', icon: Users, adminOnly: true },
  { href: '/admin/parametres', label: 'Paramètres', icon: Settings, adminOnly: true },
  { href: '/admin/audit', label: 'Journal', icon: ScrollText, adminOnly: true },
];

export function Sidebar() {
  const { can, db } = useAdmin();
  const router = useRouter();
  const isAdmin = can('admin');
  const unread = db.messages.filter((m) => m.statut === 'nouveau').length;

  return (
    <aside className="dash-side">
      <div className="dash-brand dash-brand-corner">
        <span className="dash-logo-img">
          <Image src={img('/images/logo.jpeg')} alt="Cauris Group" width={56} height={56} />
        </span>
        <div>
          <div className="dash-brand-name">CAURIS GROUP</div>
          <div className="dash-brand-sub">INTERNATIONAL</div>
          <div className="dash-brand-tag">Construire aujourd&apos;hui<br />le patrimoine de demain</div>
        </div>
      </div>
      <nav className="dash-nav">
        {items.filter((i) => !i.adminOnly || isAdmin).map((item) => {
          const active = router.pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={`dash-link${active ? ' active' : ''}`}>
              <span className="dash-link-icon"><Icon size={17} strokeWidth={1.9} /></span>
              <span className="dash-link-label">{item.label}</span>
              {item.badgeKey === 'messages' && unread > 0 && <span className="dash-badge">{unread}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="dash-side-foot">
        <div className="dash-side-company">Cauris Group International</div>
        <div className="dash-side-sectors">Construction&nbsp;&nbsp;•&nbsp;&nbsp;BTP&nbsp;&nbsp;•&nbsp;&nbsp;Développement</div>
      </div>
    </aside>
  );
}
