import { useState } from 'react';
import type { Conversation } from '../types';
import { createConversation } from '../api';
import styles from './NewConversationModal.module.css';

interface Props {
  onClose: () => void;
  onCreated: (conversation: Conversation) => void;
}

export default function NewConversationModal({ onClose, onCreated }: Props) {
  const [beliefId, setBeliefId] = useState('');
  const [condition, setCondition] = useState<'confirming' | 'contradicting'>('confirming');
  const [instance, setInstance] = useState<'treatment' | 'baseline'>('treatment');
  const [day, setDay] = useState(1);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!beliefId.trim()) {
      setError('Belief ID is required.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const conversation = await createConversation({
        belief_id: beliefId.trim(),
        condition,
        instance,
        day,
      });
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
            <span className={styles.label}>Belief ID</span>
            <input
              className={styles.input}
              type="text"
              value={beliefId}
              onChange={(e) => setBeliefId(e.target.value)}
              placeholder="e.g. SM3, V1, E2"
              autoFocus
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Condition</span>
            <select
              className={styles.select}
              value={condition}
              onChange={(e) => setCondition(e.target.value as 'confirming' | 'contradicting')}
            >
              <option value="confirming">Confirming</option>
              <option value="contradicting">Contradicting</option>
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Instance</span>
            <select
              className={styles.select}
              value={instance}
              onChange={(e) => setInstance(e.target.value as 'treatment' | 'baseline')}
            >
              <option value="treatment">Treatment</option>
              <option value="baseline">Baseline</option>
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Day</span>
            <input
              className={styles.input}
              type="number"
              min={1}
              value={day}
              onChange={(e) => setDay(parseInt(e.target.value, 10) || 1)}
            />
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
