'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from "next/navigation";
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

import { Download } from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import styles from "./ChatWidget.module.scss";
import { useMobileOverlay } from "@/context/MobileOverlayContext";

import { ToolResultRenderer } from "./ToolResultRender";
import { PhotoGallery } from './PhotoGallery';
import { stripMediaUrls } from '@/utils/stripMediaUrls';

const HIDDEN_PATHS = ["/login", "/register", "/signup"];

const chatFetch: typeof fetch = async (input, init) => {
  const response = await fetch(input, init);

  if (response.status === 403) {
    // clone() supaya body masih bisa dibaca tanpa "menghabiskan" stream asli
    const body = await response.clone().json().catch(() => null);

    if (body?.reason === "quota_exceeded_anon") {
      throw new Error("QUOTA_EXCEEDED_ANON");
    }
    if (body?.reason === "quota_exceeded_user") {
      throw new Error("QUOTA_EXCEEDED_USER");
    }
  }

  return response;
};

export default function ChatWidget() {
  const { isChatOpen, setIsChatOpen } = useMobileOverlay();
 
  const pathname = usePathname();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [showError, setShowError] = useState(false);

  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({ 
      api: "/api/chat", 
      fetch: chatFetch
    }),
  });

  const isQuotaExceededAnon = error?.message === "QUOTA_EXCEEDED_ANON";
  const isQuotaExceededUser = error?.message === "QUOTA_EXCEEDED_USER";

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (error) setShowError(true);
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (error) {
      setMessages((msgs) => {
        const lasIdx = msgs.length - 1;
        if (lasIdx >= 0 && msgs[lasIdx].role === "user") {
          return msgs.slice(0, lasIdx);
        }
        return msgs;
      });
    }

    setShowError(false);
    sendMessage({ text: input });
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isHiddenPath = HIDDEN_PATHS.some((path) => pathname?.startsWith(path));

  if (isHiddenPath) return null;

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

            {showError && error && (
              <div className={styles.bubbleAssistant}>
                {isQuotaExceededAnon ? (
                  <>
                    <div className={styles.quotaText}>
                      Kamu sudah mencapai batas penggunaan chatbot hari ini. Silakan
                      login untuk melanjutkan chat.
                    </div>
                    <a href="/login" className={styles.loginBtn}>
                      Login
                    </a>
                  </>
                ) : isQuotaExceededUser ? (
                  <div className={styles.quotaText}>
                    Kuota harian akun kamu sudah habis. Silakan coba lagi besok.
                  </div>
                ) : (
                  <div className={styles.errorText}>
                    Terjadi kesalahan pada sistem AI.
                  </div>
                )}
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

function handleDownloadButton(result: any) {
  window.open(`${result.downloadUrl}`, "_blank");
}
/* ---------- Message Bubble — v5 menggunakan message.parts, bukan message.content ---------- */

function MessageBubble({ message }: { message: any }) {
  const isUser = message.role === "user";
  const parts = dedupeToolParts(message.parts ?? []);

  return (
    <div className={isUser ? styles.bubbleUser : styles.bubbleAssistant}>
      {parts?.map((part: any, idx: number) => {
        // Bagian teks biasa
        if (part.type === "text") {
          const cleanText = stripMediaUrls(part.text);
          if(!cleanText) return null;
          return (
            <div key={idx} className={styles.markdown}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {cleanText}
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
              <button
                key={idx}
                onClick={() => handleDownloadButton(result)}
                className={styles.downloadBtn}
              >
                <Download />
                {result.label ?? "Download Laporan"}
              </button>
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

          if (result?.imageUrl) {
            return <PhotoGallery nama={result.nama} imageUrl={result.imageUrl} />;
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

function dedupeToolParts(parts: any[]): any[] {
  const seen = new Set<string>();
  const result: any[] = [];

  for (const part of parts) {
    const isToolPart =
      part.type?.startsWith("tool-") && part.state === "output-available";

    if (!isToolPart) {
      result.push(part);
      continue;
    }

    const fingerprint = `${part.type}:${JSON.stringify(part.input)}`;

    if (seen.has(fingerprint)) {
      continue;
    }

    seen.add(fingerprint);
    result.push(part);
  }

  return result;
}