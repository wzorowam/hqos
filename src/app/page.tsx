import { listTasks } from "@/lib/store";
import { TaskBoard } from "@/components/task-board";

export default function Home() {
  const initialTasks = listTasks();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <header className="mb-10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-lg font-bold text-white">
            HQ
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">HQ OS</h1>
            <p className="text-sm text-muted">
              The operating system for your headquarters.
            </p>
          </div>
        </div>
      </header>

      <TaskBoard initialTasks={initialTasks} />

      <footer className="mt-12 border-t border-border pt-6 text-xs text-muted">
        Health check available at{" "}
        <code className="rounded bg-border/50 px-1.5 py-0.5 font-mono">
          /api/health
        </code>
      </footer>
    </main>
  );
}
