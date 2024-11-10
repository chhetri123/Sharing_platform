import { Link, useNavigate } from "react-router-dom";
import { Calendar, Users, Image, LogOut } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
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
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-700 hover:text-red-600"
          >
            <LogOut className="w-5 h-5 mr-1" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
