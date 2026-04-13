import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

export const App = () => {
  return (
    <AuthProvider>
      <div className="App font-sans text-gray-900">
        <Toaster position="top-right" />
        <AppRoutes />
      </div>
    </AuthProvider>
  );
};

export default App;