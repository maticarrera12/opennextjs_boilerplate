import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
});
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={outfit.className}>{children}</body>
    </html>
  );
}
