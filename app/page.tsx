"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isReady = status === "ready";

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col px-4 py-6">
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto pb-4">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">
            Envie uma mensagem para começar.
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 whitespace-pre-wrap ${
                  message.role === "user"
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                }`}
              >
                {message.parts.map((part, index) =>
                  part.type === "text" ? (
                    <span key={`${message.id}-${index}`}>{part.text}</span>
                  ) : null,
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <form
        className="border-t border-zinc-200 pt-4 dark:border-zinc-800"
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim() || !isReady) return;
          sendMessage({ text: input });
          setInput("");
        }}
      >
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 outline-none focus:border-zinc-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!isReady}
            placeholder="Digite sua mensagem..."
          />
          <button
            type="submit"
            disabled={!isReady || !input.trim()}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
