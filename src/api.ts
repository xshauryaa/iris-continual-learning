import type { Conversation, Message } from './types';

const BASE = 'http://localhost:3000/api';

function mapMessage(raw: Record<string, string>): Message {
  return {
    id: raw.id,
    role: raw.role === 'assistant' ? 'iris' : 'user',
    text: raw.content,
    timestamp: new Date(raw.created_at),
  };
}

function mapConversation(raw: Record<string, string>): Conversation {
  return {
    id: raw.id,
    title: raw.title,
    condition: raw.condition as Conversation['condition'],
    phase: raw.phase as Conversation['phase'],
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    messages: [],
  };
}

export async function getConversations(): Promise<Conversation[]> {
  const res = await fetch(`${BASE}/conversations`);
  if (!res.ok) throw new Error('Failed to load conversations');
  const data = await res.json();
  return data.map(mapConversation);
}

export async function createConversation(body: {
  title: string;
  condition: string;
  phase: string;
}): Promise<Conversation> {
  const res = await fetch(`${BASE}/conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error('Validation failed'), { errors: data.errors });
  return mapConversation(data);
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const res = await fetch(`${BASE}/conversations/${conversationId}/messages`);
  if (!res.ok) throw new Error('Failed to load messages');
  const data = await res.json();
  return data.map(mapMessage);
}

export async function postMessage(
  conversationId: string,
  role: 'user' | 'iris',
  text: string,
): Promise<Message> {
  const res = await fetch(`${BASE}/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: role === 'iris' ? 'assistant' : 'user', content: text }),
  });
  if (!res.ok) throw new Error('Failed to send message');
  const data = await res.json();
  return mapMessage(data);
}
