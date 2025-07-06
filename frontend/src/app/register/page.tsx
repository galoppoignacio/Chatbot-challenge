// src/app/register/page.tsx
"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import "@/styles/globals.css";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/chat");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="container">
      <form onSubmit={register} className="card">
        <h1 className="text-center mb-4">Registrarse</h1>
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
        <button type="submit" className="button">
          Crear cuenta
        </button>
        <p className="mt-2 text-center">
          ¿Ya tenés cuenta?{" "}
          <a href="/login" className="link">
            Iniciar sesión
          </a>
        </p>
      </form>
    </div>
  );
}
