"use client";

import * as React from "react";
import {
    IconCheck,
    IconCopy,
    IconStar,
} from "@tabler/icons-react";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";

import { createTodo } from "@/lib/todo-service";
import { taskGroup } from "@/lib/types";
import { useSession } from "next-auth/react";
import { createGroup } from "@/lib/todo-service";

interface TaskFeildProps {
    onTaskCreated?: () => void;
    groups: taskGroup[];
    onGroupCreated?: (group: taskGroup) => void;
}

export function TaskFeild({ onTaskCreated, groups, onGroupCreated }: TaskFeildProps) {
    const { data: session, status } = useSession();
    const [taskTitle, setTaskTitle] = React.useState("");
    const [copiedText, copyToClipboard] = useCopyToClipboard();
    const [isFavorite, setIsFavorite] = React.useState(false);

    const [popupTaskTitle, setPopupTaskTitle] = React.useState("");
    const [popupTaskDescription, setPopupTaskDescription] = React.useState("");
    const [popupTaskPriority, setPopupTaskPriority] = React.useState("medium");
    const [popupTaskDueDate, setPopupTaskDueDate] = React.useState("");
    const [popupTaskGroupId, setPopupTaskGroupId] = React.useState<string>("");
    const [newGroupName, setNewGroupName] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [groupLoading, setGroupLoading] = React.useState(false);

    const handleCreateGroup = async () => {
        if (!newGroupName.trim()) return;
        const accessToken = session?.accessToken;

        try {
            setGroupLoading(true);
            const group = await createGroup(newGroupName.trim(), accessToken);
            setNewGroupName("");
            setPopupTaskGroupId(group.id);
            onGroupCreated?.(group);
        } catch (error) {
            console.error("Error creating group:", error);
            alert("Failed to create group. Please try again.");
        } finally {
            setGroupLoading(false);
        }
    };

    const handleCreateTask = async () => {
        if (!popupTaskTitle.trim()) return;
        const accessToken = session?.accessToken;

        setLoading(true);

        try {
            const newTodo = {
                title: popupTaskTitle,
                description: popupTaskDescription,
                priority: popupTaskPriority,
                dueDate: popupTaskDueDate,
                groupId: popupTaskGroupId || null,
            };

            console.log({newTodo, accessToken});
            await createTodo(newTodo, accessToken);

            // Reset form
            setPopupTaskTitle("");
            setPopupTaskDescription("");
            setPopupTaskPriority("medium");
            setPopupTaskDueDate("");
            setPopupTaskGroupId("");
            setIsFavorite(false);
            setOpen(false);

            // Optionally copy to clipboard
            await copyToClipboard(popupTaskTitle);

            // Call the refresh function if provided
            if (onTaskCreated) {
                onTaskCreated();
            }
        } catch (error) {
            console.error("Error creating task:", error);
            alert("Failed to create task. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid w-full max-w-sm gap-4">
            <InputGroup>
                <InputGroupInput
                    placeholder="Quick add task..."
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                />

                <InputGroupAddon align="inline-end">
                    <InputGroupButton
                        variant="secondary"
                        onClick={() => setIsFavorite((prev) => !prev)}
                    >
                        <IconStar
                            size={16}
                            className={isFavorite ? "text-yellow-500" : ""}
                        />
                    </InputGroupButton>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <InputGroupButton variant="default">
                                <IconCheck size={16} />
                                <span className="ml-1">Create</span>
                            </InputGroupButton>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Task</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4 py-2">
                                <InputGroupInput
                                    placeholder="Task title..."
                                    value={popupTaskTitle}
                                    onChange={(e) => setPopupTaskTitle(e.target.value)}
                                />

                                <InputGroupInput
                                    placeholder="Task description..."
                                    value={popupTaskDescription}
                                    onChange={(e) => setPopupTaskDescription(e.target.value)}
                                />

                                <div className="flex gap-2">
                                    <select
                                        value={popupTaskPriority}
                                        onChange={(e) => setPopupTaskPriority(e.target.value)}
                                        className="border rounded-md px-2 py-1.5 text-sm"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>

                                    <input
                                        type="date"
                                        value={popupTaskDueDate}
                                        onChange={(e) => setPopupTaskDueDate(e.target.value)}
                                        className="border rounded-md px-2 py-1.5 text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Group</label>
                                    <select
                                        value={popupTaskGroupId}
                                        onChange={(e) => setPopupTaskGroupId(e.target.value)}
                                        className="w-full border rounded-md px-2 py-1.5 text-sm"
                                    >
                                        <option value="">No group</option>
                                        {groups.map((group) => (
                                            <option key={group.id} value={group.id}>
                                                {group.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-2">
                                    <InputGroupInput
                                        placeholder="Create new group..."
                                        value={newGroupName}
                                        onChange={(e) => setNewGroupName(e.target.value)}
                                    />
                                    <button
                                        className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-50"
                                        onClick={handleCreateGroup}
                                        disabled={!newGroupName.trim() || groupLoading}
                                        type="button"
                                    >
                                        {groupLoading ? "Creating..." : "Add Group"}
                                    </button>
                                </div>
                            </div>

                            <DialogFooter>
                                <button
                                    className="px-3 py-1.5 text-sm border rounded-md"
                                    onClick={() => setOpen(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md disabled:opacity-50"
                                    onClick={handleCreateTask}
                                    disabled={!popupTaskTitle.trim() || loading}
                                >
                                    {loading ? "Creating..." : "Add Task"}
                                </button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </InputGroupAddon>
            </InputGroup>

            {copiedText && (
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <IconCopy size={14} />
                    Task copied to clipboard
                </div>
            )}
        </div>
    );
}
