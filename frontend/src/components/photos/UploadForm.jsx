import { useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { usePhotos } from "../../context/PhotoContext";
import toast from "react-hot-toast";

function UploadForm({ onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setdescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const { uploadPhoto } = usePhotos();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemovePreview = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("photo", selectedFile);
    formData.append("description", description);

    const success = await uploadPhoto(formData);
    if (success) {
      setSelectedFile(null);
      setdescription("");
      setPreviewUrl(null);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        {previewUrl ? (
          <div className="relative w-40 h-40 mx-auto mb-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg shadow-md"
            />
            <button
              type="button"
              onClick={handleRemovePreview}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-40 h-40 mx-auto mb-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <ImageIcon className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">No image selected</p>
            </div>
          </div>
        )}

        <label className="block text-gray-700 mb-2">Select Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-white
            hover:file:bg-primary/90"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setdescription(e.target.value)}
          placeholder="Write a description..."
          className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          rows="3"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md flex items-center hover:bg-primary/90 transition-colors"
        >
          <Upload className="w-5 h-5 mr-2" />
          Share
        </button>
      </div>
    </form>
  );
}

export default UploadForm;
