import { education } from "../content/education";
import { useLanguage } from "../i18n/useLanguage";
import styles from "./Education.module.css";
import { Section } from "./Section";

export function Education() {
  const { lang, t } = useLanguage();

  return (
    <Section id="education" path="~/education" title={t.sections.education}>
      <ol className={styles.list}>
        {education.map((item) => (
          <li key={item.school} className={styles.item}>
            <span className={styles.years}>
              {item.start} – {item.end ?? t.education.present}
            </span>
            <span>
              {item.school}, {item.program[lang]}
            </span>
          </li>
        ))}
      </ol>
    </Section>
  );
}
