"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useMotionTemplate,
  type MotionValue,
} from "framer-motion";
import { SiReact, SiNodedotjs, SiMongodb, SiPython, SiCplusplus, SiJavascript, SiGithub } from "react-icons/si";
import { Sparkles } from "lucide-react";

/** Matches both react-icons and lucide-react's component shape without pulling in either library's full prop type. */
type IconComponent = React.ComponentType<{ className?: string; size?: number | string }>;

const GRID_CONSTANTS = {
  STUD_WIDTH: 65,
  ROW_HEIGHT: 80,
  MAX_ROWS: 20,
  COLS: 6,
  APEX_HEIGHT: 150,
};

const STUD_THEMES = {
  green: {
    wall: "linear-gradient(90deg, #087028 0%, #10923b 20%, #1ab84d 38%, #20cc55 50%, #1ab84d 62%, #10923b 80%, #087028 100%)",
    cap: "linear-gradient(135deg, #42f585 0%, #25dd62 40%, #18c04e 70%, #10a040 100%)",
    shadow: "radial-gradient(ellipse, rgba(0,40,0,0.6) 0%, transparent 70%)",
    rim: "rgba(255,255,255,0.7)",
  },
  dark: {
    wall: "linear-gradient(90deg, #09090b 0%, #18181b 20%, #27272a 38%, #3f3f46 50%, #27272a 62%, #18181b 80%, #09090b 100%)",
    cap: "linear-gradient(135deg, #52525b 0%, #3f3f46 40%, #27272a 70%, #18181b 100%)",
    shadow: "radial-gradient(ellipse, rgba(0,0,0,0.8) 0%, transparent 70%)",
    rim: "rgba(255,255,255,0.2)",
  },
  yellow: {
    wall: "linear-gradient(90deg, #a16207 0%, #ca8a04 20%, #eab308 38%, #facc15 50%, #eab308 62%, #ca8a04 80%, #a16207 100%)",
    cap: "linear-gradient(135deg, #fef08a 0%, #fde047 40%, #eab308 70%, #ca8a04 100%)",
    shadow: "radial-gradient(ellipse, rgba(80,50,0,0.6) 0%, transparent 70%)",
    rim: "rgba(255,255,255,0.7)",
  },
  blue: {
    wall: "linear-gradient(90deg, #1e3a8a 0%, #1d4ed8 20%, #2563eb 38%, #3b82f6 50%, #2563eb 62%, #1d4ed8 80%, #1e3a8a 100%)",
    cap: "linear-gradient(135deg, #93c5fd 0%, #60a5fa 40%, #3b82f6 70%, #2563eb 100%)",
    shadow: "radial-gradient(ellipse, rgba(0,0,80,0.6) 0%, transparent 70%)",
    rim: "rgba(255,255,255,0.7)",
  },
  red: {
    wall: "linear-gradient(90deg, #7f1d1d 0%, #b91c1c 20%, #dc2626 38%, #ef4444 50%, #dc2626 62%, #b91c1c 80%, #7f1d1d 100%)",
    cap: "linear-gradient(135deg, #fca5a5 0%, #f87171 40%, #ef4444 70%, #dc2626 100%)",
    shadow: "radial-gradient(ellipse, rgba(80,0,0,0.6) 0%, transparent 70%)",
    rim: "rgba(255,255,255,0.7)",
  },
  purple: {
    wall: "linear-gradient(90deg, #581c87 0%, #7e22ce 20%, #9333ea 38%, #a855f7 50%, #9333ea 62%, #7e22ce 80%, #581c87 100%)",
    cap: "linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 40%, #c084fc 70%, #a855f7 100%)",
    shadow: "radial-gradient(ellipse, rgba(50,0,80,0.6) 0%, transparent 70%)",
    rim: "rgba(255,255,255,0.7)",
  },
};

type StudColor = keyof typeof STUD_THEMES;

