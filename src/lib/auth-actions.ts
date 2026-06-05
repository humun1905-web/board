"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BOARD_PASSWORD = "1!";
const COOKIE_NAME = "board_auth";

export async function loginAction(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error: string }> {
  const password = formData.get("password") as string;

  if (password !== BOARD_PASSWORD) {
    return { error: "비밀번호가 올바르지 않습니다." };
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "authenticated", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // 브라우저 세션이 끝나면 만료 (탭 닫으면 로그아웃)
  });

  const from = formData.get("from") as string | null;
  redirect(from && from.startsWith("/") ? from : "/");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/login");
}
