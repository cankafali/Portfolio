import type { ReactNode } from "react";
import { profile } from "../content/profile";
import styles from "./Prompt.module.css";

// cankafali@portfolio (teal) :~ (muted) $ (amber) komut (paper)
export function Prompt({ children }: { children?: ReactNode }) {
  return (
    <div className={styles.prompt}>
      <span className={styles.user}>{profile.handle}@portfolio</span>
      <span className={styles.path}>:~</span>
      <span className={styles.dollar}>$</span> {children}
    </div>
  );
}
