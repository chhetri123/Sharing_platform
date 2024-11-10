import { createContext, useContext, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

const PhotoContext = createContext();

export function PhotoProvider({ children }) {
  const [photos, setPhotos] = useState([]);
  const [userPhotos, setUserPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await api.get("/photos/shared");
      setPhotos(response.data);
    } catch (error) {
      toast.error("Failed to fetch photos");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPhotos = async () => {
    try {
      setLoading(true);
      const response = await api.get("/photos/user");
      setUserPhotos(response.data);
    } catch (error) {
      toast.error("Failed to fetch your photos");
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (formData) => {
    try {
      await api.post("/photos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Photo uploaded successfully!");
      await Promise.all([fetchPhotos(), fetchUserPhotos()]);
      return true;
    } catch (error) {
      toast.error("Failed to upload photo");
      return false;
    }
  };

  const toggleLike = async (photoId) => {
    try {
      const response = await api.post(`/photos/${photoId}/like`);
      return true;
    } catch (error) {
      toast.error("Failed to update like");
      return false;
    }
  };

  const deletePhoto = async (photoId) => {
    try {
      await api.delete(`/photos/${photoId}`);
      setPhotos(photos.filter((photo) => photo._id !== photoId));
      setUserPhotos(userPhotos.filter((photo) => photo._id !== photoId));
      return true;
    } catch (error) {
      toast.error("Failed to delete photo");
      return false;
    }
  };

  return (
    <PhotoContext.Provider
      value={{
        photos,
        userPhotos,
        loading,
        fetchPhotos,
        fetchUserPhotos,
        uploadPhoto,
        toggleLike,
        deletePhoto,
      }}
    >
      {children}
    </PhotoContext.Provider>
  );
}

export function usePhotos() {
  return useContext(PhotoContext);
}
