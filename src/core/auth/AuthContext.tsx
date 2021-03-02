import React, { createContext, useEffect, useReducer, useState } from 'react';
import PinDialog from '../../pin-dialog/PinDialog';
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

type PasscodeCallback = (value: string) => void;
let passcodeRequestCallback: undefined | PasscodeCallback;

export const AuthProvider: React.FC = ({ children }) => {
  const vault = SessionVault.getInstance();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showPasscodeModal, setShowPasscodeModal] = useState<boolean>(false);
  const [setPasscodeMode, setSetPasscodeMode] = useState<boolean>(false);

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

  vault.onPasscodeRequest = async (
    _isPasscodeSetRequest: boolean,
  ): Promise<string | undefined> => {
    return new Promise(resolve => {
      passcodeRequestCallback = (value: string) => {
        resolve(value || '');
        setShowPasscodeModal(false);
        setSetPasscodeMode(false);
      };
      setSetPasscodeMode(_isPasscodeSetRequest);
      setShowPasscodeModal(true);
    });
  };

  const handlePasscodeRequest = (callback: PasscodeCallback) => (
    <PinDialog
      onDismiss={({ data }) => callback(data)}
      setPasscodeMode={setPasscodeMode}
    />
  );

  return (
    <AuthContext.Provider value={{ state, dispatch, vault }}>
      {showPasscodeModal &&
        passcodeRequestCallback &&
        handlePasscodeRequest(passcodeRequestCallback)}
      {children}
    </AuthContext.Provider>
  );
};
