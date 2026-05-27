import { useState } from 'react';
import type { Conversation } from '../types';
import { createConversation } from '../api';
import styles from './NewConversationModal.module.css';

interface Props {
  onClose: () => void;
  onCreated: (conversation: Conversation) => void;
}

export default function NewConversationModal({ onClose, onCreated }: Props) {
  const [title, setTitle] = useState('');
  const [condition, setCondition] = useState<'treatment' | 'baseline'>('treatment');
  const [phase, setPhase] = useState<'confirming' | 'contradicting'>('confirming');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const conversation = await createConversation({ title: title.trim(), condition, phase });
      onCreated(conversation);
    } catch (err: unknown) {
      const apiErr = err as { errors?: string[] };
      setError(apiErr.errors?.join(' · ') ?? 'Could not reach the server.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className={styles.backdrop} onClick={handleBackdrop}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <span className={styles.heading}>New conversation</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.field}>
            <span className={styles.label}>Title</span>
            <input
              className={styles.input}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Climate change discussion"
              autoFocus
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Condition</span>
            <select
              className={styles.select}
              value={condition}
              onChange={(e) => setCondition(e.target.value as 'treatment' | 'baseline')}
            >
              <option value="treatment">Treatment</option>
              <option value="baseline">Baseline</option>
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Phase</span>
            <select
              className={styles.select}
              value={phase}
              onChange={(e) => setPhase(e.target.value as 'confirming' | 'contradicting')}
            >
              <option value="confirming">Belief-Confirming</option>
              <option value="contradicting">Belief-Contradicting</option>
            </select>
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
