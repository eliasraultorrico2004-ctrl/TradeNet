import type { CSSProperties } from "react";

const paths = {
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
  close: "m6 6 12 12M6 18 18 6",
  user: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2",
  message: "M21 11a9 9 0 0 1-9 9H3l2-5a9 9 0 1 1 16-4Z",
  chevron: "m9 5 7 7-7 7",
  check: "m5 12 4 4L19 6",
  upload: "M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6",
  edit: "m15 4 5 5M4 20l5-1L21 7l-5-5L4 14Z",
  trash: "M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7",
  search: "m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  plus: "M12 5v14M5 12h14",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  screen: "M3 4h18v13H3ZM8 22h8m-4-5v5",
  home: "m3 10 9-7 9 7v11h-6v-7H9v7H3Z",
  bag: "M5 7h14l2 14H3ZM9 8V5a3 3 0 0 1 6 0v3",
  sun: "M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0",
  book: "M12 5C8 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-2-1-6-2-10 1Zm0 0v15",
  grid: "M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h7v7h-7Z",
  box: "m3 7 9-5 9 5v10l-9 5-9-5Zm0 0 9 5 9-5m-9 5v10M7 5l10 5",
} as const;

export type IconName = keyof typeof paths;

export function Icon({
  name,
  size = 22,
  style,
}: {
  name: IconName;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      <path d={paths[name]} />
    </svg>
  );
}
