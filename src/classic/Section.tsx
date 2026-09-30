import type { ReactNode } from "react";
import { useLanguage } from "../i18n/useLanguage";
import { useOpenTerminal } from "../terminal/launcher";
import styles from "./Section.module.css";

type Props = {
  id: string;
  /** Terminaldeki karşılık gelen komut; başlığın solundaki yol onu çalıştırır. */
  command: string;
  title: string;
  children: ReactNode;
};

export function Section({ id, command, title, children }: Props) {
  const { t } = useLanguage();
  const openTerminal = useOpenTerminal();
  const headingId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={headingId} className={styles.section}>
      <div className={styles.head}>
        <button
          type="button"
          className={styles.path}
          aria-label={`${t.terminal.runInTerminal}: ${command}`}
          onClick={() => openTerminal(command)}
        >
          ~/{id}
        </button>
        <h2 id={headingId} className={styles.title}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
