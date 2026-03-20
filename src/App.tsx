"use client";

import {
  ADD_AUDIO,
  ADD_IMAGE,
  ADD_TEXT,
  ADD_VIDEO,
  dispatch
} from "@designcombo/events";
import { Button } from "./components/ui/button";
import { useRef, useState, type RefObject } from "react";
import Timeline from "./components/timeline";
import { generateId } from "@designcombo/timeline";
import { DEFAULT_FONT } from "./constants/font";
import { Player } from "./components/player";
import useStore from "./store/store";
import useTimelineEvents from "./hooks/use-timeline-events";

const App = () => {
  const { playerRef, trackItemIds, trackItemsMap, duration, fps } = useStore();
  useTimelineEvents();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const openPicker = (inputRef: RefObject<HTMLInputElement | null>) => {
    inputRef.current?.click();
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      throw new Error(payload?.error || "Upload failed");
    }

    const payload = (await response.json()) as { path: string };
    return new URL(payload.path, window.location.origin).toString();
  };

  const handleImportImage = async (files: File[]) => {
    const [file] = files;
    if (!file) return;
    setIsUploading(true);
    setStatusMessage("Uploading image...");

    try {
      const src = await uploadFile(file);

      dispatch(ADD_IMAGE, {
        payload: {
          id: generateId(),
          details: {
            src,
            name: file.name
          }
        }
      });
      setStatusMessage(null);
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Image upload failed"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleImportVideo = async (files: File[]) => {
    const [file] = files;
    if (!file) return;
    setIsUploading(true);
    setStatusMessage("Uploading video...");

    try {
      const src = await uploadFile(file);
      const resourceId = generateId();

      dispatch(ADD_VIDEO, {
        payload: {
          id: generateId(),
          details: {
            src,
            name: file.name,
            volume: 50
          },
          metadata: {
            resourceId
          }
        }
      });
      setStatusMessage(null);
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Video upload failed"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleImportAudio = async (files: File[]) => {
    const [file] = files;
    if (!file) return;
    setIsUploading(true);
    setStatusMessage("Uploading audio...");

    try {
      const src = await uploadFile(file);

      dispatch(ADD_AUDIO, {
        payload: {
          id: generateId(),
          details: {
            src,
            name: file.name,
            volume: 50
          }
        }
      });
      setStatusMessage(null);
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Audio upload failed"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddText = () => {
    dispatch(ADD_TEXT, {
      payload: {
        id: generateId(),
        details: {
          text: "Remotion",
          fontSize: 142,
          fontFamily: DEFAULT_FONT.postScriptName,
          fontUrl: DEFAULT_FONT.url,
          width: 400,
          textAlign: "left",
          color: "#ffffff",
          left: 80
        }
      }
    });
  };

  const openLink = (url: string) => {
    window.open(url, "_blank"); // '_blank' will open the link in a new tab
  };

  const handleRenderVideo = async () => {
    setIsRendering(true);
    setStatusMessage("Rendering video...");

    try {
      const response = await fetch("/api/render", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          trackItemIds,
          trackItemsMap,
          duration,
          fps
        })
      });

      const payload = (await response.json()) as {
        downloadUrl?: string;
        error?: string;
      };

      if (!response.ok || !payload.downloadUrl) {
        throw new Error(payload.error || "Render failed");
      }

      const link = document.createElement("a");
      link.href = payload.downloadUrl;
      link.download = payload.downloadUrl.split("/").pop() || "render.mp4";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setStatusMessage("Render complete. Download started.");
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Render request failed"
      );
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className=" flex flex-col h-screen">
      <div className="absolute top-4 right-4  gap-4 items-center flex text-zinc-400 italic">
        Join our discord
        <Button
          className="border border-white/10 flex gap-2  h-8"
          onClick={() => openLink("https://discord.gg/jrZs3wZyM5")}
          variant="secondary"
          size={"sm"}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 640 512"
            height={16}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"></path>
          </svg>
          Discord
        </Button>
      </div>
      <div className=" bg-background flex-1 flex flex-col items-center justify-center">
        <div className="max-w-3xl flex-1  w-full h-full flex">
          <Player />
        </div>
        <div className="m-auto flex gap-2 py-8">
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              handleImportImage(Array.from(e.target.files || []));
              e.currentTarget.value = "";
            }}
            className="hidden"
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={(e) => {
              handleImportVideo(Array.from(e.target.files || []));
              e.currentTarget.value = "";
            }}
            className="hidden"
          />
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            onChange={(e) => {
              handleImportAudio(Array.from(e.target.files || []));
              e.currentTarget.value = "";
            }}
            className="hidden"
          />
          <Button
            size={"sm"}
            onClick={() => openPicker(imageInputRef)}
            variant={"secondary"}
            disabled={isUploading || isRendering}
          >
            Import Image
          </Button>
          <Button
            size={"sm"}
            onClick={() => openPicker(videoInputRef)}
            variant={"secondary"}
            disabled={isUploading || isRendering}
          >
            Import Video
          </Button>
          <Button
            size={"sm"}
            onClick={() => openPicker(audioInputRef)}
            variant={"secondary"}
            disabled={isUploading || isRendering}
          >
            Import Audio
          </Button>
          <Button size={"sm"} onClick={handleAddText} variant={"secondary"}>
            Add Text
          </Button>
          <Button
            size={"sm"}
            onClick={handleRenderVideo}
            variant={"secondary"}
            disabled={isUploading || isRendering}
          >
            {isRendering ? "Rendering..." : "Render Video"}
          </Button>
        </div>
        {statusMessage ? (
          <div className="pb-8 text-sm text-zinc-400">{statusMessage}</div>
        ) : null}
      </div>

      {playerRef && <Timeline />}
    </div>
  );
};

export default App;
