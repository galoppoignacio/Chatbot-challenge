"use client";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Te enviamos un correo para restablecer tu contraseña.");
    } catch (e) {
      const error = e as { message?: string };
      console.error("Error al enviar mail:", error.message);
      setMessage("No pudimos enviar el correo.");
    }
  };

  return (
    <div className="container">
      <form className="card" onSubmit={handleReset}>
        <h2 className="text-center mb-4">Restablecer contraseña</h2>

        <input
          type="email"
          placeholder="Tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
        />

        <button type="submit" className="button">
          Enviar correo de recuperación
        </button>

        {message && <p className="mt-2 text-center">{message}</p>}
      </form>
    </div>
  );
}
