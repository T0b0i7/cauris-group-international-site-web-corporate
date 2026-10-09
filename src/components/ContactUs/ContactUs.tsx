import React, { useState } from "react";
import { useLanguage } from '@/context/LanguageContext';
import { useAdmin, Rules, uid } from '@/lib/admin/AdminContext';

const ContactUs = () => {
  const { t } = useLanguage();
  const { db, saveDB } = useAdmin();
  const [ok, setOk] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload = { nom: String(data.get('name') || ''), email: String(data.get('email') || ''), objet: String(data.get('subject') || t.contactSec.subjPh), message: String(data.get('message') || '') };
    const errs = Rules.message(payload);
    if (errs.length) { setErr(errs.join(' ')); setOk(''); return; }
    setErr('');
    try {
      saveDB({ ...db, messages: [{ id: uid('msg'), ...payload, statut: 'nouveau' as const, assigneA: '', createdAt: new Date().toISOString() }, ...db.messages] }, { entite: 'message', action: 'create-site', detail: payload.email });
    } catch {}
    setOk('Message enregistré. Nous vous répondrons sous 48h ouvrées.');
    e.currentTarget.reset();
    const subject = payload.objet;
    const body = `${payload.nom}\n${payload.email}\n\n${payload.message}`;
    void subject; void body;
  };

  return (
    <section className="contact-section area-padding">
      <div className="container">
        <div className="d-none d-sm-block mb-5 pb-4">
          <iframe
            src="https://www.google.com/maps?q=Bassila,+B%C3%A9nin&output=embed"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bassila, Bénin"
          ></iframe>
        </div>
        <div className="row">
          <div className="col-12">
            <h2 className="contact-title">{t.contactSec.title}</h2>
          </div>
          <div className="col-lg-8">
            <form className="form-contact contact_form" onSubmit={handleSubmit} id="contactForm" noValidate={true}>
              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <textarea className="form-control w-100" name="message" id="message" cols={30} rows={9} placeholder={t.contactSec.msgPh}></textarea>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <input className="form-control" name="name" id="name" type="text" placeholder={t.contactSec.namePh} />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <input className="form-control" name="email" id="email" type="email" placeholder={t.contactSec.emailPh} />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <input className="form-control" name="subject" id="subject" type="text" placeholder={t.contactSec.subjPh} />
                  </div>
                </div>
              </div>
              <div className="form-group mt-3">
                <button type="submit" className="button button-contactForm">{t.contactSec.send}</button>
              </div>
              {err && <p style={{color:'#b42318'}}>{err}</p>}
              {ok && <p style={{color:'#067647'}}>{ok}</p>}
            </form>
          </div>
          <div className="col-lg-4">
            <div className="media contact-info">
              <span className="contact-info__icon"><i className="ti-home"></i></span>
              <div className="media-body">
                <h3>{t.contactSec.addr1}</h3>
                <p>{t.contactSec.addr2}</p>
              </div>
            </div>
            <div className="media contact-info">
              <span className="contact-info__icon"><i className="ti-tablet"></i></span>
              <div className="media-body">
                <h3><a href={`tel:${t.company.phone1.replace(/[^+\d]/g, '')}`}>{t.company.phone1}</a></h3>
                <h3><a href={`tel:${t.company.phone2.replace(/[^+\d]/g, '')}`}>{t.company.phone2}</a></h3>
                <p>{t.contactSec.hours}</p>
              </div>
            </div>
            <div className="media contact-info">
              <span className="contact-info__icon"><i className="ti-email"></i></span>
              <div className="media-body">
                <h3><a href={`mailto:${t.company.email}`}>{t.company.email}</a></h3>
                <p>{t.contactSec.query}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
