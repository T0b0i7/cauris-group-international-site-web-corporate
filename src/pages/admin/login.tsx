import Head from 'next/head';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Eye, EyeOff, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { useAdmin } from '@/lib/admin/AdminContext';
import { useToast } from '@/lib/admin/useToast';
import { ToastContainer } from '@/components/Admin/Toast';

export default function LoginPage() {
  const { login, session } = useAdmin();
  const { push } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('admin@cauris.group');
  const [password, setPassword] = useState('Cauris2026!');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) router.replace('/admin');
  }, [session, router]);

  if (session) return null;

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (loading) return;
    setLoading(true); setError('');
    try {
      const msg = login(email.trim(), password);
      if (msg) { setError(msg); push(msg, 'error'); setLoading(false); }
      else {
        push('Connexion réussie', 'success');
        router.push('/admin').catch(() => { window.location.href = '/admin'; });
        setTimeout(() => setLoading(false), 2000);
      }
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(m); push(m, 'error'); setLoading(false);
    }
  };

  const quickFill = (e: string, p: string) => { setEmail(e); setPassword(p); };

  return (
    <>
      <Head><title>Connexion - Backoffice Cauris</title><meta name="robots" content="noindex" /></Head>
      <div className="login-split">
        <motion.div className="login-brand" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="login-brand-inner">
            <div className="login-logo">C</div>
            <h1>Cauris Group<br />Backoffice</h1>
            <p className="login-tagline">Console d’administration du site vitrine corporate. BTP, eau, énergie - pilotage central.</p>
            <div className="login-stats">
              <div><TrendingUp size={18} /><strong>120+</strong><span>projets</span></div>
              <div><ShieldCheck size={18} /><strong>6</strong><span>pôles</span></div>
              <div><Users size={18} /><strong>48h</strong><span>réponse</span></div>
            </div>
          </div>
        </motion.div>
        <motion.div className="login-panel" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <form onSubmit={submit} className="login-form">
            <h2>Connexion</h2>
            <p className="login-hint">Accédez à votre espace d’administration.</p>
            <label><span>Email</span><input type="email" value={email} autoComplete="username" onChange={(e) => setEmail(e.target.value)} placeholder="admin@cauris.group" required /></label>
            <label><span>Mot de passe</span>
              <div className="input-password">
                <input type={show ? 'text' : 'password'} value={password} autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                <button type="button" onClick={() => setShow((s) => !s)} tabIndex={-1}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
            </label>
            {error && <motion.div className="login-error" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>{error}</motion.div>}
            <motion.button type="submit" className="btn-primary" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Connexion…' : 'Se connecter'}
            </motion.button>
            <div className="login-quick" style={{ marginTop: 18 }}>
              <div className="login-quick-label">Comptes de démonstration</div>
              <div className="login-quick-grid">
                <button type="button" onClick={() => quickFill('admin@cauris.group', 'Cauris2026!')}><strong>Admin</strong><span>admin@cauris.group</span></button>
                <button type="button" onClick={() => quickFill('editeur@cauris.group', 'Editeur2026!')}><strong>Éditeur</strong><span>editeur@cauris.group</span></button>
                <button type="button" onClick={() => quickFill('lecteur@cauris.group', 'Lecteur2026!')}><strong>Lecteur</strong><span>lecteur@cauris.group</span></button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
      <ToastContainer />
    </>
  );
}
