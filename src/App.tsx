import { useReducer } from 'react';
import { AppState, AppAction, Conversation, Message } from './types';
import './App.css';

const SEED_CONVERSATIONS: Conversation[] = [
  { id: '1', title: 'Project architecture review', messages: [] },
  { id: '2', title: 'Debugging auth middleware', messages: [] },
  { id: '3', title: 'Refactor data pipeline', messages: [] },
  { id: '4', title: 'API rate limiting strategy', messages: [] },
];

const initialState: AppState = {
  conversations: SEED_CONVERSATIONS,
  activeId: SEED_CONVERSATIONS[0].id,
  sidebarOpen: true,
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SELECT_CONVERSATION':
      return { ...state, activeId: action.id };

    case 'NEW_CONVERSATION': {
      const id = String(Date.now());
      const fresh: Conversation = { id, title: 'New conversation', messages: [] };
      return {
        ...state,
        conversations: [fresh, ...state.conversations],
        activeId: id,
      };
    }

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

  const activeConversation = state.conversations.find((c) => c.id === state.activeId)!;

  function handleSend(text: string) {
    const userMsg = makeMessage('user', text);
    dispatch({ type: 'ADD_MESSAGE', message: userMsg });

    setTimeout(() => {
      const irisMsg = makeMessage('iris', '[IRIS] Processing input — backend not yet connected.');
      dispatch({ type: 'ADD_MESSAGE', message: irisMsg });
    }, 600);
  }

  return (
    <div className="app">
      {/* Sidebar and ChatArea will be wired here in later commits */}
      <pre style={{ color: 'var(--text-secondary)', padding: 24, fontSize: 11 }}>
        {JSON.stringify({ activeId: state.activeId, sidebarOpen: state.sidebarOpen, msgCount: activeConversation.messages.length }, null, 2)}
      </pre>
    </div>
  );
}
