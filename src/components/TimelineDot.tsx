
// TimelineDot.tsx
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface TimelineDotProps {
  cardRefs: React.RefObject<HTMLDivElement>[];
}

const TimelineDot = ({ }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const pathLengthProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Card1 middle -> Card2 right -> Card3 left, same S-curve shape
  const pathD = `
    M 425 100
    C 425 220, 780 220, 780 400
    C 780 580, 425 580, 425 720
  `;

  const getPointOnCubicBezier = (
    p0x: number, p0y: number,
    p1x: number, p1y: number,
    p2x: number, p2y: number,
    p3x: number, p3y: number,
    t: number
  ) => {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;
    return {
      x: uuu * p0x + 3 * uu * t * p1x + 3 * u * tt * p2x + ttt * p3x,
      y: uuu * p0y + 3 * uu * t * p1y + 3 * u * tt * p2y + ttt * p3y,
    };
  };

  const getPosition = (progress: number) => {
    const segments = [
      // Segment 1: Card1 center(425,100) -> Card2 right(780,400)
      { p0x: 425, p0y: 100, p1x: 425, p1y: 220, p2x: 780, p2y: 220, p3x: 780, p3y: 400 },
      // Segment 2: Card2 right(780,400) -> Card3 left(425,720)
      { p0x: 780, p0y: 400, p1x: 780, p1y: 580, p2x: 425, p2y: 580, p3x: 425, p3y: 720 },
    ];

    const segCount = segments.length;
    const segProgress = progress * segCount;
    const segIndex = Math.min(Math.floor(segProgress), segCount - 1);
    const t = Math.min(segProgress - segIndex, 1);

    const seg = segments[segIndex];
    return getPointOnCubicBezier(
      seg.p0x, seg.p0y,
      seg.p1x, seg.p1y,
      seg.p2x, seg.p2y,
      seg.p3x, seg.p3y,
      t
    );
  };

  const dotX = useTransform(scrollYProgress, (p) => getPosition(p).x);
  const dotY = useTransform(scrollYProgress, (p) => getPosition(p).y);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none hidden sm:block">
      <svg
        viewBox="0 0 1000 820"
        className="absolute inset-0 w-full h-full"
        fill="none"
        preserveAspectRatio="none"
      >
        {/* BASE DASHED PATH - gray */}
        <path
          d={pathD}
          stroke="#cbd5e1"
          strokeWidth="2"
          strokeDasharray="6 10"
          fill="none"
          opacity="0.7"
        />

        {/* ANIMATED FILL - yellow on scroll */}
        <motion.path
          d={pathD}
          stroke="#ffd801"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="6 10"
          style={{ pathLength: pathLengthProgress }}
        />

        {/* MOVING DOT - blue */}
        <motion.circle
          r="6"
          fill="#0076d8"
          cx={dotX}
          cy={dotY}
        />

        {/* GLOW */}
        <motion.circle
          r="12"
          fill="#0076d8"
          opacity="0.2"
          cx={dotX}
          cy={dotY}
        />

        {/* PULSE RING */}
        <motion.circle
          r="18"
          fill="none"
          stroke="#0076d8"
          strokeWidth="1.5"
          opacity="0.15"
          cx={dotX}
          cy={dotY}
        />
      </svg>
    </div>
  );
};

export default TimelineDot;