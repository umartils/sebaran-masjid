'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

import { Download } from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import styles from "./ChatWidget.module.scss";
import { ToolResultRenderer } from "./ToolResultRender";
import { useMobileOverlay } from "@/context/MobileOverlayContext";

const HIDDEN_PATHS = ["/login", "/register", "/signup"];

export default function ChatWidget() {
  const { isChatOpen, setIsChatOpen } = useMobileOverlay();

  const pathname = usePathname();
  const { status: authStatus } = useSession(); // 'loading' | 'authenticated' | 'unauthenticated'

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // v5: useChat tidak lagi mengelola state input maupun parameter `api` langsung —
  // konfigurasi endpoint sekarang lewat transport object.
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isHiddenPath = HIDDEN_PATHS.some((path) => pathname?.startsWith(path));
  const isLoggedIn = authStatus === "authenticated";

  if (isHiddenPath || !isLoggedIn) return null;

  return (
    <>
      {/* Floating Action Button */}
      {!isChatOpen && (
        <button
          className={styles.fab}
          onClick={() => setIsChatOpen(true)}
          aria-label="Buka chat asisten Se-IMaN"
        >
          <ChatIcon />
        </button>
      )}

      {/* Chat Window */}
      {isChatOpen && (
        <div className={styles.chatWindow}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerTitle}>
              <span className={styles.headerDot} />
              Asisten Se-IMaN
            </div>
            <button
              className={styles.closeBtn}
              onClick={() => setIsChatOpen(false)}
              aria-label="Tutup chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className={styles.messages}>
            {messages.length === 0 && (
              <div className={styles.emptyState}>
                Halo! Saya bisa bantu cari info masjid terdaftar, progress
                pembangunan, atau laporan PDF. Coba tanya sesuatu!
              </div>
            )}

            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}

            {isLoading && (
              <div className={styles.typingIndicator}>
                <span />
                <span />
                <span />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className={styles.inputForm}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya tentang masjid..."
              className={styles.input}
              disabled={isLoading}
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={isLoading || !input.trim()}
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

/* ---------- Message Bubble — v5 menggunakan message.parts, bukan message.content ---------- */

function MessageBubble({ message }: { message: any }) {
  const isUser = message.role === "user";

  return (
    <div className={isUser ? styles.bubbleUser : styles.bubbleAssistant}>
      {message.parts?.map((part: any, idx: number) => {
        // Bagian teks biasa
        if (part.type === "text") {
          return (
            <div key={idx} className={styles.markdown}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {part.text}
              </ReactMarkdown>
            </div>
          );
        }

        // Bagian tool call — di v5 bertipe `tool-${toolName}`, hasil tersedia saat state 'output-available'
        if (
          part.type?.startsWith("tool-") &&
          part.state === "output-available"
        ) {
          const result = part.output;

          if (result?.downloadUrl) {
            return (
              <a
                key={idx}
                href={result.downloadUrl}
                download
                className={styles.downloadBtn}
              >
                <Download />
                {result.label ?? "Download Laporan"}
              </a>
            );
          }

          if (result?.logs) {
            return (
              <div key={idx} className={styles.progresList}>
                {result.logs.map((log: any, i: number) => (
                  <div key={i} className={styles.progresItem}>
                    <span className={styles.progresPercent}>
                      {log.persentase ?? "-"}%
                    </span>
                    <span>{log.progres ?? "Tidak ada catatan"}</span>
                  </div>
                ))}
              </div>
            );
          }
          return <ToolResultRenderer key={idx} result={result} />;
        }

        return null;
      })}
    </div>
  );
}

/* ---------- Icons ---------- */

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}