import { useLanguage } from "../i18n/useLanguage";
import styles from "./CommandChips.module.css";

// TASARIM.md §5.1: pencerenin altındaki kısayollar; mobilde ana gezinme yolu.
const CHIPS = ["help", "about", "projects", "skills", "contact", "cv", "gui"] as const;

type Props = {
  onRun: (command: string) => void;
};

export function CommandChips({ onRun }: Props) {
  const { t } = useLanguage();

  return (
    <nav aria-label={t.terminal.chipsLabel} className={styles.chips}>
      <ul className={styles.list}>
        {CHIPS.map((command) => (
          <li key={command}>
            <button type="button" className={styles.chip} onClick={() => onRun(command)}>
              {command}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
