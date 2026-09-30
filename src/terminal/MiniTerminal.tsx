import { profile } from "../content/profile";
import { useLanguage } from "../i18n/useLanguage";
import styles from "./MiniTerminal.module.css";

export const MINI_TERMINAL_ID = "mini-terminal";

type Props = {
  /** Morph sırasında da DOM'da kalır (ölçülebilsin diye), yalnızca görünmez olur. */
  visible: boolean;
  onOpen: () => void;
};

export function MiniTerminal({ visible, onOpen }: Props) {
  const { t } = useLanguage();

  return (
    <button
      id={MINI_TERMINAL_ID}
      type="button"
      className={`${styles.mini} ${visible ? "" : styles.hidden}`}
      onClick={onOpen}
    >
      <span className="sr-only">{t.terminal.openTerminal}</span>
      <span aria-hidden="true">
        <span className={styles.user}>{profile.handle}</span>
        <span className={styles.path}>:~</span>
        <span className={styles.dollar}>$</span> <span className={styles.cursor}> </span>
      </span>
      <span className={styles.tip} aria-hidden="true">
        {t.terminal.openTerminal} (~)
      </span>
    </button>
  );
}
