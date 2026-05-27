export type Role = 'user' | 'iris';

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  condition: 'treatment' | 'baseline';
  phase: 'confirming' | 'contradicting';
  created_at: string;
  updated_at: string;
  messages: Message[];
}

export type AppAction =
  | { type: 'SELECT_CONVERSATION'; id: string }
  | { type: 'SET_CONVERSATIONS'; conversations: Conversation[] }
  | { type: 'ADD_CONVERSATION'; conversation: Conversation }
  | { type: 'SET_MESSAGES'; conversationId: string; messages: Message[] }
  | { type: 'ADD_MESSAGE'; conversationId: string; message: Message }
  | { type: 'TOGGLE_SIDEBAR' };

export interface AppState {
  conversations: Conversation[];
  activeId: string;
  sidebarOpen: boolean;
}
