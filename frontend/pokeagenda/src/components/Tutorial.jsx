import React, { useEffect, useState } from "react";
import styles from "../styles/Tutorial.module.css";

export default function Tutorial({ steps = [], active = false, onClose }) {
  const [index, setIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  useEffect(() => {
    if (!active) {
      setIndex(0);
      setTargetRect(null);
      return;
    }
    const observe = () => {
      const step = steps[index];
      if (!step) return setTargetRect(null);
      const el = document.querySelector(step.selector);
      if (!el) return setTargetRect(null);
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
    };

    // run initially and after a small delay to allow layout changes
    observe();
    const t = setTimeout(observe, 100);
    const onResize = () => observe();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [active, index, steps]);

  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, [active]);

  if (!active) return null;

  const step = steps[index] || {};

  const next = () => setIndex((i) => Math.min(i + 1, steps.length - 1));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  const renderHighlight = () => {
    if (!targetRect) return null;
    const padding = 8;
    const style = {
      top: targetRect.top - padding + window.scrollY,
      left: targetRect.left - padding + window.scrollX,
      width: targetRect.width + padding * 2,
      height: targetRect.height + padding * 2,
    };
    return <div className={styles.highlight} style={style} />;
  };

  const renderTooltip = () => {
    if (!targetRect) return (
      <div className={styles.centerBox}>
        <div className={styles.tooltipContent}>{step.text}</div>
      </div>
    );

    const tooltipWidth = 300;
    const spaceAbove = targetRect.top;
    const placeAbove = spaceAbove > 120;
    const style = placeAbove
      ? {
          left: Math.min(
            Math.max(targetRect.left + window.scrollX, 8),
            window.innerWidth - tooltipWidth - 8
          ),
          top: targetRect.top + window.scrollY - 110,
          width: tooltipWidth,
        }
      : {
          left: Math.min(
            Math.max(targetRect.left + window.scrollX, 8),
            window.innerWidth - tooltipWidth - 8
          ),
          top: targetRect.bottom + window.scrollY + 12,
          width: tooltipWidth,
        };

    return (
      <div className={styles.tooltip} style={style}>
        <div className={styles.tooltipContent}>{step.text}</div>
        <div className={styles.controls}>
          <button onClick={prev} disabled={index === 0} className={styles.ctrl}>
            &lt; Prev
          </button>
          <button onClick={next} disabled={index === steps.length - 1} className={styles.ctrl}>
            Next &gt;
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.backdrop} onClick={onClose} />
      {renderHighlight()}
      {renderTooltip()}

      <div className={styles.bottomBar}>
        <div className={styles.stepCounter}>
          Passo {index + 1} / {steps.length}
        </div>
        <div className={styles.bottomActions}>
          <button onClick={onClose} className={styles.closeBtn}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
