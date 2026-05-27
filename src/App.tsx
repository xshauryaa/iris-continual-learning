import { useReducer, useState, useEffect } from 'react';
import type { AppState, AppAction, Conversation, Message } from './types';
import * as api from './api';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import NewConversationModal from './components/NewConversationModal';
import './App.css';

const initialState: AppState = {
  conversations: [],
  activeId: '',
  sidebarOpen: true,
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return {
        ...state,
        conversations: action.conversations,
        activeId: action.conversations[0]?.id ?? '',
      };

    case 'SELECT_CONVERSATION':
      return { ...state, activeId: action.id };

    case 'ADD_CONVERSATION':
      return {
        ...state,
        conversations: [action.conversation, ...state.conversations],
        activeId: action.conversation.id,
      };

    case 'SET_MESSAGES':
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.conversationId ? { ...c, messages: action.messages } : c
        ),
      };

    case 'ADD_MESSAGE':
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.conversationId
            ? { ...c, messages: [...c.messages, action.message] }
            : c
        ),
      };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };

    default:
      return state;
  }
}

function optimisticMessage(role: Message['role'], text: string): Message {
  return { id: `optimistic-${Date.now()}`, role, text, timestamp: new Date() };
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadedConversations, setLoadedConversations] = useState<Set<string>>(new Set());

  const activeConversation = state.conversations.find((c) => c.id === state.activeId);

  // Load conversations on mount
  useEffect(() => {
    api.getConversations().then((conversations) => {
      dispatch({ type: 'SET_CONVERSATIONS', conversations });
    });
  }, []);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!state.activeId || loadedConversations.has(state.activeId)) return;
    api.getMessages(state.activeId).then((messages) => {
      dispatch({ type: 'SET_MESSAGES', conversationId: state.activeId, messages });
      setLoadedConversations((prev) => new Set(prev).add(state.activeId));
    });
  }, [state.activeId]);

  async function handleSend(text: string) {
    if (!state.activeId) return;
    const conversationId = state.activeId;

    // Optimistic user message
    const optimisticUser = optimisticMessage('user', text);
    dispatch({ type: 'ADD_MESSAGE', conversationId, message: optimisticUser });

    // Persist user message, then refresh thread with server-assigned id
    await api.postMessage(conversationId, 'user', text);
    const messages = await api.getMessages(conversationId);
    dispatch({ type: 'SET_MESSAGES', conversationId, messages });

    setTimeout(async () => {
      const irisText = '[IRIS] Processing input — backend not yet connected.';
      const optimisticIris = optimisticMessage('iris', irisText);
      dispatch({ type: 'ADD_MESSAGE', conversationId, message: optimisticIris });
      await api.postMessage(conversationId, 'iris', irisText);
      const updated = await api.getMessages(conversationId);
      dispatch({ type: 'SET_MESSAGES', conversationId, messages: updated });
    }, 600);
  }

  function handleCreated(conversation: Conversation) {
    dispatch({ type: 'ADD_CONVERSATION', conversation });
    setLoadedConversations((prev) => new Set(prev).add(conversation.id));
    setModalOpen(false);
  }

  return (
    <div className="app">
      {state.sidebarOpen && (
        <Sidebar
          conversations={state.conversations}
          activeId={state.activeId}
          onSelect={(id) => dispatch({ type: 'SELECT_CONVERSATION', id })}
          onNew={() => setModalOpen(true)}
          onToggle={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        />
      )}
      {activeConversation ? (
        <ChatArea
          conversation={activeConversation}
          onSend={handleSend}
          onToggleSidebar={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          sidebarOpen={state.sidebarOpen}
        />
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            Create a conversation to get started
          </span>
        </div>
      )}
      {modalOpen && (
        <NewConversationModal
          onClose={() => setModalOpen(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
