import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file upload" }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), "storage", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const originalExt = path.extname(file.name);
    const ext = originalExt || ".bin";
    const filename = `${randomUUID()}${ext}`;
    const outputPath = path.join(uploadsDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());

    await writeFile(outputPath, buffer);

    return NextResponse.json({
      path: `/api/media/uploads/${filename}`
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed"
      },
      { status: 500 }
    );
  }
}
