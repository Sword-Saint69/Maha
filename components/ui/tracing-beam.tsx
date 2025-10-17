"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useTransform,
  useScroll,
  useVelocity,
  useSpring,
} from "motion/react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

export const TracingBeam = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { currentTheme } = useTheme();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        setSvgHeight(contentRef.current.offsetHeight);
      }
    };

    // Initial height calculation
    updateHeight();

    // Update height on window resize
    window.addEventListener('resize', updateHeight);

    // Use ResizeObserver to detect content size changes
    const resizeObserver = new ResizeObserver(updateHeight);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    // Update height after a short delay to catch any dynamic content
    const timeoutId = setTimeout(updateHeight, 100);

    return () => {
      window.removeEventListener('resize', updateHeight);
      resizeObserver.disconnect();
      clearTimeout(timeoutId);
    };
  }, [children]);

  const y1 = useSpring(
    useTransform(scrollYProgress, [0, 0.8], [50, Math.max(svgHeight, 1000)]),
    {
      stiffness: 500,
      damping: 90,
    },
  );
  const y2 = useSpring(
    useTransform(scrollYProgress, [0, 1], [50, Math.max(svgHeight - 200, 800)]),
    {
      stiffness: 500,
      damping: 90,
    },
  );

  return (
    <motion.div
      ref={ref}
      className={cn("relative mx-auto h-full w-full max-w-4xl", className)}
    >
      <div className="absolute top-3 -right-4 md:-right-20">
        <motion.div
          transition={{
            duration: 0.2,
            delay: 0.5,
          }}
          animate={{
            boxShadow:
              scrollYProgress.get() > 0
                ? "none"
                : "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
          className="border-netural-200 mr-[27px] flex h-4 w-4 items-center justify-center rounded-full border shadow-sm"
        >
          <motion.div
            transition={{
              duration: 0.2,
              delay: 0.5,
            }}
            animate={{
              backgroundColor: scrollYProgress.get() > 0 ? currentTheme.colors.primary : currentTheme.colors.accent,
              borderColor: scrollYProgress.get() > 0 ? currentTheme.colors.primary : currentTheme.colors.secondary,
            }}
            className="h-2 w-2 rounded-full border"
            style={{ borderColor: currentTheme.colors.border }}
          />
        </motion.div>
        <svg
          viewBox={`0 0 20 ${Math.max(svgHeight, 1000)}`}
          width="20"
          height={Math.max(svgHeight, 1000)} // Set the SVG height with minimum
          className="mr-4 block"
          aria-hidden="true"
          style={{ minHeight: '100vh' }}
        >
          <motion.path
            d={`M 19 0V -36 l -18 24 V ${Math.max(svgHeight, 1000) * 0.8} l 18 24V ${Math.max(svgHeight, 1000)}`}
            fill="none"
            stroke={currentTheme.colors.border}
            strokeOpacity="0.16"
            transition={{
              duration: 10,
            }}
          ></motion.path>
          <motion.path
            d={`M 19 0V -36 l -18 24 V ${Math.max(svgHeight, 1000) * 0.8} l 18 24V ${Math.max(svgHeight, 1000)}`}
            fill="none"
            stroke={`url(#gradient-${currentTheme.id})`}
            strokeWidth="1.25"
            className="motion-reduce:hidden"
            transition={{
              duration: 10,
            }}
          ></motion.path>
          <defs>
            <motion.linearGradient
              id={`gradient-${currentTheme.id}`}
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={y1} // set y1 for gradient
              y2={y2} // set y2 for gradient
            >
              <stop stopColor={currentTheme.colors.primary} stopOpacity="0"></stop>
              <stop stopColor={currentTheme.colors.primary}></stop>
              <stop offset="0.325" stopColor={currentTheme.colors.accent}></stop>
              <stop offset="1" stopColor={currentTheme.colors.secondary} stopOpacity="0"></stop>
            </motion.linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef}>{children}</div>
    </motion.div>
  );
};
