"use client";

import { useEffect, useMemo, useState, type ReactElement, type ReactNode } from "react";

const Cell1 = ({ colors }: { colors: string[]; strokeWidth: number }) => (
  <circle cx="50" cy="50" r="9.44" fill={colors[0]} fillRule="evenodd" />
);

const Cell2 = ({ colors, strokeWidth }: { colors: string[]; strokeWidth: number }) => (
  <>
    <line x1="25" x2="75" y1="25" y2="25" stroke={colors[0]} strokeWidth={strokeWidth} />
    <line x1="25" x2="75" y1="50" y2="50" stroke={colors[0]} strokeWidth={strokeWidth} />
    <line x1="25" x2="75" y1="75" y2="75" stroke={colors[0]} strokeWidth={strokeWidth} />
  </>
);

const Cell3 = ({ colors, strokeWidth }: { colors: string[]; strokeWidth: number }) => (
  <>
    <line x1="25" x2="75" y1="25" y2="75" stroke={colors[0]} strokeWidth={strokeWidth} />
    <line x1="25" x2="75" y1="75" y2="25" stroke={colors[0]} strokeWidth={strokeWidth} />
  </>
);

const Cell4 = ({ colors, strokeWidth }: { colors: string[]; strokeWidth: number }) => (
  <rect
    width="50"
    height="50"
    x="25"
    y="25"
    fill="none"
    stroke={colors[0]}
    strokeWidth={strokeWidth}
  />
);

const Cell5 = ({ colors, strokeWidth }: { colors: string[]; strokeWidth: number }) => (
  <line x1="25" x2="75" y1="75" y2="25" fill="none" stroke={colors[0]} strokeWidth={strokeWidth} />
);

const Cell6 = () => null;

const Cell7 = ({ colors }: { colors: string[]; strokeWidth: number }) => (
  <rect width="75" height="75" x="12.5" y="12.5" fill={colors[0]} fillOpacity="0.1" />
);

const seedPRNG = (seed: number) => {
  let seedValue = seed;
  return () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };
};

interface ShapeConfig {
  shape: ({
    colors,
    strokeWidth,
  }: {
    colors: string[];
    strokeWidth: number;
  }) => ReactElement | null;
  weight: number;
}

const shapesConfig: ShapeConfig[] = [
  { shape: Cell1, weight: 1 },
  { shape: Cell2, weight: 1 },
  { shape: Cell3, weight: 1 },
  { shape: Cell4, weight: 1 },
  { shape: Cell5, weight: 1 },
  { shape: Cell6, weight: 5 },
  { shape: Cell7, weight: 3 },
];

const createWeightedSelector = (items: ShapeConfig[], seededRandom: () => number) => {
  const weightedArray: ShapeConfig[] = [];

  for (const item of items) {
    for (let i = 0; i < item.weight; i++) {
      weightedArray.push(item);
    }
  }

  return (): ShapeConfig =>
    weightedArray[Math.floor(seededRandom() * weightedArray.length)] ?? items[0]!;
};

interface ShapeProps {
  x: number;
  y: number;
  colors: string[];
  strokeWidth: number;
  scale: number;
  minInterval?: number;
  maxInterval?: number;
}

const Shape = ({
  x,
  y,
  colors,
  strokeWidth,
  scale,
  minInterval = 0,
  maxInterval = 5000,
}: ShapeProps) => {
  // Starts empty (Cell6) on every render, server or client, so hydration never
  // has to reconcile a Math.random()-picked shape that differs between the
  // two — the timer below then randomizes it client-side after mount.
  const [currentShape, setCurrentShape] = useState<ShapeConfig>(
    () => shapesConfig.find((entry) => entry.shape === Cell6) ?? shapesConfig[shapesConfig.length - 1]!,
  );

  useEffect(() => {
    const getRandomInterval = () => Math.random() * (maxInterval - minInterval) + minInterval;

    const updateShape = () => {
      const seededRandom = seedPRNG(Math.random() * 1000);
      const pickShape = createWeightedSelector(shapesConfig, seededRandom);
      setCurrentShape(pickShape());
    };

    let timeoutId = setTimeout(() => {
      updateShape();

      const setNextTimeout = () => {
        timeoutId = setTimeout(() => {
          updateShape();
          setNextTimeout();
        }, getRandomInterval());
      };

      setNextTimeout();
    }, getRandomInterval());

    return () => clearTimeout(timeoutId);
  }, [minInterval, maxInterval]);

  const ShapeComponent = currentShape.shape;

  return (
    <g transform={`translate(${x} ${y})`}>
      <g transform={`scale(${scale})`}>
        <ShapeComponent colors={colors} strokeWidth={strokeWidth} />
      </g>
    </g>
  );
};

interface BackgroundShapesProps {
  width?: number;
  height?: number;
  cellSize?: number;
  strokeWidth?: number;
  colors?: string[];
  className?: string;
  minInterval?: number;
  maxInterval?: number;
}

export const BackgroundShapes = ({
  width = 500,
  height = 500,
  cellSize = 20,
  strokeWidth = 10,
  colors = ["currentColor"],
  className = "",
  minInterval = 1000,
  maxInterval = 5000,
}: BackgroundShapesProps) => {
  const borderSize = cellSize * 2;
  const scale = 0.2;
  const colorsKey = colors.join("|");

  const shapes = useMemo<ReactNode[]>(() => {
    const list: ReactNode[] = [];
    for (let x = borderSize; x < width / 2; x += cellSize) {
      for (let y = borderSize; y < height - borderSize; y += cellSize) {
        list.push(
          <Shape
            key={`left-${x}-${y}`}
            x={x}
            y={y}
            colors={colors}
            strokeWidth={strokeWidth}
            scale={scale}
            minInterval={minInterval}
            maxInterval={maxInterval}
          />,
          <Shape
            key={`right-${x}-${y}`}
            x={width - cellSize - x}
            y={y}
            colors={colors}
            strokeWidth={strokeWidth}
            scale={scale}
            minInterval={minInterval}
            maxInterval={maxInterval}
          />,
        );
      }
    }
    return list;
    // colors identity may change per-render; use a stable join key instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, cellSize, strokeWidth, colorsKey, borderSize, minInterval, maxInterval]);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className}>
      {shapes}
    </svg>
  );
};

export default BackgroundShapes;
