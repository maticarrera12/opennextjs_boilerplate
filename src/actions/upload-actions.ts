"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth, prisma } from "@/lib/auth";

export type ImageCategory = "avatar" | "task" | "project" | "asset" | "general";

export interface UploadImageResult {
  url: string;
  path: string;
  size: number;
}

export interface UploadImageError {
  error: string;
}

/**
 * Upload an image to Vercel Blob storage
 * @param file - File to upload (as FormData or File)
 * @param category - Category/type of image for organization
 * @returns Object with URL, path, and size, or error object
 */
export async function uploadImage(
  file: File | FormData,
  category: ImageCategory = "general"
): Promise<UploadImageResult | UploadImageError> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    // Extract file from FormData if needed
    let fileToUpload: File;
    if (file instanceof FormData) {
      const extractedFile = file.get("file") as File | null;
      if (!extractedFile) {
        return { error: "No file provided in FormData" };
      }
      fileToUpload = extractedFile;
    } else {
      fileToUpload = file;
    }

    // Validate file type
    if (!fileToUpload.type.startsWith("image/")) {
      return { error: "File must be an image" };
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (fileToUpload.size > maxSize) {
      return { error: "Image must be smaller than 2MB" };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = fileToUpload.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}-${sanitizedName}`;

    // Create organized path based on category
    const path = `${category}s/${session.user.id}/${filename}`;

    // Upload to Vercel Blob
    const blob = await put(path, fileToUpload, {
      access: "public",
      addRandomSuffix: true,
    });

    return {
      url: blob.url,
      path: path,
      size: fileToUpload.size,
    };
  } catch (error) {
    console.error("Failed to upload image:", error);
    const details = error instanceof Error ? error.message : String(error);
    return { error: `Failed to upload image: ${details}` };
  }
}

/**
 * Upload multiple images at once
 * @param files - Array of files to upload
 * @param category - Category/type of images
 * @returns Array of upload results
 */
export async function uploadImages(
  files: File[],
  category: ImageCategory = "general"
): Promise<Array<UploadImageResult | UploadImageError>> {
  const uploadPromises = files.map((file) => uploadImage(file, category));
  return Promise.all(uploadPromises);
}

/**
 * Upload and update user avatar
 * @param file - File to upload (as FormData or File)
 * @returns Object with URL, or error object
 */
export async function uploadUserAvatar(
  file: File | FormData
): Promise<{ url: string } | UploadImageError> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const result = await uploadImage(file, "avatar");

  if ("error" in result) {
    return result;
  }

  try {
    // Update user's avatar in database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: result.url },
    });

    // Revalidate relevant paths
    revalidatePath("/settings/account/profile");
    revalidatePath("/dashboard");

    return { url: result.url };
  } catch (error) {
    console.error("Failed to update user avatar:", error);
    return { error: "Failed to update avatar in database" };
  }
}
