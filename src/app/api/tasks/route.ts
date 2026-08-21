import { createTask, listTasks } from "@/lib/store";

export async function GET() {
  return Response.json({ tasks: listTasks() });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { title, owner } = (body ?? {}) as { title?: unknown; owner?: unknown };

  if (typeof title !== "string" || title.trim().length === 0) {
    return Response.json({ error: "A non-empty 'title' is required" }, { status: 400 });
  }

  const task = createTask({
    title,
    owner: typeof owner === "string" ? owner : undefined,
  });

  return Response.json({ task }, { status: 201 });
}
