import type { NextRequest } from "next/server";

const backendOrigin = process.env.BACKEND_URL ?? "http://localhost:8000";

// The SSE stream must reach the browser as it is produced. Buffering it here
// would hold every stage change until the run ended, turning live progress into
// a single delivery at the finish line.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";

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
  for (const name of [
    "content-type",
    "cookie",
    "x-correlation-id",
    "idempotency-key",
    // Forwarded so an EventSource reconnect resumes instead of replaying.
    "last-event-id",
    "accept",
  ]) {
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
    // Abort the upstream request when the browser navigates away, so a closed
    // tab does not leave a stream open on the API for its whole duration.
    signal: request.signal,
  });

  const responseHeaders = new Headers();
  for (const name of [
    "content-type",
    "x-correlation-id",
    "cache-control",
    "x-accel-buffering",
  ]) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }
  for (const cookie of upstream.headers.getSetCookie()) {
    responseHeaders.append("set-cookie", rewriteCookiePath(cookie));
  }

  // `upstream.body` is passed through as a stream and never awaited into a
  // buffer, which is what keeps server-sent events flowing chunk by chunk.
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