const LegoStud = ({ color = "green", yOffset = 0 }: { color?: StudColor; yOffset?: number }) => {
  const t = STUD_THEMES[color];
  const studHeight = 16;
  const studWidth = 72;
  const studCapHeight = 16;

  return (
    <div
      className="relative flex flex-1 items-end justify-center"
      style={{ transform: `translateY(${yOffset}px)` }}
    >
      <div
        className="absolute bottom-[-3px] left-1/2 z-0 w-[75%] -translate-x-1/2 rounded-[50%]"
        style={{ height: "10px", background: t.shadow }}
      />

      <div className="relative z-10" style={{ width: `${studWidth}%`, maxWidth: "42px", marginBottom: "-1px" }}>
        <div
          className="relative w-full overflow-hidden"
          style={{ height: `${studHeight}px`, borderRadius: "50% / 20%", background: t.wall }}
        >
          <div
            className="absolute top-0 left-[20%] h-full w-[25%]"
            style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.25), transparent)" }}
          />
        </div>

        <div
          className="absolute left-0 flex w-full items-center justify-center overflow-hidden rounded-[50%]"
          style={{
            top: `-${studCapHeight / 2}px`,
            height: `${studCapHeight}px`,
            background: t.cap,
            boxShadow: `inset 0px 2px 4px rgba(255,255,255,0.6), inset 0px -2px 4px rgba(0,0,0,0.2), 0px 1px 1px rgba(0,0,0,0.4)`,
            borderTop: `1px solid ${t.rim}`,
          }}
        >
          <span
            className="pointer-events-none select-none text-[10px] font-black tracking-widest opacity-80"
            style={{
              color: "rgba(0,0,0,0.15)",
              textShadow: "0px 1px 0px rgba(255,255,255,0.6)",
              transform: "scaleY(0.55) translateY(-1px)",
            }}
          >
            VD
          </span>
        </div>
      </div>
    </div>
  );
};

interface LegoBlockProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  topColor: string;
  faceGradient: string;
  bottomColor: string;
  topHeight?: number;
  bottomHeight?: number;
  roundedTop?: boolean;
  roundedBottom?: boolean;
  className?: string;
  children: React.ReactNode;
  studs?: number;
  studColor?: StudColor;
  hideStuds?: boolean | number[];
  studYOffset?: number;
}

const LegoBlock = ({
  mouseX,
  mouseY,
  topColor,
  faceGradient,
  bottomColor,
  topHeight = 19,
  bottomHeight = 15,
  roundedTop = false,
  roundedBottom = false,
  className = "",
  children,
  studs = 0,
  studColor = "green",
  hideStuds = false,
  studYOffset = 12,
}: LegoBlockProps) => {
  const topDarkenEnd = 100;
  const topShadow = "inset 0px 0px 4px rgba(0,0,0,0.28)";
  const faceShadow = "inset 0px 2px 6px rgba(255,255,255,0.47)";

  const highlightBg = useMotionTemplate`radial-gradient(circle 120px at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.25), transparent)`;

  return (
    <div className={`relative w-full ${className}`}>
      <div
        className="relative w-full"
        style={{
          height: `${topHeight}px`,
          background: `linear-gradient(to bottom, ${topColor}, color-mix(in srgb, ${topColor} ${topDarkenEnd}%, black))`,
          boxShadow: topShadow,
          borderRadius: roundedTop ? "4px 4px 0 0" : "0",
        }}
      >
        {studs > 0 && (
          <div className="absolute bottom-full left-0 flex w-full">
            {[...Array(studs)].map((_, i) => {
              const isHidden = Array.isArray(hideStuds) ? hideStuds.includes(i) : hideStuds;
              return isHidden ? (
                <div key={i} className="flex-1" />
              ) : (
                <LegoStud key={i} color={studColor} yOffset={studYOffset} />
              );
            })}
          </div>
        )}
      </div>
      <div
        className="relative w-full overflow-hidden border-x border-black/5"
        style={{ background: faceGradient, boxShadow: faceShadow }}
      >
        <motion.div className="pointer-events-none absolute inset-0 z-20 opacity-60" style={{ background: highlightBg }} />
        <div className="relative z-30">{children}</div>
      </div>
      <div
        className="relative w-full"
        style={{
          height: `${bottomHeight}px`,
          background: bottomColor,
          boxShadow: "inset 0px 2px 4px rgba(0,0,0,0.15)",
          borderRadius: roundedBottom ? "0 0 4px 4px" : "0",
        }}
      />
    </div>
  );
};

