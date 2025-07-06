// src/app/login/page.tsx
"use client";
import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import "@/styles/globals.css";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user) router.replace("/chat");
    else setChecking(false);
  }, [user, router]);

  if (checking) return null;

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Completá todos los campos");
      return;
    }
    setErrorMsg("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/chat");
    } catch (e) {
      const error = e as { code?: string; message?: string };
      if (error.code === "auth/wrong-password")
        setErrorMsg("Contraseña incorrecta");
      else if (error.code === "auth/user-not-found")
        setErrorMsg("No se encontró el usuario");
      else setErrorMsg(error.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={login} className="card">
        <h1 className="text-center mb-4">Iniciar Sesión</h1>
        {errorMsg && (
          <p className="text-center" style={{ color: "crimson" }}>
            {errorMsg}
          </p>
        )}
        <input
          className="input-field"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="input-field"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />
        <button type="submit" className="button" disabled={loading}>
          {loading ? "Cargando..." : "Entrar"}
        </button>
        <p className="text-center mt-2">
          <a href="/reset-password" className="link">¿Olvidaste tu contraseña?</a>
        </p>
        <p className="mt-2 text-center">
          ¿No tenés cuenta?{" "}
          <a href="/register" className="link">
            Registrate
          </a>
        </p>
      </form>
    </div>
  );
}