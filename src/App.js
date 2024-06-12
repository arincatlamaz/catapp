import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Likes from './Likes';
import Dashboard from './Dashboard';
import { supabase } from './supabaseClient';
import { useState, useEffect } from 'react';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = supabase.auth.session();
    setUser(session ? session.user : null);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session ? session.user : null);
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={!user ? <Navigate to="/login" /> : <Dashboard />} />
        <Route path="/likes" element={user ? <Likes /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}