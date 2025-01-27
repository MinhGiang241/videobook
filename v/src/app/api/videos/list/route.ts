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
    const list = await Video.aggregate([
      ...searchPipeline,
      sortPipeline,
      ...pipeline,
    ]);
    var total = 0;
    if (text) {
      const obj: any = await Video.aggregate([
        ...searchPipeline,
        { $count: "total" },
      ]);
      total = obj?.length >= 1 ? (obj[0]["total"] as number) : 0;
      console.log("obj", obj, total);
    } else {
      total = await Video.countDocuments();
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
