import { randomUUID } from "crypto";
import { mkdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import type { TimelineRenderProps } from "@/remotion/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let bundlePromise: Promise<string> | null = null;

const getBundle = () => {
  if (!bundlePromise) {
    bundlePromise = import("@remotion/bundler").then(({ bundle }) =>
      bundle({
        entryPoint: path.join(process.cwd(), "src", "remotion", "index.ts"),
        onProgress: () => undefined
      })
    );
  }

  return bundlePromise;
};

export async function POST(request: Request) {
  try {
    const inputProps = (await request.json()) as TimelineRenderProps;
    console.log("Received render request with inputProps:", inputProps);
    
    const { renderMedia, selectComposition } = await import("@remotion/renderer");

    const serveUrl = await getBundle();
    const composition = await selectComposition({
      serveUrl,
      id: "TimelineComposition",
      inputProps: inputProps as Record<string, unknown>
    });

    const rendersDir = path.join(process.cwd(), "storage", "renders");
    await mkdir(rendersDir, { recursive: true });

    const filename = `${randomUUID()}.mp4`;
    const outputLocation = path.join(rendersDir, filename);

    await renderMedia({
      serveUrl,
      composition,
      inputProps: inputProps as Record<string, unknown>,
      codec: "h264",
      outputLocation,
      overwrite: true
    });

    return NextResponse.json({
      downloadUrl: `/api/media/renders/${filename}`
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Render failed"
      },
      { status: 500 }
    );
  }
}
