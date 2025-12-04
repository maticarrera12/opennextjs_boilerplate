"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getColumns() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const columns = await prisma.kanbanColumn.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      order: "asc",
    },
    include: {
      _count: {
        select: { tasks: true },
      },
    },
  });

  return columns;
}

export async function createColumn(data: { title: string; color?: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    // Get the last order to append
    const lastColumn = await prisma.kanbanColumn.findFirst({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        order: "desc",
      },
    });

    const newOrder = lastColumn ? lastColumn.order + 1 : 0;

    const column = await prisma.kanbanColumn.create({
      data: {
        title: data.title,
        color: data.color || null,
        order: newOrder,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/tasks/kanban");
    return { data: column };
  } catch (error) {
    console.error("Failed to create column:", error);
    return { error: "Failed to create column" };
  }
}

export async function updateColumn(columnId: string, data: { title?: string; color?: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    const column = await prisma.kanbanColumn.update({
      where: {
        id: columnId,
        userId: session.user.id, // Ensure ownership
      },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.color !== undefined && { color: data.color }),
      },
    });

    revalidatePath("/dashboard/tasks/kanban");
    return { data: column };
  } catch (error) {
    console.error("Failed to update column:", error);
    return { error: "Failed to update column" };
  }
}

export async function deleteColumn(columnId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    // Check if column has tasks
    const taskCount = await prisma.task.count({
      where: {
        columnId: columnId,
        userId: session.user.id,
      },
    });

    if (taskCount > 0) {
      return { error: "Cannot delete column with tasks. Please move or delete tasks first." };
    }

    await prisma.kanbanColumn.delete({
      where: {
        id: columnId,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/tasks/kanban");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete column:", error);
    return { error: "Failed to delete column" };
  }
}

export async function reorderColumns(columnIds: string[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    // Update order for each column
    await Promise.all(
      columnIds.map((columnId, index) =>
        prisma.kanbanColumn.updateMany({
          where: {
            id: columnId,
            userId: session.user.id,
          },
          data: {
            order: index,
          },
        })
      )
    );

    revalidatePath("/dashboard/tasks/kanban");
    return { success: true };
  } catch (error) {
    console.error("Failed to reorder columns:", error);
    return { error: "Failed to reorder columns" };
  }
}
