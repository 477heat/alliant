import type { CSSProperties } from "react";

const lightBubbles = [
  { size: 18, left: 6, delay: 0, duration: 24, opacity: 0.58 },
  { size: 30, left: 14, delay: 6, duration: 36, opacity: 0.28 },
  { size: 12, left: 22, delay: 11, duration: 22, opacity: 0.64 },
  { size: 42, left: 29, delay: 3, duration: 44, opacity: 0.18 },
  { size: 16, left: 38, delay: 14, duration: 28, opacity: 0.52 },
  { size: 50, left: 48, delay: 8, duration: 50, opacity: 0.14 },
  { size: 14, left: 57, delay: 18, duration: 26, opacity: 0.58 },
  { size: 34, left: 66, delay: 4, duration: 38, opacity: 0.24 },
  { size: 11, left: 73, delay: 20, duration: 24, opacity: 0.66 },
  { size: 58, left: 81, delay: 10, duration: 54, opacity: 0.12 },
  { size: 22, left: 89, delay: 2, duration: 32, opacity: 0.42 },
  { size: 15, left: 96, delay: 16, duration: 30, opacity: 0.5 },
];

export function SiteSpaceBackground() {
  return (
    <div className="site-space-background" aria-hidden="true">
      {lightBubbles.map((bubble, index) => (
        <span
          className="site-space-background__light"
          key={`${bubble.left}-${bubble.size}-${index}`}
          style={
            {
              "--light-delay": `${bubble.delay}s`,
              "--light-duration": `${bubble.duration}s`,
              "--light-left": `${bubble.left}%`,
              "--light-opacity": bubble.opacity,
              "--light-size": `${bubble.size}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
