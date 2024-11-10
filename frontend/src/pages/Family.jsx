import { useState, useEffect } from "react";
import { Users, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";

function Family() {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [email, setEmail] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const fetchFamilyMembers = async () => {
    try {
      const response = await api.get("/family");
      setFamilyMembers(response.data.familyMembers || []);
    } catch (error) {
      toast.error("Failed to fetch family members");
    }
  };

  const searchUsers = async (searchEmail) => {
    try {
      const response = await api.get(`/users/search?email=${searchEmail}`);
      setSearchResults(response.data.users || []);
    } catch (error) {
      toast.error("Failed to search users");
    }
  };

  const handleAddMember = async (userId) => {
    try {
      await api.post("/family", { familyMemberId: userId });
      toast.success("Family member added successfully!");
      setEmail("");
      setSearchResults([]);
      fetchFamilyMembers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add family member"
      );
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold flex items-center mb-6">
        <Users className="w-6 h-6 mr-2" />
        Family Members
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (e.target.value) searchUsers(e.target.value);
            }}
            placeholder="Search family member by email"
            className="flex-1 p-2 border rounded-md"
          />
        </div>

        {searchResults.length > 0 && (
          <div className="mt-4 border rounded-md">
            {searchResults.map((user) => (
              <div
                key={user._id}
                className="p-3 flex items-center justify-between hover:bg-gray-50 border-b last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  {user.profilePicture ? (
                    <img
                      src={`http://localhost:3001${user.profilePicture}`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <Users className="w-4 h-4 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddMember(user._id)}
                  className="bg-primary text-white px-3 py-1 rounded-md flex items-center"
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {familyMembers.map((member) => (
          <div key={member._id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              {member.profilePicture ? (
                <img
                  src={`http://localhost:3001${member.profilePicture}`}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-500" />
                </div>
              )}
              <div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-gray-600 text-sm">{member.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Family;
