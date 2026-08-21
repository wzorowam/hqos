export type TaskStatus = "open" | "done";

export type Task = {
  id: string;
  title: string;
  owner: string;
  status: TaskStatus;
  createdAt: string;
};

type TaskStore = {
  tasks: Task[];
  seq: number;
};

// A module-level singleton keeps demo data alive across requests within a
// running server process. The global cache guard prevents the store from being
// reset when the module is re-evaluated during development hot reloads.
const globalForStore = globalThis as unknown as { __hqosStore?: TaskStore };

function seed(): TaskStore {
  const now = Date.now();
  const base: Array<Omit<Task, "id" | "createdAt">> = [
    { title: "Publish Q3 board update", owner: "Ca", status: "open" },
    { title: "Review vendor security questionnaire", owner: "Ops", status: "open" },
    { title: "Finalize onboarding checklist", owner: "People", status: "done" },
  ];

  return {
    seq: base.length,
    tasks: base.map((task, index) => ({
      ...task,
      id: `t${index + 1}`,
      createdAt: new Date(now - (base.length - index) * 60_000).toISOString(),
    })),
  };
}

function getStore(): TaskStore {
  if (!globalForStore.__hqosStore) {
    globalForStore.__hqosStore = seed();
  }
  return globalForStore.__hqosStore;
}

export function listTasks(): Task[] {
  return [...getStore().tasks].sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0,
  );
}

export function createTask(input: { title: string; owner?: string }): Task {
  const store = getStore();
  store.seq += 1;
  const task: Task = {
    id: `t${store.seq}`,
    title: input.title.trim(),
    owner: (input.owner ?? "Unassigned").trim() || "Unassigned",
    status: "open",
    createdAt: new Date().toISOString(),
  };
  store.tasks.push(task);
  return task;
}

export function toggleTask(id: string): Task | null {
  const task = getStore().tasks.find((t) => t.id === id);
  if (!task) return null;
  task.status = task.status === "open" ? "done" : "open";
  return task;
}

export function deleteTask(id: string): boolean {
  const store = getStore();
  const before = store.tasks.length;
  store.tasks = store.tasks.filter((t) => t.id !== id);
  return store.tasks.length < before;
}
