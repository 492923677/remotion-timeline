import { SequenceItem } from "../components/player/sequence-item";
import type { TimelineRenderProps } from "./types";

type ItemType = "text" | "image" | "video" | "audio";

export const TimelineComposition = ({
  trackItemIds,
  trackItemsMap,
  fps
}: TimelineRenderProps) => {
  return (
    <>
      {trackItemIds.map((id) => {
        const item = trackItemsMap[id];
        if (!item) return null;

        return SequenceItem[item.type as ItemType](item, {
          fps
        });
      })}
    </>
  );
};
