import { useEffect, useRef, useState, type FormEvent } from "react";
import styles from "@/styles/ChatBox.module.css";
import { apiRequest } from "@/utils/api";
import { useTranslation } from "@/utils/i18n";

type ChatMessage = {
  from: "customer" | "assistant";
  text: string;
};

export default function ChatBox() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Until the first question, the greeting follows the page language; afterwards the conversation is kept as it is
  const shown: ChatMessage[] =
    messages.length === 0 ? [{ from: "assistant", text: t.chat.greeting }] : messages;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isOpen]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || isSending) {
      return;
    }

    // The earlier turns (before this question), in the shape the backend expects.
    // The server accepts at most 10 turns of 2000 characters, so we trim to that here.
    const history = shown.slice(-10).map((message) => ({
      role: message.from === "customer" ? "user" : "assistant",
      content: message.text.slice(0, 2000),
    }));

    setMessages([...shown, { from: "customer", text }]);
    setDraft("");
    setIsSending(true);

    const data = await apiRequest<{ answer: string }>("/assistant", "POST", { message: text, history });

    let reply = t.chat.unavailable;
    if (data === null) {
      reply = t.networkError;
    } else if (data.result) {
      // Safety net: the prompt asks for plain text, but the model sometimes still writes *italics* or **bold**
      reply = data.answer.replace(/\*+/g, "");
    }

    setMessages((current) => [...current, { from: "assistant", text: reply }]);
    setIsSending(false);
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        className={styles.launcher}
        onClick={() => setIsOpen(true)}
        aria-label={t.chat.open}
        title={t.chat.launcher}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z" />
          <path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z" />
        </svg>
      </button>
    );
  }

  return (
    <section className={styles.panel} aria-label={t.chat.label}>
      <header className={styles.header}>
        <h2>{t.chat.launcher}</h2>
        <button type="button" onClick={() => setIsOpen(false)} aria-label={t.chat.close}>
          ×
        </button>
      </header>

      <div className={styles.messages} aria-live="polite">
        {shown.map((message, index) => (
          <p key={index} className={message.from === "customer" ? styles.customer : styles.assistant}>
            {message.text}
          </p>
        ))}
        {isSending && <p className={styles.assistant}>…</p>}
        <div ref={endRef} />
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={500}
          placeholder={t.chat.placeholder}
          aria-label={t.chat.messageLabel}
        />
        <button type="submit" disabled={isSending || draft.trim() === ""}>
          {t.chat.send}
        </button>
      </form>
    </section>
  );
}
