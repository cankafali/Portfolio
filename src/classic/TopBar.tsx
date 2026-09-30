import { Fragment, useEffect, useRef, useState } from "react";
import { profile } from "../content/profile";
import { LANGS } from "../i18n/lang";
import { useLanguage } from "../i18n/useLanguage";
import styles from "./TopBar.module.css";

function LangSwitch() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div role="group" aria-label={t.nav.language} className={styles.lang}>
      {LANGS.map((code, i) => (
        <Fragment key={code}>
          {i > 0 && <span aria-hidden="true">|</span>}
          <button
            type="button"
            className={styles.langButton}
            aria-pressed={lang === code}
            onClick={() => setLang(code)}
          >
            {code.toUpperCase()}
          </button>
        </Fragment>
      ))}
    </div>
  );
}

export function TopBar() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(() => window.scrollY > 0);
  const menuRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "projects", label: t.nav.projects },
    { id: "about", label: t.nav.about },
    { id: "contact", label: t.nav.contact },
  ];
  const closeMenu = () => menuRef.current?.close();

  return (
    <header className={`${styles.bar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <a href="#top" className={styles.name}>
          {profile.name}
        </a>
        <nav aria-label={t.nav.main} className={styles.nav}>
          <ul className={styles.navList}>
            {links.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <LangSwitch />
        <button
          type="button"
          className={styles.menuButton}
          aria-haspopup="dialog"
          onClick={() => menuRef.current?.showModal()}
        >
          {t.nav.menu}
        </button>
      </div>

      <dialog ref={menuRef} className={styles.menu} aria-label={t.nav.menu}>
        <div className={styles.menuHead}>
          <span className={styles.name}>{profile.name}</span>
          <button type="button" className={styles.closeButton} onClick={closeMenu}>
            {t.nav.close}
          </button>
        </div>
        <nav aria-label={t.nav.main}>
          <ul className={styles.menuList}>
            {links.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} onClick={closeMenu}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </dialog>
    </header>
  );
}
