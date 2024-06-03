import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import './Dashboard.css';

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = supabase.auth.user();
    if (user) {
      setEmail(user.email);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchNewImage = () => {
    const apiUrl = 'https://cataas.com/cat?random=' + Math.random();
    setImageUrl(apiUrl);
  };

  useEffect(() => {
    fetchNewImage();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <button onClick={handleLogout} className="logout-button">Logout</button>
      <p className="welcome-message">Welcome, {email}!</p>
      <img src={imageUrl} alt="Fetched from API" className="fetched-image" />
      <button onClick={fetchNewImage} className="change-button">Change</button>
      
    </div>
  );
}
