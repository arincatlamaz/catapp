import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [fetchingImage, setFetchingImage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = supabase.auth.user();
    if (user) {
      setEmail(user.email);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchNewImage = async () => {
    setFetchingImage(true);
    try {
      const response = await fetch("https://cataas.com/api/cats?limit=200");
      const data = await response.json();
      const randomIndex = Math.floor(Math.random() * data.length);
      const imageUrl = "https://cataas.com/cat/" + data[randomIndex]._id;
      setImageUrl(imageUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
    } finally {
      setFetchingImage(false);
    }
  };

  useEffect(() => {
    fetchNewImage();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleLike = async () => {
    try {
      if (fetchingImage) {
        alert("Image is still loading. Please wait and try again.");
        return;
      }

      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const blob = await response.blob();
      const fileName = `cat-${Date.now()}.jpg`;
      const { error } = await supabase.storage
        .from("liked-images")
        .upload(fileName, blob);

      if (error) {
        throw error;
      }

      alert("Image saved successfully!");
    } catch (error) {
      console.error("Error saving image:", error);
      alert("Failed to save image. " + error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
      <p className="welcome-message">Welcome, {email}!</p>
      <img
        src={imageUrl}
        alt="Fetched from API"
        className="fetched-image"
        onLoad={() => setFetchingImage(false)}
      />
      <button
        onClick={fetchNewImage}
        className="change-button"
        disabled={fetchingImage}
      >
        {fetchingImage ? "Loading..." : "Change"}
      </button>
      <button onClick={handleLike} className="like-button">
        Like
      </button>
    </div>
  );
}
