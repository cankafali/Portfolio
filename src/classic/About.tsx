import { about } from "../content/about";
import { skills } from "../content/skills";
import { useLanguage } from "../i18n/useLanguage";
import styles from "./About.module.css";
import { Section } from "./Section";

export function About() {
  const { lang, t } = useLanguage();

  return (
    <Section id="about" command="about" title={t.sections.about}>
      <div className={styles.grid}>
        <div className={styles.text}>
          {about[lang].paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
        <div>
          <h3 className={styles.skillsTitle}>{t.sections.skills}</h3>
          <div className={styles.groups}>
            {skills.map((group) => (
              <div key={group.id}>
                <h4 className={styles.groupTitle}>{group.title[lang]}</h4>
                <ul className={styles.items}>
                  {group.items[lang].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
