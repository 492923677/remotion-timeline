import type { ITrackItem } from "@designcombo/timeline";

export interface TimelineRenderProps extends Record<string, unknown> {
  trackItemIds: string[];
  trackItemsMap: Record<string, ITrackItem>;
  fps: number;
  duration: number;
}
