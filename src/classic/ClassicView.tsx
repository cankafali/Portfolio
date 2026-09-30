import { useLanguage } from "../i18n/useLanguage";
import { About } from "./About";
import styles from "./ClassicView.module.css";
import { Contact } from "./Contact";
import { Education } from "./Education";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { Projects } from "./Projects";
import { TopBar } from "./TopBar";

export function ClassicView() {
  const { t } = useLanguage();

  return (
    <div className={styles.view}>
      <a href="#main" className={styles.skip}>
        {t.skipToContent}
      </a>
      <TopBar />
      <main id="main" tabIndex={-1} className={styles.main}>
        <Hero />
        <Projects />
        <About />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
