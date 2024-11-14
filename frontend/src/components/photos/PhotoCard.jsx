import { useState } from "react";
import { User, Heart, Share2, Maximize2, Trash2 } from "lucide-react";
import { usePhotos } from "../../context/PhotoContext";
import { useUser } from "../../context/UserContext";
import toast from "react-hot-toast";

function PhotoCard({ photo }) {
  const { toggleLike, deletePhoto } = usePhotos();
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(
    photo.likes.some((like) => like._id === user?._id)
  );
  const [likeCount, setLikeCount] = useState(photo.likes.length);
  const [showFullImage, setShowFullImage] = useState(false);
  const isOwner = photo.userId._id === user?._id;

  const handleLike = async (e) => {
    e.stopPropagation();
    const success = await toggleLike(photo._id);
    if (success) {
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    }
  };

  const handleDeletePhoto = async (e) => {
    e.stopPropagation();

    if (!isOwner) {
      toast.error("You can only delete your own photos");
      return;
    }

    const success = await deletePhoto(photo._id);
    if (success) {
      toast.success("Photo deleted successfully");
    }
  };

  return (
    <>
      <div className="group relative bg-white rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        {isOwner && (
          <button
            onClick={handleDeletePhoto}
            className="absolute top-3 right-3 z-30 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        {/* Likes Counter Badge */}
        <div className="absolute top-3 left-3 z-20 flex items-center bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 space-x-1.5">
          <Heart
            className={`w-4 h-4 ${
              isLiked ? "fill-primary text-primary" : "text-white"
            }`}
          />
          <span className="text-white text-sm font-medium">{likeCount}</span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

        {/* Main Content */}
        <div className="relative aspect-[4/3]">
          <img
            src={photo.imageUrl}
            alt={photo.description}
            className="w-full h-full object-cover"
          />

          {/* Floating Info Card */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              {/* User Info */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20">
                    {photo.userId?.profilePicture ? (
                      <img
                        src={` ${photo.userId.profilePicture}`}
                        alt={photo.userId.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{photo.userId?.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(photo.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleLike}
                    className="transform transition hover:scale-110"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isLiked ? "fill-primary text-primary" : "text-gray-600"
                      }`}
                    />
                  </button>
                  <button className="transform transition hover:scale-110">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setShowFullImage(true)}
                    className="transform transition hover:scale-110"
                  >
                    <Maximize2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* description */}
              {photo.description && (
                <p className="text-sm text-gray-700 line-clamp-2">
                  {photo.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Image Modal */}
      {showFullImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img
              src={` ${photo.imageUrl}`}
              alt={photo.description}
              className="w-full h-full object-contain"
            />
            {/* Like Counter in Full View */}
            <div className="absolute top-4 left-4 flex items-center bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 space-x-1.5">
              <Heart
                className={`w-4 h-4 ${
                  isLiked ? "fill-primary text-primary" : "text-white"
                }`}
              />
              <span className="text-white text-sm font-medium">
                {likeCount}
              </span>
            </div>
            <button
              className="absolute top-4 right-4 text-white hover:text-primary"
              onClick={() => setShowFullImage(false)}
            >
              <Maximize2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default PhotoCard;
