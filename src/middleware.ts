import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user = null;
  try {
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch (err) {
    console.error("middleware auth check failed:", err);
    user = null;
    // Session cookie is corrupted/invalidated (e.g. after a password reset) — clear it.
    request.cookies.getAll().forEach((c) => {
      if (c.name.startsWith("sb-")) response.cookies.delete(c.name);
    });
  }

  const path = request.nextUrl.pathname;
  const isPublicAdminPage =
    path === "/admin/login" || path === "/admin/forgot-password" || path === "/admin/reset-password";
  const isAdminArea = path.startsWith("/admin");

  if (isAdminArea && !isPublicAdminPage && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    const redirectResponse = NextResponse.redirect(url);
    redirectResponse.headers.set("Cache-Control", "no-store, must-revalidate");
    return redirectResponse;
  }

  if (path === "/admin/login" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    const redirectResponse = NextResponse.redirect(url);
    redirectResponse.headers.set("Cache-Control", "no-store, must-revalidate");
    return redirectResponse;
  }

  response.headers.set("Cache-Control", "no-store, must-revalidate");
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
