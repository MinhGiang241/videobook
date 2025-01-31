/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { connect } from "@/database/dbConfig";
import Video from "@/models/video";

connect();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const video = await Video.findById(params.id);
    console.log("video", video);
    // return NextResponse.json({ video: video.FullName });
    const videoPath = video.Path;

    // Kiểm tra xem file có tồn tại không
    if (!fs.existsSync(videoPath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const videoSize = fs.statSync(videoPath).size; // Lấy kích thước file thực tế
    const range = req.headers.get("range");

    if (!range) {
      return new NextResponse("Requires Range header", { status: 400 });
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const start = parseInt(parts[0], 10);
    const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB per chunk
    const end = Math.min(start + CHUNK_SIZE, fileSize - 1);
    const chunkSize = end - start + 1;
    // const ffmpegStream = ffmpeg(videoPath)
    //   .format("mp4") // Chuyển đổi TS sang MP4
    //   .pipe();
    const fileStream = fs.createReadStream(videoPath, { start, end });

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize.toString(),
      "Content-Type": "video/mp4",
    };

    return new NextResponse(fileStream as any, {
      status: 206,
      headers: headers as any,
    });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 },
    );
  }
}
