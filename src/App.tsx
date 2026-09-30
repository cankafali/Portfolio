import { profile } from "./content/profile";
import styles from "./App.module.css";

// 1. aşama iskeleti: token ve fontların doğrulanması için geçici sayfa.
// Klasik görünüm 2. aşamada bunun yerini alacak.
export default function App() {
  const lang = "tr";

  return (
    <main className={styles.page}>
      <h1 className={styles.name}>{profile.name}</h1>
      <p className={styles.tagline}>{profile.tagline[lang]}</p>
      <pre className={styles.term}>
        <span className={styles.user}>{profile.handle}@portfolio</span>
        <span className={styles.path}>:~</span>
        <span className={styles.dollar}>$</span> echo "ğüşıöç İĞÜŞÖÇ"
        {"\n"}ğüşıöç İĞÜŞÖÇ
      </pre>
    </main>
  );
}
