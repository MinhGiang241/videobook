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
