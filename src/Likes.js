import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import "./Likes.css";

export default function Likes() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase.storage
          .from("liked-images")
          .list("", {
            limit: 100,
            offset: 0,
            sortBy: { column: "name", order: "desc" },
          });

        if (error) throw error;

        const imageList = await Promise.all(
          data
            .filter(file => file.name !== ".emptyFolderPlaceholder")
            .map(async file => {
              const { publicURL, error: urlError } = supabase.storage
                .from("liked-images")
                .getPublicUrl(file.name);

              if (urlError) {
                console.error(`Error getting public URL for ${file.name}:`, urlError);
                return null;
              }

              return {
                url: publicURL,
                name: file.name,
                createdAt: new Date(file.updated_at || Date.now()),
              };
            })
        );

        setImages(imageList.filter(image => image && image.url));
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="likes-page-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        Back
      </button>
      <h1>Liked Images</h1>
      {images.length === 0 ? (
        <p>No images found</p>
      ) : (
        <div className="image-list">
          {images.map(image => (
            <div key={image.name} className="image-item">
              <img
                src={image.url}
                alt={`Liked on ${image.createdAt}`}
                onError={e => {
                  console.error(`Failed to load image: ${image.url}`);
                  e.target.alt = "Image failed to load";
                }}
              />
              <p>Liked on: {image.createdAt.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
