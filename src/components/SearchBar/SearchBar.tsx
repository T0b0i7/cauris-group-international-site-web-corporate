import React, { useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext';

type Props = {
  open: boolean;
  onClose: () => void;
}

const SearchBar = ({ open, onClose }: Props) => {
  const { t } = useLanguage();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.getElementById('search_input')?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div className={`search_input${open ? ' open' : ''}`} id="search_input_box" aria-hidden={!open}>
      <div className="container ">
        <form className="d-flex justify-content-between search-inner" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            className="form-control"
            id="search_input"
            placeholder={t.search.placeholder}
            tabIndex={open ? 0 : -1}
          />
          <button type="submit" className="btn" tabIndex={open ? 0 : -1} aria-label={t.search.placeholder}></button>
          <span
            className="ti-close"
            id="close_search"
            title={t.search.close}
            onClick={onClose}
            role="button"
            aria-label={t.search.close}
          ></span>
        </form>
      </div>
    </div>
  )
}

export default SearchBar
