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

function mapConversation(raw: Record<string, unknown>): Conversation {
  return {
    id: raw.id as string,
    belief_id: raw.belief_id as string,
    condition: raw.condition as Conversation['condition'],
    instance: raw.instance as Conversation['instance'],
    day: raw.day as number,
    created_at: raw.created_at as string,
    updated_at: raw.updated_at as string,
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
  belief_id: string;
  condition: string;
  instance: string;
  day: number;
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
  content: string,
): Promise<{ response: string; turn_count: number }> {
  const res = await fetch(`${BASE}/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
}
