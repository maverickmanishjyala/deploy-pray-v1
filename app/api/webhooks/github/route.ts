import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { NextRequest, NextResponse } from "next/server";

const LOG_DIR = join(process.cwd(), "logs");
const LOG_FILE = join(LOG_DIR, "github-webhook.log");

async function logGithubWebhook(payload: {
  method: string;
  url: string;
  event: string | null;
  delivery: string | null;
  headers: Record<string, string>;
  body: string;
}) {
  const stamp = new Date().toISOString();
  const block = `${"=".repeat(72)}\n${stamp} ${payload.method} ${payload.url}\nx-github-event: ${payload.event ?? "(none)"}\nx-github-delivery: ${payload.delivery ?? "(none)"}\nheaders: ${JSON.stringify(payload.headers)}\nbody:\n${payload.body}\n`;

  console.log(`[github-webhook] ${stamp} event=${payload.event ?? "?"} delivery=${payload.delivery ?? "?"}`);

  try {
    await mkdir(LOG_DIR, { recursive: true });
    await appendFile(LOG_FILE, block, "utf8");
  } catch (err) {
    console.error("[github-webhook] failed to append log file:", err);
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  await logGithubWebhook({
    method: request.method,
    url: request.url,
    event: request.headers.get("x-github-event"),
    delivery: request.headers.get("x-github-delivery"),
    headers,
    body: body || "(empty)",
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json(
    { message: "GitHub webhooks: send POST to this URL." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
