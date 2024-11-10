import { useState, useEffect } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";

function Photos() {
  const [photos, setPhotos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await api.get("/photos");
      setPhotos(response.data);
    } catch (error) {
      toast.error("Failed to fetch photos");
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("photo", selectedFile);
    formData.append("description", description);

    try {
      await api.post("/photos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Photo uploaded successfully!");
      setSelectedFile(null);
      setDescription("");
      fetchPhotos();
    } catch (error) {
      toast.error("Failed to upload photo");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center mb-4">
          <ImageIcon className="w-6 h-6 mr-2" />
          Photos
        </h1>
        <form
          onSubmit={handleUpload}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Select Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-md flex items-center"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Photo
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div key={photo._id} className="bg-white p-4 rounded-lg shadow-md">
            <img
              src={`http://localhost:3001${photo.imageUrl}`}
              alt={photo.description}
              className="w-full h-48 object-cover rounded-md mb-2"
            />
            <p className="text-gray-700">{photo.description}</p>
            <p className="text-gray-500 text-sm">
              {new Date(photo.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Photos;
