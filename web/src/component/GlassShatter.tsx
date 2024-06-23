import { motion, Variants } from "framer-motion";
import { useMemo } from "react";
import { Random } from "../helper/random";

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
  seed?: number;
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
  seed = null,
}) => {
  const rng = new Random(seed);
  const pieces = Array.from({ length: numPieces });

  // Memoize the initial rotation values
  const initialRotationsX = useMemo(
    () => pieces.map(() => rng.nextNumber() * rotationRange),
    [numPieces, rotationRange]
  );
  const initialRotationsZ = useMemo(
    () => pieces.map(() => rng.nextNumber() * rotationRange),
    [numPieces, rotationRange]
  );

  // Memoize the initial scale and blur values
  const initialScales = useMemo(
    () => pieces.map(() => rng.nextNumber() * (maxScale - minScale) + minScale),
    [numPieces, minScale, maxScale]
  );
  const initialBlurs = useMemo(
    () =>
      initialScales.map((scale) => calculateBlur(scale, minScale, maxScale)),
    [initialScales, minScale, maxScale]
  );

  const pieceVariants: Variants = {
    initial: (i: number) => ({
      opacity: 1,
      scale: initialScales[i],
      filter: `blur(${initialBlurs[i]})`,
    }),
    animate: (i: number) => {
      const xMovement = (rng.nextNumber() - 0.5) * movementNoise;
      const yMovement = (rng.nextNumber() - 0.5) * movementNoise;
      const zMovement = -rng.nextNumber() * 500; // Move into the screen

      return {
        opacity: 1,
        x: [
          xMovement,
          xMovement + (rng.nextNumber() - 0.5) * movementNoise,
          xMovement,
        ],
        y: [
          yMovement,
          yMovement + (rng.nextNumber() - 0.5) * movementNoise,
          yMovement,
        ],
        z: [
          zMovement,
          zMovement + (rng.nextNumber() - 0.5) * movementNoise,
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
    exit: (i) => ({
      opacity: 0,
      scale: initialScales[i],
      filter: `blur(${initialBlurs[i]})`,
      transition: { duration: 0.1 },
    }),
  };

  const generateTriangleStyle = (scale: number) => {
    const baseSize = scale * 10;
    const borderLeft = `${
      baseSize + rng.nextNumber() * edgeNoise * baseSize
    }px solid transparent`;
    const borderRight = `${
      baseSize + rng.nextNumber() * edgeNoise * baseSize
    }px solid transparent`;
    const borderBottom = `${
      baseSize * 2 + rng.nextNumber() * edgeNoise * baseSize * 2
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
          exit="exit"
          variants={pieceVariants}
          className="absolute origin-center"
          style={{
            left: `${rng.nextNumber() * 100}%`,
            top: `${rng.nextNumber() * 100}%`,
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
