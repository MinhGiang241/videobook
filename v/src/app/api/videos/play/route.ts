/* eslint-disable @typescript-eslint/no-explicit-any */
import Video from "@/models/video";
import { exec } from "child_process";
import { NextRequest, NextResponse } from "next/server";
// connect();

export async function POST(request: NextRequest) {
  const reqBody = await request.json();
  console.log("regbody", reqBody);
  const filePath = reqBody["url"];

  const psScriptPath = "E:\\Video\\start.ps1";
  const command = `powershell -ExecutionPolicy Bypass -File "${psScriptPath}" -Path "${filePath}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing PowerShell script: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`PowerShell script error: ${stderr}`);
      return;
    }
    // In ra kết quả nếu thành công
    console.log(`Output: ${stdout}`);
  });

  return NextResponse.json({});
}

export async function GET() {
  try {
    const list = await Video.find();

    await Video.updateMany({}, [
      {
        $set: {
          Disk: { $arrayElemAt: [{ $split: ["$Path", ":"] }, 0] },

          Folder: {
            $let: {
              vars: {
                parts: {
                  $split: [
                    { $arrayElemAt: [{ $split: ["$Path", ":"] }, 1] },
                    "\\",
                  ],
                },
              },
              in: {
                $arrayElemAt: [
                  "$$parts",
                  { $subtract: [{ $size: "$$parts" }, 2] },
                ],
              },
            },
          },
        },
      },
    ]);

    return NextResponse.json({ list, total: list.length, success: true });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 },
    );
  }
}
