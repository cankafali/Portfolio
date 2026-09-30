import { useRef, useState, type PointerEvent } from "react";
import { projects } from "../content/projects";
import { useLanguage } from "../i18n/useLanguage";
import { ProjectRow } from "./ProjectRow";
import styles from "./Projects.module.css";
import { Section } from "./Section";

const PREVIEW_W = 320;
const PREVIEW_H = 200;
const CURSOR_GAP = 24;
const EDGE = 16;

export function Projects() {
  const { t } = useLanguage();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [brokenImages, setBrokenImages] = useState<ReadonlySet<string>>(() => new Set());
  const previewRef = useRef<HTMLImageElement>(null);
  const placedRef = useRef(false);

  const markBroken = (src: string) => setBrokenImages((prev) => new Set(prev).add(src));

  // Önizleme imlecin sağında 24px geriden gelir; sağ kenara sığmazsa soluna geçer.
  const movePreview = (event: PointerEvent<HTMLUListElement>) => {
    const el = previewRef.current;
    if (event.pointerType !== "mouse" || !el) return;

    let x = event.clientX + CURSOR_GAP;
    if (x + PREVIEW_W > window.innerWidth - EDGE) x = event.clientX - CURSOR_GAP - PREVIEW_W;
    const y = Math.min(
      Math.max(event.clientY - PREVIEW_H / 2, EDGE),
      window.innerHeight - PREVIEW_H - EDGE,
    );
    const transform = `translate3d(${x}px, ${y}px, 0)`;

    if (placedRef.current) {
      el.style.transform = transform;
      return;
    }
    // İlk konumlandırma animasyonsuz, yoksa görsel sol üst köşeden kayarak gelir.
    el.style.transition = "none";
    el.style.transform = transform;
    void el.offsetWidth;
    el.style.transition = "";
    placedRef.current = true;
  };

  const hidePreview = () => {
    placedRef.current = false;
    setPreviewSrc(null);
  };

  const previewVisible = previewSrc !== null && !brokenImages.has(previewSrc);

  return (
    <Section id="projects" path="~/projects" title={t.sections.projects}>
      <ul className={styles.list} onPointerMove={movePreview} onPointerLeave={hidePreview}>
        {projects.map((project) => (
          <ProjectRow
            key={project.slug}
            project={project}
            open={openSlug === project.slug}
            imageBroken={brokenImages.has(project.image)}
            onImageError={() => markBroken(project.image)}
            onToggle={() => setOpenSlug((slug) => (slug === project.slug ? null : project.slug))}
            onHover={() => setPreviewSrc(project.image)}
          />
        ))}
      </ul>
      {previewSrc !== null && (
        <img
          ref={previewRef}
          src={previewSrc}
          alt=""
          width={PREVIEW_W}
          height={PREVIEW_H}
          className={`${styles.preview} ${previewVisible ? styles.previewVisible : ""}`}
          onError={() => markBroken(previewSrc)}
        />
      )}
    </Section>
  );
}
