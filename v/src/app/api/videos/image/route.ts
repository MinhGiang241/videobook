/* eslint-disable @typescript-eslint/no-explicit-any */
import Video from "@/models/video";
import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const id = reqBody["id"];
    const value = reqBody["value"];
    const video = await Video.findOne({
      _id: id,
    });
    const { stdout } = await execFileAsync(
      "ffmpeg",
      [
        "-ss",
        String(value),
        "-i",
        video.Path,
        "-frames:v",
        "1",
        "-f",
        "image2",
        "-c:v",
        "mjpeg",
        "-q:v",
        "2",
        "pipe:1",
      ],
      {
        encoding: "buffer",
        maxBuffer: 10 * 1024 * 1024,
      },
    );

    const data = `data:image/jpeg;base64,${stdout.toString("base64")}`;
    return NextResponse.json({ data, success: true });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 },
    );
  }
}
