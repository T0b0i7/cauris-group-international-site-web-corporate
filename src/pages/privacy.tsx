import Head from 'next/head';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import PageHeader from '@/components/PageHeader/PageHeader';
import { useLanguage } from '@/context/LanguageContext';
import { getConsent, clearConsent } from '@/lib/cookies';
import { useState } from 'react';

export default function PrivacyPage() {
  const { lang, t } = useLanguage();
  const fr = lang === 'fr';
  const [msg, setMsg] = useState('');
  const lastUpdate = '7 octobre 2026';

  return (
    <>
      <Head>
        <title>{fr ? 'Politique de confidentialité' : 'Privacy Policy'} - {t.company.short}</title>
        <meta name="description" content={fr ? 'Politique de confidentialité et gestion des cookies de Cauris Group International SARL.' : 'Privacy policy and cookie management of Cauris Group International LLC.'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <PageHeader title={fr ? 'Politique de confidentialité' : 'Privacy Policy'} navTitle={fr ? 'Politique de confidentialité' : 'Privacy Policy'} />
      <section className="area-padding overflow-hidden">
        <div className="container max-w-full" style={{ maxWidth: 900 }}>
          <p className="muted">Dernière mise à jour : {lastUpdate} - Cauris Group International SARL, Maison ALEY Abani, Quartier Zongo, Bassila, Bénin - BP 421 Bassila - caurisgroupbtp@gmail.com - (+229) 01 94 64 64 71</p>

          {fr ? (
            <>
              <h2>1. Objet</h2>
              <p>La présente politique décrit comment Cauris Group International SARL collecte, utilise, conserve et protège vos données personnelles lorsque vous visitez notre site, remplissez le formulaire de contact / devis ou vous inscrivez à la newsletter. Elle est conforme à la loi n°2017-20 du 20 avril 2018 portant code du numérique en République du Bénin et aux orientations de l’APDP-Bénin, ainsi qu’aux principes du RGPD pour nos visiteurs européens.</p>
              <h2>2. Responsable du traitement</h2>
              <p>Cauris Group International SARL, représentée par sa direction, est responsable du traitement. Contact : caurisgroupbtp@gmail.com, (+229) 01 94 64 64 71, adresse ci-dessus.</p>
              <h2>3. Données collectées</h2>
              <ul><li><b>Contact / devis :</b> nom, email, objet, message, date, statut de traitement.</li><li><b>Newsletter :</b> email, statut actif/désinscrit, preuve du consentement, date.</li><li><b>Navigation :</b> pages vues, appareil, navigateur, logs techniques anonymisés, préférences de langue et de cookies.</li><li><b>Backoffice :</b> comptes administrateurs (nom, email, rôle), journal d’audit des actions.</li></ul>
              <p>Nous ne collectons aucune donnée sensible (santé, religion, opinions) et aucun paiement en ligne n’est effectué sur ce site.</p>
              <h2>4. Finalités et bases légales</h2>
              <ul><li>Répondre aux demandes de contact et établir des devis - exécution de mesures précontractuelles.</li><li>Envoyer la newsletter - consentement, retirable à tout moment.</li><li>Assurer la sécurité, prévenir la fraude, produire des statistiques anonymes - intérêt légitime.</li><li>Gérer les comptes du backoffice et tracer les actions - intérêt légitime et obligation de sécurité.</li></ul>
              <h2>5. Durées de conservation</h2>
              <ul><li>Messages : 3 ans à compter du dernier contact, puis archivage ou suppression.</li><li>Newsletter : jusqu’au désabonnement + 1 an de preuve du consentement.</li><li>Logs techniques : 12 mois maximum.</li><li>Audit backoffice : 3 ans.</li></ul>
              <h2>6. Destinataires et transferts</h2>
              <p>Vos données sont accessibles uniquement à l’équipe habilitée (admin, éditeur). Aucune vente ni cession. Hébergement du site et sauvegardes JSON locales au navigateur pour la démo du backoffice. En cas d’hébergeur hors Bénin/UE, des garanties contractuelles sont mises en place.</p>
              <h2>7. Sécurité</h2>
              <p>HTTPS, contrôle d’accès par rôle (admin/éditeur/lecteur), sessions limitées à 8 h, journalisation des écritures, sauvegardes, minimisation des données. La version de démonstration stocke les données dans le navigateur (localStorage) : ne pas y saisir de données sensibles et brancher une API sécurisée en production.</p>
              <h2>8. Vos droits</h2>
              <p>Accès, rectification, effacement, opposition, limitation, portabilité et retrait du consentement. Exercez vos droits par email à caurisgroupbtp@gmail.com avec copie de pièce d’identité si nécessaire. Réponse sous 30 jours. Recours possible devant l’APDP-Bénin.</p>
              <h2>9. Cookies</h2>
              <p><b>Nécessaires :</b> langue (cauris-lang), consentement cookies (cauris_cookie_consent_v1), session backoffice (cauris_admin_session_v1), base démo (cauris_admin_db_v1) - toujours actifs, sans consentement.</p>
              <p><b>Mesure d’audience et marketing :</b> désactivés par défaut, activés uniquement si vous cliquez « Tout accepter » ou les cochez. Refuser ne bloque pas la navigation.</p>
              <p>Durée du consentement : 6 mois. Pour modifier votre choix, cliquez ci-dessous :</p>
              <button className="main_btn" style={{ border: 0, cursor: 'pointer' }} onClick={() => { clearConsent(); location.reload(); setMsg('Préférences réinitialisées : le bandeau va réapparaître.'); }}>Réinitialiser mes préférences cookies</button>
              {msg && <p><b>{msg}</b></p>}
              <h2>10. Mineurs</h2>
              <p>Le site ne s’adresse pas aux moins de 15 ans. Aucune inscription volontaire de mineur n’est sollicitée.</p>
              <h2>11. Modifications</h2>
              <p>Toute mise à jour sera publiée sur cette page avec sa date. En cas de changement majeur, un bandeau d’information sera affiché.</p>
              <h2>12. Contact</h2>
              <p>Cauris Group International SARL - caurisgroupbtp@gmail.com - (+229) 01 94 64 64 71 - Maison ALEY Abani, Quartier Zongo, Bassila, Bénin.</p>
            </>
          ) : (
            <>
              <h2>1. Purpose</h2><p>This policy explains how Cauris Group International LLC collects, uses, stores and protects your personal data when you browse this website, submit the contact/quote form or subscribe to the newsletter.</p>
              <h2>2. Controller</h2><p>Cauris Group International LLC, Bassila, Benin - caurisgroupbtp@gmail.com - (+229) 01 94 64 64 71.</p>
              <h2>3. Data collected</h2><p>Contact: name, email, subject, message. Newsletter: email and consent proof. Browsing: language, cookie preferences, anonymized logs. Backoffice: admin accounts and audit log.</p>
              <h2>4. Purposes</h2><p>Answer requests, send newsletter on consent, secure the site, keep audit trail.</p>
              <h2>5. Retention</h2><p>Messages 3 years, newsletter until unsubscribe + 1 year proof, logs 12 months, audit 3 years.</p>
              <h2>6. Recipients</h2><p>Authorized team only. No sale. Demo stores data in browser localStorage.</p>
              <h2>7. Rights</h2><p>Access, rectification, erasure, objection, portability. Email caurisgroupbtp@gmail.com. Appeal to APDP-Benin.</p>
              <h2>8. Cookies</h2><p>Necessary cookies always on. Analytics/marketing off by default, enabled only on consent for 6 months.</p>
              <button className="main_btn" style={{ border: 0, cursor: 'pointer' }} onClick={() => { clearConsent(); location.reload(); }}>Reset my cookie preferences</button>
            </>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
