// import { motion, useScroll, useTransform } from "framer-motion";
// import { useRef } from "react";

// interface TimelineDotProps {
//   cardRefs: React.RefObject<HTMLDivElement>[];
// }

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const TimelineDot = ({ cardRefs }: TimelineDotProps) => {
//   const containerRef = useRef<HTMLDivElement>(null);

//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end end"]
//   });

//   // Calculate position along the cubic Bezier curve
//   const getPointOnBezierCurve = (p0: number, p1: number, p2: number, p3: number, t: number) => {
//     const u = 1 - t;
//     const tt = t * t;
//     const uu = u * u;
//     const uuu = uu * u;
//     const ttt = tt * t;

//     const p = uuu * p0;
//     const q = 3 * uu * t * p1;
//     const r = 3 * u * tt * p2;
//     const s = ttt * p3;

//     return p + q + r + s;
//   };

//   // Get position along the entire path based on progress (0 to 1)
//   const getPosition = (progress: number) => {
//     if (progress <= 0.5) {
//       // First curve: Right to Left (Card 1 to Card 2)
//       const t = progress * 2;
      
//       const x = getPointOnBezierCurve(
//         800,  // Start X (Right side)
//         790,  // Control 1 X (almost same X - makes it straight)
//         350,  // Control 2 X (curve left)
//         400,  // End X (Left side)
//         t
//       );
      
//       const y = getPointOnBezierCurve(
//         100,  // Start Y
//         120,  // Control 1 Y (slight change - makes it straight)
//         500,  // Control 2 Y (deep dip)
//         650,  // End Y (below card 2)
//         t
//       );
      
//       return { x, y };
//     } else {
//       // Second curve: Left to Right (Card 2 to Card 3)
//       const t = (progress - 0.5) * 2;
      
//       const x = getPointOnBezierCurve(
//         400,  // Start X (Left side)
//         450,  // Control 1 X
//         750,  // Control 2 X
//         800,  // End X (Right side)
//         t
//       );
      
//       const y = getPointOnBezierCurve(
//         650,  // Start Y
//         800,  // Control 1 Y
//         950,  // Control 2 Y
//         970,  // End Y (almost same as control point - makes it straight)
//         t
//       );
      
//       return { x, y };
//     }
//   };

//   // Map scroll progress to path progress
//   const pathProgress = useTransform(
//     scrollYProgress,
//     [0, 0.5, 1],
//     [0, 0.5, 1]
//   );

//   // Calculate path length percentage for progressive reveal
//   const pathLengthProgress = useTransform(
//     scrollYProgress,
//     [0, 1],
//     [0, 1]
//   );

//   return (
//     <div ref={containerRef} className="absolute inset-0 pointer-events-none">
//       <svg
//         viewBox="0 0 1200 1200"
//         className="absolute inset-0 w-full h-full hidden sm:block"
//         fill="none"
//         preserveAspectRatio="none"
//       >
//         {/* BASE DASHED PATH - Light gray (uncovered part) - SIMPLIFIED PATH */}
//         <path
//           d="M 800 100 C 790 120, 350 500, 400 650 C 450 800, 750 950, 800 970"
//           stroke="#d1d5db"
//           strokeWidth="3"
//           strokeDasharray="8 8"
//           fill="none"
//           opacity="0.8"
//         />

//         {/* SOLID COLORED PATH - Progressive reveal (covered part) */}
//         <motion.path
//           d="M 800 100 C 790 120, 350 500, 400 650 C 450 800, 750 950, 800 970"
//           stroke="#0076d8"
//           strokeWidth="4"
//           fill="none"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeDasharray="none"
//           style={{
//             pathLength: pathLengthProgress
//           }}
//         />

//         {/* BLUE DASHED OVERLAY FOR EFFECT */}
//         <motion.path
//           d="M 800 100 C 790 120, 350 500, 400 650 C 450 800, 750 950, 800 970"
//           stroke="#0076d8"
//           strokeWidth="3"
//           fill="none"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeDasharray="8 10"
//           style={{
//             pathLength: pathLengthProgress
//           }}
//           opacity="0.7"
//         />

//         {/* MOVING DOT */}
//         <motion.circle
//           r="12"
//           fill="#0076d8"
//           cx={useTransform(pathProgress, (p) => getPosition(p).x)}
//           cy={useTransform(pathProgress, (p) => getPosition(p).y)}
//         />

//         {/* GLOW EFFECT */}
//         <motion.circle
//           r="24"
//           fill="#0076d8"
//           opacity="0.3"
//           cx={useTransform(pathProgress, (p) => getPosition(p).x)}
//           cy={useTransform(pathProgress, (p) => getPosition(p).y)}
//         />

//         {/* OUTER PULSE RING */}
//         <motion.circle
//           r="32"
//           fill="none"
//           stroke="#10b981"
//           strokeWidth="2"
//           opacity="0.2"
//           cx={useTransform(pathProgress, (p) => getPosition(p).x)}
//           cy={useTransform(pathProgress, (p) => getPosition(p).y)}
//           style={{
//             scale: useTransform(scrollYProgress, (v) => 1 + Math.sin(v * 20) * 0.1)
//           }}
//         />
//       </svg>
//     </div>
//   );
// };

// export default TimelineDot;
// export default TimelineDot;
// TimelineDot.tsx - UPDATED WITH COLOR #0076d8
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface TimelineDotProps {
  cardRefs: React.RefObject<HTMLDivElement>[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TimelineDot = ({ cardRefs }: TimelineDotProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Calculate position along the cubic Bezier curve
  const getPointOnBezierCurve = (p0: number, p1: number, p2: number, p3: number, t: number) => {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    const p = uuu * p0;
    const q = 3 * uu * t * p1;
    const r = 3 * u * tt * p2;
    const s = ttt * p3;

    return p + q + r + s;
  };

  // Get position along the entire path based on progress (0 to 1)
  const getPosition = (progress: number) => {
    if (progress <= 0.5) {
      // First curve: Right to Left (Card 1 to Card 2)
      const t = progress * 2;
      
      const x = getPointOnBezierCurve(
        800,  // Start X (Right side)
        780,  // Control 1 X (slight curve)
        350,  // Control 2 X (deep curve left)
        400,  // End X (Left side)
        t
      );
      
      const y = getPointOnBezierCurve(
        100,  // Start Y
        200,  // Control 1 Y (straighter start)
        500,  // Control 2 Y (deep dip)
        650,  // End Y (below card 2)
        t
      );
      
      return { x, y };
    } else {
      // Second curve: Left to Right (Card 2 to Card 3)
      const t = (progress - 0.5) * 2;
      
      const x = getPointOnBezierCurve(
        400,  // Start X (Left side)
        450,  // Control 1 X
        750,  // Control 2 X
        800,  // End X (Right side)
        t
      );
      
      const y = getPointOnBezierCurve(
        650,  // Start Y
        800,  // Control 1 Y
        950,  // Control 2 Y
        1100, // End Y
        t
      );
      
      return { x, y };
    }
  };

  // Map scroll progress to path progress
  const pathProgress = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0, 0.5, 1]
  );

  // Calculate path length percentage for progressive reveal
  const pathLengthProgress = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 1]
  );

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      <svg
        viewBox="0 0 1200 1200"
        className="absolute inset-0 w-full h-full hidden sm:block"
        fill="none"
        preserveAspectRatio="none"
      >
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* BASE DASHED PATH - Light gray (未完成部分) */}
        <path
          d="M 800 100 C 780 200, 350 500, 400 650 C 450 800, 750 950, 800 1100"
          stroke="#d1d5db"
          strokeWidth="3"
          strokeDasharray="4 8"
          fill="none"
          opacity="0.6"
        />

        {/* SOLID COLORED PATH - Progressive reveal (已完成部分) */}
       <motion.path
  d="M 800 100 C 780 200, 350 500, 400 650 C 450 800, 750 950, 800 1100"
  stroke="#ffd801"
  strokeWidth="3"
  fill="none"
  strokeLinecap="round"
  strokeLinejoin="round"
  strokeDasharray="8 10"   // 👈 dashed line (dash length, gap)
  style={{
    pathLength: pathLengthProgress
  }}
/>


        {/* MOVING DOT */}
        <motion.circle
          r="5"
          fill="#0076d8"
          cx={useTransform(pathProgress, (p) => getPosition(p).x)}
          cy={useTransform(pathProgress, (p) => getPosition(p).y)}
        />

        {/* GLOW EFFECT */}
        <motion.circle
          r="10"
          fill="#ffd801"
          opacity="0.3"
          cx={useTransform(pathProgress, (p) => getPosition(p).x)}
          cy={useTransform(pathProgress, (p) => getPosition(p).y)}
        />

        {/* OUTER PULSE RING */}
        <motion.circle
          r="15"
          fill="none"
          stroke="#0076d8"
          strokeWidth="2"
          opacity="0.2"
          cx={useTransform(pathProgress, (p) => getPosition(p).x)}
          cy={useTransform(pathProgress, (p) => getPosition(p).y)}
          style={{
            scale: useTransform(scrollYProgress, (v) => 1 + Math.sin(v * 20) * 0.1)
          }}
        />
      </svg>
    </div>
  );
};

export default TimelineDot;