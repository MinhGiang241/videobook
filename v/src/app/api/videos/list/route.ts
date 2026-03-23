/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/database/dbConfig";
import Video from "@/models/video";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log("regbody", reqBody);
    const skip = reqBody["skip"];
    const limit = reqBody["limit"];
    const text = reqBody["text"];
    const sort = reqBody["sort"];
    const order = reqBody["order"];
    const disk = reqBody["disk"];
    const folder = reqBody["folder"];

    const a = {} as any;
    a[sort] = order;
    const sortPipeline = {
      $sort: a,
    };

    const pipeline = [{ $skip: skip }, { $limit: limit }];
    const searchPipeline = text
      ? [
          {
            $match: {
              $expr: {
                $regexMatch: {
                  input: "$Name",
                  regex: text,
                  options: "i",
                },
              },
            },
          },
        ]
      : [];
    const diskPipeline = disk
      ? [
          {
            $match: {
              Disk: disk,
            },
          },
        ]
      : [];

    const folderPipeline = folder
      ? [
          {
            $match: {
              Folder: folder,
            },
          },
        ]
      : [];

    const list = await Video.aggregate([
      ...searchPipeline,
      ...diskPipeline,
      ...folderPipeline,
      sortPipeline,
      ...pipeline,
    ]);
    var total = 0;
    if (text) {
      const obj: any = await Video.aggregate([
        ...searchPipeline,
        ...diskPipeline,
        ...folderPipeline,
        { $count: "total" },
      ]);
      total = obj?.length >= 1 ? (obj[0]["total"] as number) : 0;
      console.log("obj", obj, total);
    } else {
      const obj: any = await Video.aggregate([
        ...searchPipeline,
        ...diskPipeline,
        ...folderPipeline,
        { $count: "total" },
      ]);
      total = obj?.length >= 1 ? (obj[0]["total"] as number) : 0;
    }
    return NextResponse.json({ list, total, success: true });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 },
    );
  } finally {
  }
}