type Module = {
  id: string;
  name: string;
  desc: string;
  icon: IconComponent;
  studs: number;
  colors: {
    topColor: string;
    faceGradient: string;
    bottomColor: string;
    studColor: StudColor;
    iconBg: string;
    iconColor: string;
  };
};

/** Vansh's actual stack, pulled from the resume — not the vendor demo's placeholder set. */
const MODULES: Module[] = [
  {
    id: "react",
    name: "React.js",
    desc: "UI Library",
    icon: SiReact,
    studs: 4,
    colors: {
      topColor: "#38bdf8",
      faceGradient: "linear-gradient(180deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)",
      bottomColor: "#075985",
      studColor: "blue",
      iconBg: "bg-black/20 shadow-inner",
      iconColor: "text-white drop-shadow-sm",
    },
  },
  {
    id: "node",
    name: "Node.js",
    desc: "Runtime",
    icon: SiNodedotjs,
    studs: 4,
    colors: {
      topColor: "#4ade80",
      faceGradient: "linear-gradient(180deg, #22c55e 0%, #16a34a 50%, #15803d 100%)",
      bottomColor: "#14532d",
      studColor: "green",
      iconBg: "bg-black/20 shadow-inner",
      iconColor: "text-white drop-shadow-sm",
    },
  },
  {
    id: "mongodb",
    name: "MongoDB",
    desc: "Database",
    icon: SiMongodb,
    studs: 4,
    colors: {
      topColor: "#6ee7b7",
      faceGradient: "linear-gradient(180deg, #10b981 0%, #059669 50%, #047857 100%)",
      bottomColor: "#064e3b",
      studColor: "green",
      iconBg: "bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]",
      iconColor: "text-white drop-shadow-sm",
    },
  },
  {
    id: "python",
    name: "Python",
    desc: "Language",
    icon: SiPython,
    studs: 4,
    colors: {
      topColor: "#93c5fd",
      faceGradient: "linear-gradient(180deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)",
      bottomColor: "#1e3a8a",
      studColor: "yellow",
      iconBg: "bg-black/20 shadow-inner",
      iconColor: "text-white drop-shadow-sm",
    },
  },
  {
    id: "cpp",
    name: "C++",
    desc: "OOP",
    icon: SiCplusplus,
    studs: 2,
    colors: {
      topColor: "#9ca3af",
      faceGradient: "linear-gradient(180deg, #6b7280 0%, #4b5563 50%, #374151 100%)",
      bottomColor: "#1f2937",
      studColor: "dark",
      iconBg: "bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]",
      iconColor: "text-white drop-shadow-sm",
    },
  },
  {
    id: "javascript",
    name: "JavaScript",
    desc: "ES6+",
    icon: SiJavascript,
    studs: 4,
    colors: {
      topColor: "#fde047",
      faceGradient: "linear-gradient(180deg, #facc15 0%, #eab308 50%, #ca8a04 100%)",
      bottomColor: "#854d0e",
      studColor: "yellow",
      iconBg: "bg-black/20 shadow-inner",
      iconColor: "text-black/80 drop-shadow-sm",
    },
  },
  {
    id: "genai",
    name: "GenAI / LLMs",
    desc: "Applied AI",
    icon: Sparkles,
    studs: 4,
    colors: {
      topColor: "#e9d5ff",
      faceGradient: "linear-gradient(180deg, #a855f7 0%, #9333ea 50%, #7e22ce 100%)",
      bottomColor: "#581c87",
      studColor: "purple",
      iconBg: "bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]",
      iconColor: "text-white drop-shadow-sm",
    },
  },
  {
    id: "git",
    name: "Git / GitHub",
    desc: "Version control",
    icon: SiGithub,
    studs: 2,
    colors: {
      topColor: "#27272a",
      faceGradient: "linear-gradient(180deg, #3f3f46 0%, #27272a 50%, #18181b 100%)",
      bottomColor: "#09090b",
      studColor: "dark",
      iconBg: "bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]",
      iconColor: "text-white drop-shadow-sm",
    },
  },
];

