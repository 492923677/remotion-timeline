import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const getContentType = (filename: string) => {
  const ext = path.extname(filename).toLowerCase();

  switch (ext) {
    case ".mp4":
      return "video/mp4";
    case ".mp3":
      return "audio/mpeg";
    case ".wav":
      return "audio/wav";
    case ".ogg":
      return "audio/ogg";
    case ".webm":
      return "video/webm";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ category: string; filename: string }> }
) {
  try {
    const { category, filename } = await context.params;

    if (!["uploads", "renders"].includes(category)) {
      return NextResponse.json({ error: "Unsupported category" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "storage", category, filename);
    const file = await readFile(filePath);

    return new NextResponse(file, {
      headers: {
        "Content-Type": getContentType(filename),
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Media not found"
      },
      { status: 404 }
    );
  }
}
