import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export async function GET(req: NextRequest) {
  try {
    const videoPath = "C:\\Users\\Admin\\Downloads\\M.mp4";
    const range = req.headers.get("range");
    if (!range) {
      return new NextResponse("Requires Range header", { status: 400 });
    }

    const videoSize = 10 * 1024 * 1024; // Ví dụ: kích thước file giả lập
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
    const chunkSize = end - start + 1;

    const ffmpegCommand = ffmpeg(videoPath)
      .setStartTime(start / 1024 / 1024) // Tính thời gian bắt đầu dựa trên vị trí
      .setDuration(chunkSize / 1024 / 1024) // Tính thời gian phát theo chunkSize
      .format("mp4");

    const stream = ffmpegCommand.pipe();

    return new NextResponse(stream as any, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      } as any,
    });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 },
    );
  }
}
