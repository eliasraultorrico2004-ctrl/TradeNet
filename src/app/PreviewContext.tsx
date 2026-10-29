import type { ReactNode } from "react";
import { PreviewContext } from "./usePreview";
import { usePreviewState } from "./usePreviewState";

export function PreviewProvider({ children }: { children: ReactNode }) {
  const state = usePreviewState();
  return (
    <PreviewContext.Provider value={state}>{children}</PreviewContext.Provider>
  );
}
