import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../i18n/useLanguage";
import styles from "./OutputLine.module.css";
import { Prompt } from "./Prompt";
import type { OutputLine as Line, Segment } from "./types";

type Props = {
  line: Line;
  onCommand: (command: string) => void;
};

const COPIED_MS = 1500;

function CopyButton({ value }: { value: string }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }
    setCopied(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), COPIED_MS);
  };

  return (
    <button type="button" className={styles.copy} onClick={() => void copy()}>
      [{copied ? t.actions.copied : t.actions.copy}]
    </button>
  );
}

function SegmentView({ segment, onCommand }: { segment: Segment; onCommand: Props["onCommand"] }) {
  switch (segment.kind) {
    case "text":
      return <span className={styles[segment.tone ?? "default"]}>{segment.text}</span>;
    case "link": {
      const external = segment.href.startsWith("http");
      return (
        <a
          className={styles.link}
          href={segment.href}
          download={segment.download || undefined}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
        >
          {segment.text}
        </a>
      );
    }
    case "command":
      return (
        <button type="button" className={styles.command} onClick={() => onCommand(segment.command)}>
          {segment.text}
        </button>
      );
    case "copy":
      return <CopyButton value={segment.value} />;
    case "button":
      return (
        <button
          type="button"
          className={styles[segment.variant]}
          onClick={() => onCommand(segment.command)}
        >
          {segment.text}
        </button>
      );
  }
}

function Segments({ segments, onCommand }: { segments: Segment[]; onCommand: Props["onCommand"] }) {
  return segments.map((segment, i) => (
    <SegmentView key={i} segment={segment} onCommand={onCommand} />
  ));
}

export function OutputLine({ line, onCommand }: Props) {
  switch (line.type) {
    case "prompt":
      return <Prompt>{line.command}</Prompt>;
    case "text":
      return (
        <div className={styles.line}>
          <Segments segments={line.segments} onCommand={onCommand} />
        </div>
      );
    case "table":
      return (
        <div className={styles.table}>
          {line.rows.map((row, r) => (
            <div key={r} className={styles.row}>
              {row.map((cell, c) => (
                <div key={c} className={styles.cell}>
                  <Segments segments={cell} onCommand={onCommand} />
                </div>
              ))}
            </div>
          ))}
        </div>
      );
  }
}
