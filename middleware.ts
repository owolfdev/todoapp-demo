import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const origin = req.headers.get("origin");
  console.log("origin:", origin);
  // console.log("req:", req);

  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Max-Age", "86400");

  console.log("middleware!");
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