const ModuleBlock = ({
  module,
  hiddenStuds = [],
  onClick,
  isAnimating,
  startRect,
  mouseX,
  mouseY,
  onAnimationComplete,
}: {
  module: Module;
  hiddenStuds?: number[];
  onClick: (e: React.MouseEvent) => void;
  isAnimating?: boolean;
  startRect?: DOMRect | null;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  onAnimationComplete?: () => void;
}) => {
  const widthPx = module.studs * GRID_CONSTANTS.STUD_WIDTH;
  const isCompact = module.studs <= 2;
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAnimating && startRect && wrapperRef.current) {
      const endRect = wrapperRef.current.getBoundingClientRect();
      const dx = startRect.left - endRect.left;
      const dy = startRect.top - endRect.top;
      const apexY = Math.min(dy, 0) - GRID_CONSTANTS.APEX_HEIGHT;

      const animation = wrapperRef.current.animate(
        [
          { transform: `translate(${dx}px, ${dy}px) scale(1, 1)`, filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.2))", offset: 0 },
          { transform: `translate(${dx}px, ${dy}px) scale(1.1, 0.85)`, filter: "drop-shadow(0px 5px 5px rgba(0,0,0,0.3))", offset: 0.15 },
          { transform: `translate(${dx * 0.75}px, ${dy + (apexY - dy) * 0.5}px) scale(0.9, 1.15)`, filter: "drop-shadow(0px 30px 20px rgba(0,0,0,0.05))", offset: 0.35 },
          { transform: `translate(${dx * 0.5}px, ${apexY}px) scale(1, 1)`, filter: "drop-shadow(0px 40px 20px rgba(0,0,0,0))", offset: 0.55 },
          { transform: `translate(${dx * 0.25}px, ${apexY * 0.5}px) scale(0.9, 1.15)`, filter: "drop-shadow(0px 30px 20px rgba(0,0,0,0.05))", offset: 0.75 },
          { transform: `translate(0px, 0px) scale(1.15, 0.85)`, filter: "drop-shadow(0px 5px 5px rgba(0,0,0,0.3))", offset: 0.9 },
          { transform: `translate(0px, 0px) scale(1, 1)`, filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.2))", offset: 1 },
        ],
        { duration: 1200, easing: "cubic-bezier(0.25, 1, 0.5, 1)", fill: "both" },
      );

      animation.onfinish = () => onAnimationComplete?.();
      return () => animation.cancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnimating, startRect]);

  const Icon = module.icon;

  return (
    <div ref={wrapperRef} className="lego-block-wrapper relative z-50" style={{ width: widthPx }}>
      <button
        type="button"
        onClick={onClick}
        aria-label={`Toggle ${module.name}`}
        className="group relative w-full shrink-0 touch-none rounded-lg text-left transition-all duration-200 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-red active:scale-95"
      >
        <div className="pointer-events-none absolute inset-0 z-30 rounded-lg bg-white/0 transition-colors group-hover:bg-white/10" />
        <LegoBlock
          mouseX={mouseX}
          mouseY={mouseY}
          topColor={module.colors.topColor}
          faceGradient={module.colors.faceGradient}
          bottomColor={module.colors.bottomColor}
          roundedTop
          roundedBottom
          studs={module.studs}
          studColor={module.colors.studColor}
          hideStuds={hiddenStuds}
        >
          <div className={`flex h-[60px] w-full items-center ${isCompact ? "gap-2.5 px-3" : "gap-3 px-4"}`}>
            <div
              className={`flex shrink-0 items-center justify-center rounded-md ${module.colors.iconBg} ${isCompact ? "h-7 w-7" : "h-9 w-9 rounded-lg"}`}
            >
              <Icon className={module.colors.iconColor} size={isCompact ? 18 : 22} />
            </div>
            <h4
              className={`truncate font-headline font-bold tracking-wide text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] ${isCompact ? "text-[15px]" : "text-[17px]"}`}
            >
              {module.name}
            </h4>
          </div>
        </LegoBlock>
      </button>
    </div>
  );
};

