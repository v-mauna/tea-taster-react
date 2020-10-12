import React from 'react';
import App from './App';
import { AuthProvider } from './core/auth';

const ProvidedApp: React.FC = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
export default ProvidedApp;
