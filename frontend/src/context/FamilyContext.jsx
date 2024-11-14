import { createContext, useContext, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

const FamilyContext = createContext();

export function FamilyProvider({ children }) {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFamilyMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/family");
      setFamilyMembers(response.data.familyMembers || []);
    } catch (error) {
      toast.error("Failed to fetch family members");
    } finally {
      setLoading(false);
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

  const addFamilyMember = async (userId) => {
    try {
      await api.post("/family", { familyMemberId: userId });
      toast.success("Family member added successfully!");
      setSearchResults([]);
      await fetchFamilyMembers();
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add family member"
      );
      return false;
    }
  };

  const removeFamilyMember = async (memberId) => {
    try {
      await api.delete(`/family/${memberId}`);
      toast.success("Family member removed successfully");
      await fetchFamilyMembers();
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to remove family member"
      );
      return false;
    }
  };

  return (
    <FamilyContext.Provider
      value={{
        familyMembers,
        searchResults,
        loading,
        fetchFamilyMembers,
        searchUsers,
        addFamilyMember,
        removeFamilyMember,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily() {
  return useContext(FamilyContext);
}
