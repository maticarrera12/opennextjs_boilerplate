import { NextResponse } from "next/server";

import { uploadImage } from "@/actions/upload-actions";

/**
 * API route for uploading task images
 * @deprecated Consider using uploadImage server action directly from client components
 * This route is kept for backward compatibility
 */
export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const result = await uploadImage(file, "task");

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ url: result.url });
}
