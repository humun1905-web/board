import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "board_auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  const auth = request.cookies.get(COOKIE_NAME);
  if (!auth || auth.value !== "authenticated") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
