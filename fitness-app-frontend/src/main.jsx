import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './store/store';
import { Provider } from 'react-redux';
import { authConfig } from './authConfig';
import { AuthProvider } from 'react-oauth2-code-pkce';

const root = createRoot(document.getElementById('root'));

root.render(
  <AuthProvider
    authConfig={authConfig}
    loadingComponent={
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Authenticating...</p>
        </div>
      </div>
    }
  >
    <Provider store={store}>
      <App />
    </Provider>
  </AuthProvider>
);