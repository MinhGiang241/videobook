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

  const stream = ffmpeg(videoPath)
    .addOptions([
      "-f hls",
      "-hls_time 4",
      "-hls_list_size 5",
      "-hls_flags delete_segments+append_list+omit_endlist",
      "-c:v libx264",
      "-c:a aac",
    ])
    .format("hls")
    .pipe();

  return new Response(stream as any, {
    headers: {
      "Content-Type": "application/vnd.apple.mpegurl",
      "Cache-Control": "no-cache",
    },
  });
}
