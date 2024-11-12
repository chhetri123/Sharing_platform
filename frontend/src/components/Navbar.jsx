import { Link } from "react-router-dom";
import { Calendar, Users, Image, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import NotificationDropdown from "./notifications/NotificationDropdown";
import { useNotifications } from "../context/NotificationContext";

function Navbar() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { notifications, respondToFamilyRequest } = useNotifications();

  const handleLogout = () => {
    logout();
  };

  const handleAcceptRequest = (notificationId) => {
    respondToFamilyRequest(notificationId, true);
  };

  const handleRejectRequest = (notificationId) => {
    respondToFamilyRequest(notificationId, false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    console.log(user);
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Navigation Links */}
          <div className="flex space-x-8">
            <Link
              to="/events"
              className="flex items-center text-gray-700 hover:text-primary"
            >
              <Calendar className="w-5 h-5 mr-1" />
              Events
            </Link>
            <Link
              to="/family"
              className="flex items-center text-gray-700 hover:text-primary"
            >
              <Users className="w-5 h-5 mr-1" />
              Family
            </Link>
            <Link
              to="/photos"
              className="flex items-center text-gray-700 hover:text-primary"
            >
              <Image className="w-5 h-5 mr-1" />
              Photos
            </Link>
          </div>

          {/* Right side - User menu and notifications */}
          <div className="flex items-center space-x-4">
            <NotificationDropdown
              notifications={notifications}
              onAccept={handleAcceptRequest}
              onReject={handleRejectRequest}
            />

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 text-gray-700 hover:text-primary focus:outline-none"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20">
                    {user?.profilePicture ? (
                      <img
                        src={`http://localhost:3001${user.profilePicture}`}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </div>
                  <span className="font-medium">{user?.name}</span>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/profile"
                    className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
