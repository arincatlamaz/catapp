// Dashboard.js
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

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

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {email}!</p>
    </div>
  );
}
