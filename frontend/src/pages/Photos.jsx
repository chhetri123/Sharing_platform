import { useState, useEffect } from "react";
import { ImageIcon, Upload, User, Users } from "lucide-react";
import { usePhotos } from "../context/PhotoContext";
import PhotoGrid from "../components/photos/PhotoGrid";
import UploadForm from "../components/photos/UploadForm";

function Photos() {
  const { photos, userPhotos, loading, fetchPhotos, fetchUserPhotos } =
    usePhotos();
  const [activeTab, setActiveTab] = useState("shared");
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    fetchPhotos();
    fetchUserPhotos();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <ImageIcon className="w-6 h-6 mr-2" />
          Photos
        </h1>
        <button
          onClick={() => setShowUploadForm(true)}
          className="bg-primary text-white px-4 py-2 rounded-md flex items-center"
        >
          <Upload className="w-5 h-5 mr-2" />
          Upload Photo
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("shared")}
          className={`px-4 py-2 rounded-md flex items-center ${
            activeTab === "shared"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          <Users className="w-4 h-4 mr-2" />
          Family Photos
        </button>
        <button
          onClick={() => setActiveTab("personal")}
          className={`px-4 py-2 rounded-md flex items-center ${
            activeTab === "personal"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          <User className="w-4 h-4 mr-2" />
          My Photos
        </button>
      </div>

      {showUploadForm && (
        <div className="mb-8">
          <UploadForm onClose={() => setShowUploadForm(false)} />
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <PhotoGrid
          photos={activeTab === "shared" ? photos : userPhotos}
          isPersonalTab={activeTab === "personal"}
        />
      )}
    </div>
  );
}

export default Photos;
