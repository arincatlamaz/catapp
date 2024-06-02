// Dashboard.js
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import './Dashboard.css';

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = supabase.auth.user();
    if (user) {
      setEmail(user.email);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>
      <p className="welcome-message">Welcome, {email}!</p>
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
}
