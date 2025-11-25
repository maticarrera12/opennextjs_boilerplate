"use client";

import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client"; // Ajusta la ruta a tu cliente

export function StopImpersonatingBanner() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const isImpersonating = session?.session?.impersonatedBy;

  if (!isImpersonating) return null;

  const handleStopImpersonating = async () => {
    const { data, error } = await authClient.admin.stopImpersonating();

    if (error) {
      console.error("Error al dejar de impersonar:", error.message);
    }

    router.push("/dashboard");
    router.refresh();
  };
  return (
    <div className="bg-amber-500 text-black px-4 py-2 flex items-center justify-between text-sm font-medium fixed bottom-0 w-full z-[100]">
      <div className="flex gap-2">
        <span>
          👀 Estás viendo la cuenta de: <b>{session?.user.email}</b>
        </span>
      </div>

      <button
        onClick={handleStopImpersonating}
        className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors text-xs uppercase tracking-wide font-bold"
      >
        Stop Impersonating
      </button>
    </div>
  );
}
