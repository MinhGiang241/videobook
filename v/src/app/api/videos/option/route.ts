/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/database/dbConfig";
import Video from "@/models/video";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await Video.aggregate([
      {
        $match: {
          Folder: { $ne: null },
        },
      },

      // unique Disk + Folder
      {
        $group: {
          _id: {
            disk: "$Disk",
            folder: "$Folder",
          },
        },
      },

      // group theo Disk
      {
        $group: {
          _id: "$_id.disk",
          items: {
            $push: {
              value: "$_id.folder",
              label: "$_id.folder",
            },
          },
          allFolders: { $addToSet: "$_id.folder" }, // 👈 gom tất cả folder
        },
      },

      // gom toàn bộ folder lại (global)
      {
        $group: {
          _id: null,
          disks: {
            $push: {
              k: "$_id",
              v: "$items",
            },
          },
          all: { $push: "$allFolders" },
        },
      },

      // flatten allFolders
      {
        $project: {
          disks: 1,
          all: {
            $reduce: {
              input: "$all",
              initialValue: [],
              in: { $setUnion: ["$$value", "$$this"] },
            },
          },
        },
      },

      // convert all thành { value, label }
      {
        $project: {
          disks: 1,
          all: {
            $map: {
              input: "$all",
              as: "f",
              in: {
                value: "$$f",
                label: "$$f",
              },
            },
          },
        },
      },

      // merge "" key vào object
      {
        $project: {
          data: {
            $concatArrays: [
              "$disks",
              [
                {
                  k: "",
                  v: "$all",
                },
              ],
            ],
          },
        },
      },

      {
        $replaceRoot: {
          newRoot: { $arrayToObject: "$data" },
        },
      },
    ]);
    const list = result[0] || {};
    return NextResponse.json({ list, success: true });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 },
    );
  }
}
