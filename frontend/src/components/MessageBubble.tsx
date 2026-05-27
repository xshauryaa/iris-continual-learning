import type { Message } from '../types';
import styles from './MessageBubble.module.css';

interface Props {
  message: Message;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`${styles.row} ${isUser ? styles.rowUser : styles.rowIris}`}>
      <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleIris}`}>
        <p className={styles.text}>{message.text}</p>
        <span className={styles.timestamp}>{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
}
