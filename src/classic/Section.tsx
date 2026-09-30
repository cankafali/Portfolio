import type { ReactNode } from "react";
import styles from "./Section.module.css";

type Props = {
  id: string;
  path: string;
  title: string;
  children: ReactNode;
};

export function Section({ id, path, title, children }: Props) {
  const headingId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={headingId} className={styles.section}>
      <div className={styles.head}>
        <span className={styles.path} aria-hidden="true">
          {path}
        </span>
        <h2 id={headingId} className={styles.title}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
