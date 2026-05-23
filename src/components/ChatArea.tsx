import { useEffect, useRef, useState } from 'react';
import { Conversation } from '../types';
import MessageBubble from './MessageBubble';
import InputBar from './InputBar';
import styles from './ChatArea.module.css';

interface Props {
  conversation: Conversation;
  onSend: (text: string) => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export default function ChatArea({ conversation, onSend, onToggleSidebar, sidebarOpen }: Props) {
  const [waiting, setWaiting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const lastRole = conversation.messages.at(-1)?.role;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages, waiting]);

  function handleSend(text: string) {
    setWaiting(true);
    onSend(text);
    setTimeout(() => setWaiting(false), 600);
  }

  return (
    <div className={styles.area}>
      <header className={styles.header}>
        {!sidebarOpen && (
          <button className={styles.expandBtn} onClick={onToggleSidebar} title="Open sidebar">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <span className={styles.title}>{conversation.title}</span>
      </header>

      <div className={styles.thread}>
        {conversation.messages.length === 0 && (
          <div className={styles.empty}>
            <span>Start a conversation</span>
          </div>
        )}

        {conversation.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {waiting && (
          <div className={styles.pendingRow}>
            <span className={styles.cursor} aria-label="IRIS is thinking" />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <InputBar onSend={handleSend} disabled={waiting} />
    </div>
  );
}
