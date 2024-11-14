import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  Image,
  LogOut,
  User,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import NotificationDropdown from "./notifications/NotificationDropdown";
import { useNotifications } from "../context/NotificationContext";

function Navbar() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Navigation Links */}
          <div className="hidden sm:flex space-x-8">
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
            <Link
              to="/dashboard"
              className="flex items-center text-gray-700 hover:text-primary"
            >
              <LayoutDashboard className="w-5 h-5 mr-1" />
              Dashboard
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-gray-700 hover:text-primary focus:outline-none"
            >
              {showMobileMenu ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
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
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-sm sm:text-base">
                    {user?.name}
                  </span>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>Profile Settings</span>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors flex items-center"
                  >
                    <div className="flex items-center">
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>Logout</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="sm:hidden mt-4 space-y-4">
            <Link
              to="/events"
              className="flex items-center text-gray-700 hover:text-primary"
              onClick={() => setShowMobileMenu(false)}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Events
            </Link>
            <Link
              to="/family"
              className="flex items-center text-gray-700 hover:text-primary"
              onClick={() => setShowMobileMenu(false)}
            >
              <Users className="w-5 h-5 mr-2" />
              Family
            </Link>
            <Link
              to="/photos"
              className="flex items-center text-gray-700 hover:text-primary"
              onClick={() => setShowMobileMenu(false)}
            >
              <Image className="w-5 h-5 mr-2" />
              Photos
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center text-gray-700 hover:text-primary"
              onClick={() => setShowMobileMenu(false)}
            >
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Dashboard
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
