/* eslint-disable @typescript-eslint/no-explicit-any */
import Video from "@/models/video";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const id = reqBody["id"];
    const base64 = reqBody["value"];
    const video = await Video.findOne({
      _id: id,
    });
    const base64Data = base64.replace(
      /^data:image\/[a-zA-Z0-9.+-]+;base64,/,
      "",
    );

    const buffer = Buffer.from(base64Data, "base64");
    await fs.writeFile(video.ThumbNail, buffer);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 },
    );
  }
}
