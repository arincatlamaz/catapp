import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [fetchingImage, setFetchingImage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = supabase.auth.user();
    if (user) {
      setEmail(user.email);
      setUserId(user.id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchData = async () => {
    setFetchingImage(true);
    try {
      const response = await fetch("https://cataas.com/cat");
      const blob = await response.blob();
      const objectURL = URL.createObjectURL(blob);
      setImageUrl(objectURL);
    } catch (error) {
      console.log("Error fetching image:", error);
    } finally {
      setFetchingImage(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleLike = async () => {
    if (fetchingImage) {
      alert("Image is still loading. Please wait and try again.");
      return;
    }

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const fileName = `cat-${Date.now()}.jpg`;
      const { error } = await supabase.storage
        .from("liked-images")
        .upload(`${userId}/${fileName}`, blob);

      if (error) {
        throw error;
      }

      alert("Image saved successfully!");
    } catch (error) {
      console.error("Error saving image:", error);
      alert("Failed to save image. " + error.message);
    }
  };

  const NavigateToLikes = () => {
    navigate("/likes");
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
        onClick={fetchData}
        className="change-button"
        disabled={fetchingImage}
      >
        {fetchingImage ? "Loading..." : "Change"}
      </button>
      <button onClick={handleLike} className="like-button">
        Like
      </button>
      <button onClick={NavigateToLikes} className="likes-nav-button">
        Likes
      </button>
    </div>
  );
}
