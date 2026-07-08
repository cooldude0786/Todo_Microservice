"use client";

import { useState, useEffect, useMemo } from "react";
import { task, taskGroup } from "@/lib/types";
import { DataTable } from "./data-table";
import { ColumnDef } from "@tanstack/react-table";
import { TaskFeild } from "./taskFeild";
import { getAllGroups, getAllTodos } from "@/lib/todo-service";
import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
import Link from "next/link";
import { GlassNavbar } from "@/components/navbar";
import { useSidebar } from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";

const columns: ColumnDef<task>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/task/${row.original.id}`}
        className="text-blue-600 hover:underline font-medium"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "completed",
    header: "Completed",
    cell: ({ row }) => (
      <div>
        {row.original.completed ? "✓ Yes" : "No"}
      </div>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded text-sm font-medium ${
          row.original.priority === "high"
            ? "bg-red-100 text-red-700"
            : row.original.priority === "medium"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-700"
        }`}
      >
        {row.original.priority.charAt(0).toUpperCase() + row.original.priority.slice(1)}
      </span>
    ),
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => {
      const date = row.original.dueDate;
      if (!date) return "-";
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
  {
    accessorKey: "group",
    header: "Group",
    cell: ({ row }) => row.original.group?.name || "Ungrouped",
  },
];

export default function TaskPageClient() {
  const { data: session, status } = useSession();
  const { toggleSidebar } = useSidebar();
  const searchParams = useSearchParams();
  const [todos, setTodos] = useState<task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState<taskGroup[]>([]);
  const selectedCollection = searchParams.get("collection");
  const selectedGroupName = useMemo(() => {
    if (!selectedCollection) return "workspace";
    if (selectedCollection === "general") return "General";

    return groups.find((group) => group.id === selectedCollection)?.name || "this collection";
  }, [groups, selectedCollection]);

  useEffect(() => {
    if (status === "loading") return; // Wait for session to load

    const fetchTodos = async () => {
      try {
        console.log("Fetching todos with session:", session);
        const [todoData, groupData] = await Promise.all([
          getAllTodos(session?.accessToken),
          getAllGroups(session?.accessToken),
        ]);

        setTodos(todoData);
        setGroups(groupData);
      } catch (err) {
        console.error("Error fetching todos:", err);
        setError("Failed to load todos");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [session, status]);

  // Filter todos based on search query
  const collectionTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (!selectedCollection) return true;
      if (selectedCollection === "general") return !todo.groupId;
      return todo.groupId === selectedCollection;
    });
  }, [todos, selectedCollection]);

  const filteredTodos = useMemo(() => {
    if (!searchQuery.trim()) return collectionTodos;

    const query = searchQuery.toLowerCase();
    return collectionTodos.filter(todo =>
      todo.title.toLowerCase().includes(query) ||
      (todo.description && todo.description.toLowerCase().includes(query)) ||
      todo.priority.toLowerCase().includes(query)
    );
  }, [collectionTodos, searchQuery]);

  const scopedTodos = collectionTodos;
  const totalTasks = scopedTodos.length;
  const completedTasks = scopedTodos.filter(todo => todo.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = scopedTodos.filter(todo => todo.priority === "high" && !todo.completed).length;
  const overdueTasks = scopedTodos.filter(todo => {
    if (todo.completed || !todo.dueDate) return false;
    return new Date(todo.dueDate) < new Date();
  }).length;

  // Function to refresh todos after create/update/delete operations
  const refreshTodos = async () => {
    if (!session?.accessToken) return;

    try {
      const data = await getAllTodos(session.accessToken);
      setTodos(data);
    } catch (err) {
      console.error("Error refreshing todos:", err);
      setError("Failed to refresh todos");
    }
  };

  const handleGroupCreated = (group: taskGroup) => {
    setGroups((prev) => [group, ...prev]);
  };

  if (status === "loading") {
    return <div className="w-full h-full flex flex-col items-center p-4 gap-4">
      <div>Loading session...</div>
    </div>;
  }

  if (status === "unauthenticated") {
    return <div className="w-full h-full flex flex-col items-center p-4 gap-4">
      <div>Please log in to view your tasks.</div>
    </div>;
  }

  if (loading) {
    return <div className="w-full h-full flex flex-col items-center p-4 gap-4">
      <GlassNavbar onToggleSidebar={toggleSidebar} onSearch={setSearchQuery} searchQuery={searchQuery} />
      <div className="pt-20">Loading todos...</div>
    </div>;
  }

  if (error) {
    return <div className="w-full h-full flex flex-col items-center p-4 gap-4">
      <GlassNavbar onToggleSidebar={toggleSidebar} onSearch={setSearchQuery} searchQuery={searchQuery} />
      <div className="pt-20 text-red-500">Error: {error}</div>
    </div>;
  }

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <GlassNavbar onToggleSidebar={toggleSidebar} onSearch={setSearchQuery} searchQuery={searchQuery} />

      <div className="px-3 pt-4 sm:px-4 sm:pt-6 md:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-2 mb-4 sm:gap-3 sm:mb-6 md:gap-4 xl:grid-cols-4">
              <Card className="glass-card">
                <CardHeader className="p-3 sm:p-6">
                  <CardTitle>Total tasks</CardTitle>
                  <CardDescription>
                    {selectedCollection
                      ? `Tasks in ${selectedGroupName}`
                      : "All tasks in your workspace"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                  <div className="text-2xl font-semibold text-slate-900 sm:text-3xl">{totalTasks}</div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="p-3 sm:p-6">
                  <CardTitle>Completed</CardTitle>
                  <CardDescription>
                    {selectedCollection
                      ? `Completed in ${selectedGroupName}`
                      : "Tasks finished successfully"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                  <div className="text-2xl font-semibold text-slate-900 sm:text-3xl">{completedTasks}</div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="p-3 sm:p-6">
                  <CardTitle>Pending</CardTitle>
                  <CardDescription>
                    {selectedCollection
                      ? `Waiting in ${selectedGroupName}`
                      : "Tasks waiting to be completed"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                  <div className="text-2xl font-semibold text-slate-900 sm:text-3xl">{pendingTasks}</div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="p-3 sm:p-6">
                  <CardTitle>High priority</CardTitle>
                  <CardDescription>
                    {selectedCollection
                      ? `Urgent tasks in ${selectedGroupName}`
                      : "Urgent tasks that need attention"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                  <div className="text-2xl font-semibold text-slate-900 sm:text-3xl">{highPriorityTasks}</div>
                  <div className="mt-1 text-xs text-gray-500 sm:mt-2 sm:text-sm">Overdue: {overdueTasks}</div>
                </CardContent>
            </Card>
          </div>

          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <TaskFeild onTaskCreated={refreshTodos} groups={groups} onGroupCreated={handleGroupCreated} />

            {filteredTodos.length === 0 && searchQuery ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm sm:text-base">
                  No tasks found
                  {selectedCollection === "general"
                    ? " in General"
                    : selectedCollection
                    ? " in this collection"
                    : ""}
                  matching {searchQuery}
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-blue-600 hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={{ todos: filteredTodos, count: filteredTodos.length }}
              />
            )}

            {filteredTodos.length > 0 && (
                <div className="text-sm text-gray-500">
                  Showing {filteredTodos.length} of {scopedTodos.length} tasks
                {selectedCollection ? ` in ${selectedGroupName}` : ""}
                {searchQuery && ` for "${searchQuery}"`}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
