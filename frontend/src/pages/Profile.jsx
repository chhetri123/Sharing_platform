import { useState } from "react";
import { User, Camera } from "lucide-react";
import { useUser } from "../context/UserContext";

function Profile() {
  const { user, updateProfile } = useUser();
  const [formData, setFormData] = useState({
    name: user?.name || "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("name", formData.name);
    if (selectedFile) {
      submitData.append("profilePicture", selectedFile);
    }

    const success = await updateProfile(submitData);
    if (success) {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold flex items-center mb-6">
        <User className="w-6 h-6 mr-2" />
        Profile Settings
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden">
                {previewUrl || user?.profilePicture ? (
                  <img
                    src={
                      previewUrl ||
                      `http://localhost:3001${user.profilePicture}`
                    }
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="text-gray-600">
            <label className="block text-gray-700 mb-2">Email</label>
            <p className="p-2 bg-gray-50 rounded-md">{user?.email}</p>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white p-2 rounded-md hover:bg-primary/90"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
