"use client";

import { useMemo, useState } from "react";
import type { Task } from "@/lib/store";

export function TaskBoard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCount = useMemo(
    () => tasks.filter((t) => t.status === "open").length,
    [tasks],
  );

  async function addTask(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, owner }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to create task");
      }
      const { task } = (await res.json()) as { task: Task };
      setTasks((prev) => [task, ...prev]);
      setTitle("");
      setOwner("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  async function toggle(id: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === "open" ? "done" : "open" } : t,
      ),
    );
    const res = await fetch(`/api/tasks/${id}`, { method: "PATCH" });
    if (!res.ok) {
      // Revert on failure.
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, status: t.status === "open" ? "done" : "open" }
            : t,
        ),
      );
    }
  }

  async function remove(id: string) {
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) setTasks(previous);
  }

  return (
    <section className="space-y-6">
      <form
        onSubmit={addTask}
        className="rounded-2xl border border-border bg-card p-5 shadow-sm"
      >
        <label className="mb-2 block text-sm font-medium">Add a task</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            aria-label="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to happen?"
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            aria-label="Owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="Owner"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent sm:w-36"
          />
          <button
            type="submit"
            disabled={pending || !title.trim()}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Adding…" : "Add"}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </form>

      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Tasks
        </h2>
        <span className="text-sm text-muted">{openCount} open</span>
      </div>

      <ul className="space-y-2">
        {tasks.length === 0 && (
          <li className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted">
            No tasks yet. Add your first one above.
          </li>
        )}
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <input
              type="checkbox"
              aria-label={`Mark ${task.title} as done`}
              checked={task.status === "done"}
              onChange={() => toggle(task.id)}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            <div className="min-w-0 flex-1">
              <p
                className={`truncate text-sm font-medium ${
                  task.status === "done" ? "text-muted line-through" : ""
                }`}
              >
                {task.title}
              </p>
              <p className="text-xs text-muted">{task.owner}</p>
            </div>
            <button
              onClick={() => remove(task.id)}
              aria-label={`Delete ${task.title}`}
              className="rounded-md px-2 py-1 text-xs text-muted transition hover:bg-border/60 hover:text-foreground"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
