/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/dist/server/web/spec-extension/response";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function handler(req: any, response: any) {
  const res = NextResponse.next();

  // add the CORS headers to the response
  res.headers.append("Access-Control-Allow-Credentials", "true");
  res.headers.append("Access-Control-Allow-Origin", "*"); // replace this your actual origin
  res.headers.append(
    "Access-Control-Allow-Methods",
    "GET,DELETE,PATCH,POST,PUT",
  );
  res.headers.append(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  return res;
}

export const config = {
  matcher: "/api/:path*",
};
