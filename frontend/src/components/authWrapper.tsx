"use client";
import { useAuthListener } from "@/Hooks/useAuthListener";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  useAuthListener();
  return <>{children}</>;
}