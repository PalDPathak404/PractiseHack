import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AlertHistory from './pages/AlertHistory';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen bg-background flex items-center justify-center text-primary animate-pulse font-sans">Initializing Sentinel Grid...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div className="flex w-full">
                      <Sidebar />
                      <div className="flex-1 flex flex-col min-w-0">
                        <Navbar />
                        <main className="flex-1 overflow-y-auto p-6 bg-background">
                          <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/history" element={<AlertHistory />} />
                            <Route path="/settings" element={<Settings />} />
                          </Routes>
                        </main>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
