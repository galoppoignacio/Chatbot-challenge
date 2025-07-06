// src/app/chat/page.tsx
"use client";
import { useEffect, useState, useRef } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, where, Timestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import MessageBubble from "@/components/messageBubble";

type Message = {
  id: string;
  text: string;
  chatId: string;
  user: { uid: string; email: string };
  timestamp: Timestamp;
};


export default function ChatPage() {
  const { user, logOut } = useAuthStore();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user) router.replace("/login");
    else setCheckingAuth(false);
  }, [user, router]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "messages"),
      where("chatId", "==", user.uid),
      orderBy("timestamp")
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Message, "id">) })));
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    return () => unsub();
  }, [user]);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;
    const prompt = message.trim();
    setMessage("");

    await addDoc(collection(db, "messages"), {
      text: prompt,
      chatId: user.uid,
      user: { uid: user.uid, email: user.email },
      timestamp: serverTimestamp(),
    });

    const token = await auth.currentUser?.getIdToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt }),
    });
    const { reply } = await res.json();

    await addDoc(collection(db, "messages"), {
      text: reply || "No pude responder esta vez 😅",
      user: { uid: "bot", email: "Bot 🤖" },
      chatId: user.uid,
      timestamp: serverTimestamp(),
    });
  };

  if (checkingAuth) {
    return (
      <div style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <p>Cargando chat...</p>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <header className="header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
          <button
        className="button"
        style={{ width: "auto", minWidth: "unset", maxWidth: "unset", padding: "0.5rem 1rem" }}
        onClick={async () => {
          await logOut();
          router.replace("/login");
        }}
          >
        Logout
          </button>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <button
        className="button"
        style={{ width: "auto", minWidth: "unset", maxWidth: "unset", padding: "0.5rem 1rem" }}
        onClick={() => router.replace("/")}
          >
        Inicio
          </button>
        </div>
        <div style={{ flex: 1 }} />
      </header>

      <main className="main-content">
        {messages.length === 0 && (
          <p style={{ textAlign: "center", color: "rgba(0,0,0,0.4)" }}>
            Aún no hay mensajes.
          </p>
        )}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            text={msg.text}
            email={msg.user.email}
            isUser={msg.user.uid === user?.uid}
          />
        ))}
        <div ref={bottomRef} />
      </main>

      <footer className="footer">
        <form className="chat-form" onSubmit={sendMessage}>
          <input
            className="chat-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribí un mensaje…"
          />
          <button className="send-button" type="submit">
            Enviar
          </button>
        </form>
      </footer>
    </div>
  );
}
