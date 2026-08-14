import type { NextRequest } from "next/server";

const backendOrigin = process.env.BACKEND_URL ?? "http://localhost:8000";

type ProxyContext = {
  params: Promise<{ path: string[] }>;
};

function rewriteCookiePath(cookie: string): string {
  return cookie.replace(/Path=\/v1\/auth(?=;|$)/i, "Path=/api/backend/v1/auth");
}

async function proxy(request: NextRequest, context: ProxyContext) {
  const { path } = await context.params;
  const target = new URL(path.join("/"), `${backendOrigin.replace(/\/$/, "")}/`);
  target.search = request.nextUrl.search;

  const headers = new Headers();
  for (const name of ["content-type", "cookie", "x-correlation-id"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const upstream = await fetch(target, {
    method: request.method,
    headers,
    body:
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.arrayBuffer(),
    cache: "no-store",
    redirect: "manual",
  });

  const responseHeaders = new Headers();
  for (const name of ["content-type", "x-correlation-id"]) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }
  for (const cookie of upstream.headers.getSetCookie()) {
    responseHeaders.append("set-cookie", rewriteCookiePath(cookie));
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;

