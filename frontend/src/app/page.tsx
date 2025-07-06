// src/app/page.tsx
import "@/styles/globals.css";

export default function HomePage() {
  return (
    <main className="container">
      <div className="card text-center">
        <h1 className="mb-4">
          Bienvenido a <span style={{ color: "var(--user-bg)" }}>Chatbot challenge</span>
        </h1>
        <p className="mb-4">
          Iniciá sesión para comenzar a chatear en tiempo real.
        </p>
        <a href="/login">
          <button className="button">Ir al chat</button>
        </a>
      </div>
    </main>
  );
}
