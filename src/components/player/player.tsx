import { useEffect, useRef } from "react";
import { Player as RemotionPlayer, PlayerRef } from "@remotion/player";
import useStore from "@/store/store";
import { TimelineComposition } from "@/remotion/timeline-composition";

const Player = () => {
  const playerRef = useRef<PlayerRef>(null);
  const { setPlayerRef, duration, fps, trackItemIds, trackItemsMap } = useStore();

  useEffect(() => {
    setPlayerRef(playerRef);
  }, [setPlayerRef]);

  return (
    <RemotionPlayer
      ref={playerRef}
      component={TimelineComposition}
      acknowledgeRemotionLicense
      durationInFrames={Math.round((duration / 1000) * fps) || 5 * 30}
      compositionWidth={1920}
      compositionHeight={1080}
      style={{ width: "100%", height: "100%" }}
      inputProps={{
        trackItemIds,
        trackItemsMap,
        fps,
        duration
      }}
      fps={fps}
      controls
    />
  );
};
export default Player;
