import React from "react";
import { G, Line, Path, Polyline, Svg } from "react-native-svg";

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

function shared(color: string, sw: number) {
  return {
    stroke: color,
    strokeWidth: sw,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };
}

export function CheckIcon({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) {
  const s = shared(color, strokeWidth);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polyline points="20 6 9 17 4 12" {...s} />
    </Svg>
  );
}

export function TrashIcon({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) {
  const s = shared(color, strokeWidth);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polyline points="3 6 5 6 21 6" {...s} />
      <Path d="M19 6l-1 14H6L5 6" {...s} />
      <Path d="M10 11v6" {...s} />
      <Path d="M14 11v6" {...s} />
      <Path d="M9 6V4h6v2" {...s} />
    </Svg>
  );
}

export function PlusIcon({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) {
  const s = shared(color, strokeWidth);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="12" y1="5" x2="12" y2="19" {...s} />
      <Line x1="5" y1="12" x2="19" y2="12" {...s} />
    </Svg>
  );
}

export function CheckCircleIcon({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) {
  const s = shared(color, strokeWidth);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" {...s} />
      <Polyline points="22 4 12 14.01 9 11.01" {...s} />
    </Svg>
  );
}

export function ArrowUpIcon({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) {
  const s = shared(color, strokeWidth);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="12" y1="19" x2="12" y2="5" {...s} />
      <Polyline points="5 12 12 5 19 12" {...s} />
    </Svg>
  );
}
