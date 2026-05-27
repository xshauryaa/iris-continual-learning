import { useReducer, useState } from 'react';
import type { AppState, AppAction, Conversation, Message } from './types';
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
    case 'SELECT_CONVERSATION':
      return { ...state, activeId: action.id };

    case 'ADD_CONVERSATION':
      return {
        ...state,
        conversations: [action.conversation, ...state.conversations],
        activeId: action.conversation.id,
      };

    case 'ADD_MESSAGE': {
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === state.activeId
            ? { ...c, messages: [...c.messages, action.message] }
            : c
        ),
      };
    }

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };

    default:
      return state;
  }
}

function makeMessage(role: Message['role'], text: string): Message {
  return { id: String(Date.now() + Math.random()), role, text, timestamp: new Date() };
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [modalOpen, setModalOpen] = useState(false);

  const activeConversation = state.conversations.find((c) => c.id === state.activeId);

  function handleSend(text: string) {
    const userMsg = makeMessage('user', text);
    dispatch({ type: 'ADD_MESSAGE', message: userMsg });

    setTimeout(() => {
      const irisMsg = makeMessage('iris', '[IRIS] Processing input — backend not yet connected.');
      dispatch({ type: 'ADD_MESSAGE', message: irisMsg });
    }, 600);
  }

  function handleCreated(conversation: Conversation) {
    dispatch({ type: 'ADD_CONVERSATION', conversation: { ...conversation, messages: [] } });
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
