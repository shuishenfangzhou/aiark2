"use client";

import { TASK_DEFINITIONS, getTaskLabel } from "@/data/task-definitions";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TaskFilterProps {
  selectedTask: string;
  onTaskChange: (task: string) => void;
}

export function TaskFilter({ selectedTask, onTaskChange }: TaskFilterProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">任务场景</label>
      <div className="flex flex-wrap gap-1.5">
        <Badge
          variant={selectedTask === "all" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onTaskChange("all")}
        >
          全部任务
        </Badge>
        {TASK_DEFINITIONS.map((task) => (
          <Badge
            key={task.value}
            variant={selectedTask === task.value ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onTaskChange(selectedTask === task.value ? "all" : task.value)}
          >
            {task.icon} {task.label}
          </Badge>
        ))}
      </div>
      {selectedTask !== "all" && (
        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
          <span>当前任务：{getTaskLabel(selectedTask)}</span>
          <X
            className="h-3.5 w-3.5 cursor-pointer hover:text-blue-800"
            onClick={() => onTaskChange("all")}
          />
        </div>
      )}
    </div>
  );
}
