/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { connect } from "@/database/dbConfig";
import Video from "@/models/video";
import path from "path";

connect();

export async function GET(req: NextRequest, { params }: { params: any }) {
  const { id } = await params;
  const video = await Video.findById(id);
  const videoPath = video.Path;
  console.log({ video });

  const filePath = videoPath;

  if (!fs.existsSync(filePath)) {
    return new Response("Video not found", { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;

  const range = req.headers.get("range");

  // Không có Range -> trả toàn bộ file
  if (!range) {
    const stream = fs.createReadStream(filePath);

    return new Response(stream as any, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": fileSize.toString(),
        "Accept-Ranges": "bytes",
      },
    });
  }

  // Range: bytes=1000-2000
  const [startStr, endStr] = range.replace("bytes=", "").split("-");

  const start = Number(startStr);
  const end = endStr ? Number(endStr) : fileSize - 1;

  if (
    Number.isNaN(start) ||
    Number.isNaN(end) ||
    start >= fileSize ||
    start > end
  ) {
    return new Response("Invalid range", {
      status: 416,
      headers: {
        "Content-Range": `bytes */${fileSize}`,
      },
    });
  }

  const chunkSize = end - start + 1;

  const stream = fs.createReadStream(filePath, {
    start,
    end,
  });

  return new Response(stream as any, {
    status: 206,
    headers: {
      "Content-Type": "video/mp4",
      "Content-Length": chunkSize.toString(),
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
    },
  });
}
