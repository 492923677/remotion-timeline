import useStore from "@/store/store";
import { TimelineComposition } from "@/remotion/timeline-composition";

const Composition = () => {
  const { trackItemIds, trackItemsMap, fps, duration } = useStore();

  return (
    <TimelineComposition
      trackItemIds={trackItemIds}
      trackItemsMap={trackItemsMap}
      fps={fps}
      duration={duration}
    />
  );
};

export default Composition;