export interface TechStackBuilderProps {
  modules?: Module[];
  defaultEquippedIds?: string[];
  className?: string;
}

export function TechStackBuilder({
  modules = MODULES,
  defaultEquippedIds,
  className = "",
}: TechStackBuilderProps) {
  const [equippedIds, setEquippedIds] = useState<string[]>(
    defaultEquippedIds ?? modules.map((m) => m.id),
  );
  const [animatingBlocks, setAnimatingBlocks] = useState<Record<string, DOMRect>>({});

  const controls = useAnimation();
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const handlePointerMove = (e: React.PointerEvent) => {
    mouseX.set((e.clientX / window.innerWidth) * 100);
    mouseY.set((e.clientY / window.innerHeight) * 100);
  };

  const handleToggleEquip = (id: string, e: React.MouseEvent) => {
    if (animatingBlocks[id]) return;

    const el = (e.currentTarget as HTMLElement).closest(".lego-block-wrapper");
    if (!el) return;
    const startRect = el.getBoundingClientRect();

    setAnimatingBlocks((prev) => ({ ...prev, [id]: startRect }));
    setEquippedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    setTimeout(() => {
      controls.start({ y: [0, 10, -3, 0], transition: { duration: 0.4, times: [0, 0.4, 0.7, 1], ease: "easeInOut" } });
    }, 1080);
  };

  const equippedModules = equippedIds.map((id) => modules.find((m) => m.id === id)!).filter(Boolean);
  const unequippedModules = modules.filter((m) => !equippedIds.includes(m.id));

  const { grid, positionedModules } = useMemo(() => {
    const calculatedGrid: (string | null)[][] = [];
    const positioned = equippedModules.map((m) => {
      let placedRow = -1;
      let placedCol = -1;
      for (let r = 0; r < GRID_CONSTANTS.MAX_ROWS; r++) {
        if (!calculatedGrid[r]) calculatedGrid[r] = Array(GRID_CONSTANTS.COLS).fill(null);
        let contiguous = 0;
        for (let c = 0; c < GRID_CONSTANTS.COLS; c++) {
          if (!calculatedGrid[r][c]) {
            contiguous++;
            if (contiguous === m.studs) {
              placedRow = r;
              placedCol = c - m.studs + 1;
              break;
            }
          } else {
            contiguous = 0;
          }
        }
        if (placedRow !== -1) break;
      }
      if (placedRow !== -1) {
        for (let i = 0; i < m.studs; i++) {
          calculatedGrid[placedRow][placedCol + i] = m.id;
        }
      } else {
        placedRow = 0;
        placedCol = 0;
      }
      return { module: m, rowIndex: placedRow, colIndex: placedCol };
    });
    return { grid: calculatedGrid, positionedModules: positioned };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equippedIds]);

  const hiddenServerStuds: number[] = [];
  if (grid[0]) {
    grid[0].forEach((occupantId, idx) => {
      if (occupantId && !animatingBlocks[occupantId]) hiddenServerStuds.push(idx);
    });
  }

  const towerHeight =
    equippedModules.length > 0
      ? (Math.max(...positionedModules.map((m) => m.rowIndex)) + 1) * GRID_CONSTANTS.ROW_HEIGHT
      : 0;

  return (
    <div
      onPointerMove={handlePointerMove}
      className={`relative flex w-full flex-col items-center gap-16 overflow-hidden py-8 font-sans select-none lg:flex-row lg:items-start lg:justify-center lg:gap-24 ${className}`}
    >
      <div className="flex w-full max-w-[500px] flex-1 flex-col justify-center">
        <p className="mb-6 text-center font-headline text-sm font-medium uppercase tracking-[0.3em] text-fg-muted lg:text-left">
          Tap a block to toggle it
        </p>
        <div className="relative z-20 flex min-h-[200px] flex-wrap justify-center gap-5 lg:justify-start">
          {unequippedModules.map((module) => {
            const startRect = animatingBlocks[module.id];
            return (
              <ModuleBlock
                key={module.id}
                module={module}
                mouseX={mouseX}
                mouseY={mouseY}
                isAnimating={!!startRect}
                startRect={startRect || null}
                onAnimationComplete={() => {
                  setAnimatingBlocks((prev) => {
                    const next = { ...prev };
                    delete next[module.id];
                    return next;
                  });
                }}
                onClick={(e) => handleToggleEquip(module.id, e)}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-16 flex w-full flex-col items-center gap-4 lg:mt-0 lg:w-auto">
        <div className="flex shrink-0 origin-bottom flex-col items-center scale-[0.8] sm:scale-90 lg:scale-100">
          <motion.div
            animate={controls}
            className="relative w-[390px] max-w-[85vw] rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.25)] transition-all duration-700 ease-out"
            style={{ marginTop: `${towerHeight}px` }}
          >
            <div className="absolute left-0 z-20 h-0 w-full" style={{ bottom: "calc(100% - 14px)" }}>
              {positionedModules.map(({ module, rowIndex, colIndex }) => {
                const hiddenLocalStuds: number[] = [];
                if (grid[rowIndex + 1]) {
                  for (let i = 0; i < module.studs; i++) {
                    const occupantId = grid[rowIndex + 1][colIndex + i];
                    if (occupantId && !animatingBlocks[occupantId]) hiddenLocalStuds.push(i);
                  }
                }
                const startRect = animatingBlocks[module.id];

                return (
                  <div
                    key={module.id}
                    className="absolute"
                    style={{ bottom: rowIndex * GRID_CONSTANTS.ROW_HEIGHT, left: colIndex * GRID_CONSTANTS.STUD_WIDTH, zIndex: rowIndex * 10 }}
                  >
                    <ModuleBlock
                      module={module}
                      hiddenStuds={hiddenLocalStuds}
                      mouseX={mouseX}
                      mouseY={mouseY}
                      isAnimating={!!startRect}
                      startRect={startRect || null}
                      onAnimationComplete={() => {
                        setAnimatingBlocks((prev) => {
                          const next = { ...prev };
                          delete next[module.id];
                          return next;
                        });
                      }}
                      onClick={(e) => handleToggleEquip(module.id, e)}
                    />
                  </div>
                );
              })}
            </div>

            <LegoBlock
              mouseX={mouseX}
              mouseY={mouseY}
              topColor="#e8283f"
              faceGradient="linear-gradient(180deg, #ff6b7a 0%, #e8283f 50%, #b91c2e 100%)"
              bottomColor="#8a1521"
              roundedTop
              roundedBottom
              studs={6}
              studColor="red"
              hideStuds={hiddenServerStuds}
              className="relative z-10"
            >
              <div className="flex items-center justify-between px-5 py-4 pt-5">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="truncate font-headline text-[17px] font-bold tracking-wide text-white drop-shadow-md">
                      Vansh&apos;s Stack
                    </h3>
                    <p className="mt-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red-100/90 drop-shadow-sm">
                      {equippedModules.length} {equippedModules.length === 1 ? "block" : "blocks"} equipped
                    </p>
                  </div>
                </div>
              </div>
            </LegoBlock>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default TechStackBuilder;
