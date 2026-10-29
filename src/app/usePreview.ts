import { createContext, useContext } from "react";
import type { PreviewState } from "./usePreviewState";

export const PreviewContext = createContext<PreviewState | null>(null);

export function usePreview() {
  const state = useContext(PreviewContext);
  if (!state) throw new Error("Falta PreviewProvider");
  return state;
}
