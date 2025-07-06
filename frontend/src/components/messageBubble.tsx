// components/MessageBubble.tsx
import React from 'react';

type Props = { text: string; email: string; isUser: boolean };

export default function MessageBubble({ text, email, isUser }: Props) {
  return (
    <div className={`message-bubble ${isUser ? "user" : "bot"}`}>
      <div style={{ fontSize: "0.75rem", opacity: 0.6, marginBottom: "0.25rem" }}>
        {email}
      </div>
      <div>{text}</div>
    </div>
  );
}
