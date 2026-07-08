"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { task } from "@/lib/types";
import { getTodoById, updateTodo, deleteTodo, getAllGroups } from "@/lib/todo-service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { InputGroupInput } from "@/components/ui/input-group";
import { taskGroup } from "@/lib/types";

export default function TaskDetailClient() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [task, setTask] = useState<task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [groups, setGroups] = useState<taskGroup[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    completed: false,
    groupId: "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch task details
  useEffect(() => {
    const fetchTask = async () => {
      if (!params.id) return;
      
      try {
        setLoading(true);
        const [taskData, groupData] = await Promise.all([
          getTodoById(params.id as string, session?.accessToken),
          getAllGroups(session?.accessToken),
        ]);
        setTask(taskData);
        setGroups(groupData);
        setFormData({
          title: taskData.title || "",
          description: taskData.description || "",
          priority: taskData.priority || "medium",
          dueDate: taskData.dueDate || "",
          completed: taskData.completed || false,
          groupId: taskData.groupId || "",
        });
      } catch (err) {
        console.error("Error fetching task:", err);
        setError("Failed to load task");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchTask();
    }
  }, [params.id, status, session?.accessToken]);

  const handleUpdateTask = async () => {
    if (!task || !formData.title.trim()) return;

    try {
      setLoading(true);
      const updatedTask = await updateTodo(task.id, {
        ...formData,
        groupId: formData.groupId || null,
      }, session?.accessToken);
      setTask(updatedTask);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!task) return;

    try {
      setLoading(true);
      await deleteTodo(task.id, session?.accessToken);
      router.push("/task");
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task");
    } finally {
      setLoading(false);
      setIsDeleting(false);
    }
  };

  const toggleCompleted = async () => {
    if (!task) return;
    
    try {
      const updatedTask = await updateTodo(task.id, {
        completed: !task.completed,
      }, session?.accessToken);
      setTask(updatedTask);
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <div>Loading task...</div>
      </div>
    );
  }

  if (!task || !task.id) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <div className="text-red-500">Task not found</div>
        <Button onClick={() => router.push("/task")} className="mt-4">
          Back to Tasks
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Task Details</h1>
          <Button
            variant="ghost"
            onClick={() => router.push("/task")}
          >
            ← Back to Tasks
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}

        {/* Task Card */}
        <Card className="p-6 space-y-4">
          {/* Title and Completion */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className={`text-2xl font-semibold ${task.completed ? "line-through text-gray-500" : ""}`}>
                {task.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={toggleCompleted}
              className={`px-4 py-2 rounded-md font-medium transition ${
                task.completed
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {task.completed ? "✓ Completed" : "Mark Complete"}
            </button>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Description
            </h3>
            <p className="text-gray-600">{task.description || "No description"}</p>
          </div>

          {/* Priority and Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Priority
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  task.priority === "high"
                    ? "bg-red-100 text-red-700"
                    : task.priority === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {task.priority ? (task.priority.charAt(0).toUpperCase() + task.priority.slice(1)) : 'Medium'}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Due Date
              </h3>
              <p className="text-gray-600">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "No due date"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Group
            </h3>
            <p className="text-gray-600">{task.group?.name || "Ungrouped"}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={() => setIsEditing(true)} variant="default">
              Edit Task
            </Button>
            <Button
              onClick={() => setIsDeleting(true)}
              variant="destructive"
              className="text-white"
            >
              Delete Task
            </Button>
          </div>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium">Title</label>
              <InputGroupInput
                placeholder="Task title..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                placeholder="Task description..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2 text-sm"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-sm font-medium">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="w-full border rounded-md px-2 py-2 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  className="w-full border rounded-md px-2 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Group</label>
              <select
                value={formData.groupId}
                onChange={(e) =>
                  setFormData({ ...formData, groupId: e.target.value })
                }
                className="w-full border rounded-md px-2 py-2 text-sm"
              >
                <option value="">No group</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateTask} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The task "{task.title}" will be
              permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction
            onClick={handleDeleteTask}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
