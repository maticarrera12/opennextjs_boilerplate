export type TaskStatus = "todo" | "in-progress" | "completed";

export interface TaskTag {
  label: string;
  color: "blue" | "green" | "orange" | "purple" | "red" | "gray";
}

export interface Task {
  id: string;
  title: string;
  status: string; // Using string to be compatible with Prisma, but ideally TaskStatus
  dueDate?: Date | string | null;
  comments?: number; // Optional for now as DB doesn't track yet
  attachments?: number; // Optional
  assigneeName?: string | null;
  assigneeAvatar?: string | null;
  tags?: any; // JSON from Prisma
  image?: string | null;
  priority?: string | null;
  order?: number;
}

export interface Column {
  id: TaskStatus;
  title: string;
}
