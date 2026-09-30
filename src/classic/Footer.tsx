import { profile } from "../content/profile";
import { lighthouse } from "../content/site";
import { useLanguage } from "../i18n/useLanguage";
import styles from "./Footer.module.css";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <p className={styles.inner}>
        <span>
          {t.footer.builtWith}{" "}
          <a href={profile.repoUrl} target="_blank" rel="noreferrer">
            {t.footer.source}
          </a>
        </span>
        {lighthouse && (
          <span>
            Lighthouse: {t.footer.performance} {lighthouse.performance}, {t.footer.accessibility}{" "}
            {lighthouse.accessibility}, {t.footer.bestPractices} {lighthouse.bestPractices},{" "}
            {t.footer.seo} {lighthouse.seo}
          </span>
        )}
      </p>
    </footer>
  );
}
