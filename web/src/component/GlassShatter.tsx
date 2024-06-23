import { motion, Variants } from "framer-motion";
import { useMemo } from "react";

// Function to calculate blur based on scale
const calculateBlur = (scale: number, minScale: number, maxScale: number) => {
  const midScale = (minScale + maxScale) / 2;
  const maxBlur = (maxScale - midScale) * 5;
  return `${Math.abs(scale - midScale) * maxBlur}px`;
};

interface GlassShatterProps {
  numPieces?: number;
  minScale?: number;
  maxScale?: number;
  color?: string;
  rotationRange?: number;
  movementNoise?: number;
  animationDuration?: number;
  edgeNoise?: number;
}

export const GlassShatter: React.FC<GlassShatterProps> = ({
  numPieces = 20,
  minScale = 0.6,
  maxScale = 1.4,
  color = "#ffffff55",
  rotationRange = 360,
  movementNoise = 20,
  animationDuration = 10,
  edgeNoise = 0.1,
}) => {
  const pieces = Array.from({ length: numPieces });

  // Memoize the initial rotation values
  const initialRotationsX = useMemo(
    () => pieces.map(() => Math.random() * rotationRange),
    [numPieces, rotationRange]
  );
  const initialRotationsZ = useMemo(
    () => pieces.map(() => Math.random() * rotationRange),
    [numPieces, rotationRange]
  );

  // Memoize the initial scale and blur values
  const initialScales = useMemo(
    () => pieces.map(() => Math.random() * (maxScale - minScale) + minScale),
    [numPieces, minScale, maxScale]
  );
  const initialBlurs = useMemo(
    () =>
      initialScales.map((scale) => calculateBlur(scale, minScale, maxScale)),
    [initialScales, minScale, maxScale]
  );
  console.log(initialScales);
  console.log(initialBlurs);

  const pieceVariants: Variants = {
    initial: (i: number) => ({
      opacity: 1,
      scale: initialScales[i],
      filter: `blur(${initialBlurs[i]})`,
    }),
    animate: (i: number) => {
      const xMovement = (Math.random() - 0.5) * movementNoise;
      const yMovement = (Math.random() - 0.5) * movementNoise;
      const zMovement = -Math.random() * 500; // Move into the screen

      return {
        opacity: 1,
        x: [
          xMovement,
          xMovement + (Math.random() - 0.5) * movementNoise,
          xMovement,
        ],
        y: [
          yMovement,
          yMovement + (Math.random() - 0.5) * movementNoise,
          yMovement,
        ],
        z: [
          zMovement,
          zMovement + (Math.random() - 0.5) * movementNoise,
          zMovement,
        ],
        rotateX: [
          initialRotationsX[i],
          initialRotationsX[i] + rotationRange,
          initialRotationsX[i],
        ],
        rotateZ: [
          initialRotationsZ[i],
          initialRotationsZ[i] + rotationRange,
          initialRotationsZ[i],
        ],
        transition: {
          duration: animationDuration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      };
    },
  };

  const generateTriangleStyle = (scale: number) => {
    const baseSize = scale * 10;
    const borderLeft = `${
      baseSize + Math.random() * edgeNoise * baseSize
    }px solid transparent`;
    const borderRight = `${
      baseSize + Math.random() * edgeNoise * baseSize
    }px solid transparent`;
    const borderBottom = `${
      baseSize * 2 + Math.random() * edgeNoise * baseSize * 2
    }px solid ${color}`;
    return {
      borderLeft,
      borderRight,
      borderBottom,
    };
  };

  return (
    <div className="absolute w-full h-screen flex items-center justify-center overflow-hidden">
      {pieces.map((_, i) => (
        <motion.div
          key={i}
          custom={i}
          initial="initial"
          animate="animate"
          variants={pieceVariants}
          className="absolute origin-center"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        >
          <div
            className="w-0 h-0"
            style={generateTriangleStyle(initialScales[i])}
          />
        </motion.div>
      ))}
    </div>
  );
};
