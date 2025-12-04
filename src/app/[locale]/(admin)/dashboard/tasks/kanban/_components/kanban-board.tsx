"use client";

import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { FilterHorizontalIcon, PlusSignIcon } from "hugeicons-react";
import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

import KanbanCard from "./kanban-card";
import KanbanColumn from "./kanban-column";
import { TaskModal } from "./task-modal";
import { Column, Task } from "./types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTaskModal } from "@/hooks/use-task-modal";
import { updateTaskStatus } from "@/lib/actions/task-actions";

const initialColumns: Column[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "completed", title: "Completed" },
];

interface KanbanBoardProps {
  initialTasks: Task[];
}

export default function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  // Use local state for optimistic updates, but sync with props when they change (revalidation)
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const { onOpen } = useTaskModal();

  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Filtered tasks based on active tab
  const filteredTasks = useMemo(() => {
    if (activeTab === "all") return tasks;
    return tasks.filter((t) => t.status === activeTab);
  }, [tasks, activeTab]);

  // We need to pass all tasks to columns so they can manage their own state,
  // but if we are in a specific tab, we might only want to show one column or filter tasks within columns?
  // Usually in Kanban, "Tabs" might filter by Assignee or Priority, but if it filters by Status, it effectively hides columns.
  // The design shows "All Tasks", "To do", "In Progress", "Completed". This implies showing only that column or all columns.

  const visibleColumns = useMemo(() => {
    if (activeTab === "all") return initialColumns;
    return initialColumns.filter((c) => c.id === activeTab);
  }, [activeTab]);

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    // Dropping a Task over another Task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          const newTasks = [...tasks];
          newTasks[activeIndex].status = tasks[overIndex].status;
          return arrayMove(newTasks, activeIndex, overIndex);
        }

        if (activeIndex !== overIndex) {
          return arrayMove(tasks, activeIndex, overIndex);
        }

        return tasks;
      });
    }

    const isOverColumn = over.data.current?.type === "Column";

    // Dropping a Task over a Column
    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const newStatus = over.id as Task["status"]; // safe cast if valid

        if (tasks[activeIndex].status !== newStatus) {
          const newTasks = [...tasks];
          newTasks[activeIndex].status = newStatus; // Update status locally
          return arrayMove(newTasks, activeIndex, activeIndex);
        }
        return tasks;
      });
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    let newStatus = "";
    let newOrder = 0;

    // Calculate new state for server update
    if (isActiveTask && isOverTask) {
      // Find the task we dropped over to get its status and order
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) {
        newStatus = overTask.status;
        // In a real app with lexorank, we'd calculate exact order.
        // For now, we just rely on the array index from `tasks` state which was updated in DragOver
        // But DragOver updates are optimistic.
        // Let's just persist the status change for now.
        // If we want to persist order, we need to send the whole list order or calculate new index.
        // Let's simplifiy: Just update Status. Order persistence requires reordering the whole list in DB or using floats.
      }
    } else if (isActiveTask && isOverColumn) {
      newStatus = over.id as string;
    }

    // We still run the local state update in DragEnd to ensure it settles
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          const newTasks = [...tasks];
          newTasks[activeIndex].status = tasks[overIndex].status;
          newStatus = tasks[overIndex].status; // Capture for server call
          return arrayMove(newTasks, activeIndex, overIndex);
        }

        if (activeIndex !== overIndex) {
          return arrayMove(tasks, activeIndex, overIndex);
        }

        return tasks;
      });
    }

    // Call Server Action
    if (newStatus) {
      // Determine the new order. This is complex without re-reading the state *after* the set state.
      // A simple approach: wait for the optimistic update, then send the request?
      // Or just send the status update.
      try {
        await updateTaskStatus(activeId, newStatus, 0); // Order 0 for now, improvement: calculate order
        // toast.success("Moved");
      } catch (e) {
        toast.error("Failed to save move");
        // Revert state?
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <TaskModal />

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <Tabs
          defaultValue="all"
          className="w-full md:w-auto"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all" className="text-xs md:text-sm">
              All Tasks{" "}
              <span className="ml-2 bg-background/50 px-1.5 py-0.5 rounded-full text-[10px]">
                {tasks.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="todo" className="text-xs md:text-sm">
              To do{" "}
              <span className="ml-2 bg-background/50 px-1.5 py-0.5 rounded-full text-[10px]">
                {tasks.filter((t) => t.status === "todo").length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="in-progress" className="text-xs md:text-sm">
              In Progress{" "}
              <span className="ml-2 bg-background/50 px-1.5 py-0.5 rounded-full text-[10px]">
                {tasks.filter((t) => t.status === "in-progress").length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs md:text-sm">
              Completed{" "}
              <span className="ml-2 bg-background/50 px-1.5 py-0.5 rounded-full text-[10px]">
                {tasks.filter((t) => t.status === "completed").length}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" className="gap-2">
            <FilterHorizontalIcon size={16} />
            Filter & Sort
          </Button>
          <Button
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => onOpen("create")}
          >
            <PlusSignIcon size={16} />
            Add New Task
          </Button>
        </div>
      </div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
          {visibleColumns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasks.filter((task) => task.status === column.id)}
            />
          ))}
        </div>

        {mounted &&
          createPortal(
            <DragOverlay>{activeTask && <KanbanCard task={activeTask} />}</DragOverlay>,
            document.body
          )}
      </DndContext>
    </div>
  );
}
