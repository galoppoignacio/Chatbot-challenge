import "@/styles/globals.css";
import { cookies } from "next/headers";
import ThemeToggle from "@/components/themeToggle";
import AuthWrapper from "@/components/authWrapper";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;
  const htmlClass = themeCookie === "dark" ? "dark" : "";

  return (
    <html lang="en" className={htmlClass}>
      <body>
        <AuthWrapper>
          <ThemeToggle />
          {children}
        </AuthWrapper>
      </body>
    </html>
  );
}
