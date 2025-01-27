/* eslint-disable @typescript-eslint/no-explicit-any */
import Video from "@/models/video";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const id = reqBody["id"];
    const video = await Video.findOne({
      _id: id,
    });
    return NextResponse.json({ video, success: true });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 },
    );
  }
}
