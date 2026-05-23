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
  messages: Message[];
}

export type AppAction =
  | { type: 'SELECT_CONVERSATION'; id: string }
  | { type: 'NEW_CONVERSATION' }
  | { type: 'ADD_MESSAGE'; message: Message }
  | { type: 'TOGGLE_SIDEBAR' };

export interface AppState {
  conversations: Conversation[];
  activeId: string;
  sidebarOpen: boolean;
}
