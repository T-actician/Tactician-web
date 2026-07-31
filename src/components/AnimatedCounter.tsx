"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export default function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState("0");

  const numericMatch = value.match(/[\d.]+/);
  const numeric = numericMatch ? parseFloat(numericMatch[0]) : null;
  const suffix = numeric !== null ? value.replace(numericMatch![0], "") : "";

  useEffect(() => {
    if (!inView || numeric === null) {
      if (numeric === null) setDisplay(value);
      return;
    }
    let frame: number;
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(progress * numeric).toString());
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, numeric, value]);

  return (
    <motion.span ref={ref} className="text-3xl font-extrabold text-brand-600">
      {display}
      {suffix}
    </motion.span>
  );
}
