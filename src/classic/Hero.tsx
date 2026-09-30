import { profile } from "../content/profile";
import { useLanguage } from "../i18n/useLanguage";
import buttons from "./buttons.module.css";
import styles from "./Hero.module.css";

export function Hero() {
  const { lang, t } = useLanguage();

  return (
    <section id="top" aria-labelledby="hero-name" className={styles.hero}>
      <h1 id="hero-name" tabIndex={-1} className={styles.name}>
        {profile.name}
      </h1>
      <p className={styles.lead}>
        {profile.role[lang]}. {profile.focus[lang]}
      </p>
      <div className={styles.actions}>
        <a href="#contact" className={buttons.primary}>
          {t.actions.workTogether}
        </a>
        <a href={profile.cvFile[lang]} download className={buttons.secondary}>
          {t.actions.downloadCv}
        </a>
      </div>
      <p className={styles.status}>
        {profile.location[lang]}. {profile.availability[lang]}
      </p>
    </section>
  );
}
