import { Composition } from "remotion";
import { TimelineComposition } from "./timeline-composition";
import type { TimelineRenderProps } from "./types";

const defaultProps: TimelineRenderProps = {
  trackItemIds: [],
  trackItemsMap: {},
  fps: 30,
  duration: 5000
};

const calculateMetadata = async ({
  props
}: {
  props: Record<string, unknown>;
}) => {
  const timelineProps = props as TimelineRenderProps;
  const fps = timelineProps.fps || 30;
  const durationInFrames = Math.max(
    1,
    Math.round(((timelineProps.duration || 1000) / 1000) * fps)
  );

  return {
    fps,
    width: 1920,
    height: 1080,
    durationInFrames
  };
};

export const RemotionRoot = () => {
  return (
    <Composition
      // Remotion's generic inference is conservative here, so we pin the props type.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...({} as any)}
      id="TimelineComposition"
      component={TimelineComposition}
      defaultProps={defaultProps}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      calculateMetadata={calculateMetadata}
    />
  );
};
