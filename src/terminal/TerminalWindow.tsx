import { Fragment, type ReactNode, type Ref } from "react";
import { profile } from "../content/profile";
import { LANGS } from "../i18n/lang";
import { useLanguage } from "../i18n/useLanguage";
import styles from "./TerminalWindow.module.css";

type Props = {
  ref?: Ref<HTMLDivElement>;
  fullscreen: boolean;
  onClose: () => void;
  onToggleFullscreen: () => void;
  children: ReactNode;
};

export const TERMINAL_TITLE_ID = "terminal-title";

// Başlık çubuğu: üç nokta işlevli (kırmızı/sarı = klasik görünüm, yeşil = tam ekran).
export function TerminalWindow({ ref, fullscreen, onClose, onToggleFullscreen, children }: Props) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div ref={ref} className={`${styles.window} ${fullscreen ? styles.fullscreen : ""}`}>
      <div className={styles.titleBar}>
        <div className={styles.dots}>
          <button
            type="button"
            className={`${styles.dot} ${styles.red}`}
            aria-label={t.terminal.toClassic}
            onClick={onClose}
          />
          <button
            type="button"
            className={`${styles.dot} ${styles.yellow}`}
            aria-label={t.terminal.minimize}
            onClick={onClose}
          />
          <button
            type="button"
            className={`${styles.dot} ${styles.green}`}
            aria-label={t.terminal.fullscreen}
            aria-pressed={fullscreen}
            onClick={onToggleFullscreen}
          />
        </div>
        <span id={TERMINAL_TITLE_ID} className={styles.title}>
          {profile.handle}@portfolio: ~
        </span>
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
      </div>
      {children}
    </div>
  );
}
