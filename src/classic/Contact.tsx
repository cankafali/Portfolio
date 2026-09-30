import { useEffect, useRef, useState } from "react";
import { profile } from "../content/profile";
import { useLanguage } from "../i18n/useLanguage";
import buttons from "./buttons.module.css";
import styles from "./Contact.module.css";
import { Section } from "./Section";

const COPIED_MS = 1500;

export function Contact() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      return;
    }
    setCopied(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), COPIED_MS);
  };

  return (
    <Section id="contact" command="contact" title={t.sections.contact}>
      <div className={styles.emailRow}>
        <a href={`mailto:${profile.email}`} className={styles.email}>
          {profile.email}
        </a>
        <button
          type="button"
          className={`${buttons.secondary} ${styles.copy}`}
          onClick={() => void copyEmail()}
        >
          {copied ? t.actions.copied : t.actions.copy}
        </button>
        <span role="status" className="sr-only">
          {copied ? t.actions.copied : ""}
        </span>
      </div>
      <ul className={styles.links}>
        <li>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </li>
        <li>
          <a href={profile.links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </li>
      </ul>
    </Section>
  );
}
