import React, { createContext, useEffect, useReducer } from 'react';
import { Session } from '../models';
import { SessionVault } from '../vault/SessionVault';

interface AuthState {
  session?: Session;
  loading: boolean;
  error: string;
}

const initialState: AuthState = {
  session: undefined,
  loading: false,
  error: '',
};

export type AuthAction =
  | { type: 'CLEAR_SESSION' }
  | { type: 'RESTORE_SESSION'; session: Session }
  | { type: 'LOGIN' }
  | { type: 'LOGIN_SUCCESS'; session: Session }
  | { type: 'LOGIN_FAILURE'; error: string }
  | { type: 'LOGOUT' }
  | { type: 'LOGOUT_SUCCESS' }
  | { type: 'LOGOUT_FAILURE'; error: string };

const reducer = (
  state: AuthState = initialState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case 'CLEAR_SESSION':
      return { ...state, session: undefined };
    case 'RESTORE_SESSION':
      return { ...state, session: action.session };
    case 'LOGIN':
      return { ...state, loading: true, error: '' };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, session: action.session };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.error };
    case 'LOGOUT':
      return { ...state, loading: true, error: '' };
    case 'LOGOUT_SUCCESS':
      return { ...state, loading: false, session: undefined };
    case 'LOGOUT_FAILURE':
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export const AuthContext = createContext<{
  state: typeof initialState;
  dispatch: (action: AuthAction) => void;
  vault: SessionVault;
}>({
  state: initialState,
  dispatch: () => {},
  vault: SessionVault.getInstance(),
});

export const AuthProvider: React.FC = ({ children }) => {
  const vault = SessionVault.getInstance();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      const session = await vault.restoreSession();
      if (!session) return;
      return dispatch({ type: 'RESTORE_SESSION', session });
    })();
  }, [vault]);

  vault.onVaultLocked = (): void => {
    dispatch({ type: 'CLEAR_SESSION' });
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, vault }}>
      {children}
    </AuthContext.Provider>
  );
};
