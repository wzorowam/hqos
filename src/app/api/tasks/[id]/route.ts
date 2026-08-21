import { deleteTask, toggleTask } from "@/lib/store";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const task = toggleTask(id);
  if (!task) {
    return Response.json({ error: "Task not found" }, { status: 404 });
  }
  return Response.json({ task });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const removed = deleteTask(id);
  if (!removed) {
    return Response.json({ error: "Task not found" }, { status: 404 });
  }
  return Response.json({ ok: true });
}
