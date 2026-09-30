import type { Project } from "../content/projects";
import { useLanguage } from "../i18n/useLanguage";
import styles from "./ProjectRow.module.css";

type Props = {
  project: Project;
  open: boolean;
  imageBroken: boolean;
  onImageError: () => void;
  onToggle: () => void;
  onHover: () => void;
};

export function ProjectRow({ project, open, imageBroken, onImageError, onToggle, onHover }: Props) {
  const { lang, t } = useLanguage();
  const panelId = `project-${project.slug}`;

  return (
    <li className={styles.row} data-open={open} onPointerEnter={onHover}>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className={styles.name}>{project.name}</span>
        <span className={styles.summary}>{project.summary[lang]}</span>
        <span className={styles.meta}>{project.stack.join(", ")}</span>
        <span className={`${styles.meta} ${styles.year}`}>{project.year}</span>
      </button>
      <span className={styles.links}>
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`${t.project.demo}: ${project.name}`}
        >
          {t.project.demo}
        </a>
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`${t.project.code}: ${project.name}`}
        >
          {t.project.code}
        </a>
      </span>
      <div id={panelId} className={styles.panel} hidden={!open}>
        {!imageBroken && (
          <img
            className={styles.image}
            src={project.image}
            alt=""
            width={320}
            height={200}
            loading="lazy"
            onError={onImageError}
          />
        )}
        <p>{project.details[lang]}</p>
        <dl className={styles.notes}>
          <div>
            <dt>{t.project.solved}</dt>
            <dd>{project.solved[lang]}</dd>
          </div>
          <div>
            <dt>{t.project.learned}</dt>
            <dd>{project.learned[lang]}</dd>
          </div>
        </dl>
      </div>
    </li>
  );
}
