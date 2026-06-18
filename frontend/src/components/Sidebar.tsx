import type { Conversation } from '../types';
import styles from './Sidebar.module.css';

interface Props {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onToggle: () => void;
}

function IrisIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1" />
      <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1" />
      <line x1="9" y1="1" x2="9" y2="4"   stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="9" y1="14" x2="9" y2="17"  stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="1" y1="9" x2="4" y2="9"    stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="14" y1="9" x2="17" y2="9"  stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="3.1" y1="3.1" x2="5.2" y2="5.2"   stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="12.8" y1="12.8" x2="14.9" y2="14.9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="14.9" y1="3.1" x2="12.8" y2="5.2"  stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="5.2" y1="12.8" x2="3.1" y2="14.9"  stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export default function Sidebar({ conversations, activeId, onSelect, onNew, onToggle }: Props) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <IrisIcon />
          <span className={styles.logoText}>IRIS</span>
        </div>
        <button className={styles.collapseBtn} onClick={onToggle} title="Collapse sidebar">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className={styles.newBtn}>
        <button onClick={onNew}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
            <line x1="5.5" y1="1" x2="5.5" y2="10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="1" y1="5.5" x2="10" y2="5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          New conversation
        </button>
      </div>

      <nav className={styles.list}>
        {conversations.map((c) => (
          <button
            key={c.id}
            className={`${styles.item} ${c.id === activeId ? styles.active : ''}`}
            onClick={() => onSelect(c.id)}
          >
            <span className={styles.itemTitle}>{c.belief_id} · Day {c.day}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
