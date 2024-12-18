import React, { useState, useEffect } from "react";
import Profile from "../components/profile/Profile";
import axios from "axios";
import EditProfileForm from "../components/profile/EditProfileForm";

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    preferences: [] as string[], // Array to support multiple preferences
    profilePicture: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data from the backend on component mount
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      setUserData({
        name: response.data.name,
        email: response.data.email,
        preferences:  response.data.preferences || [],
        profilePicture: response.data.profilePicture || "/default-profile.png",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Save updated data to the backend
  const handleSave = async (updatedData: any) => {
    try {
      const formData = new FormData();
      formData.append("name", updatedData.name);
      formData.append("preferences", JSON.stringify(updatedData.preferences));

      if (updatedData.profilePicture instanceof File) {
        formData.append("profilePicture", updatedData.profilePicture);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUserData((prev) => ({
        ...prev,
        name: response.data.name,
        preferences: response.data.user.preferences || [],
        profilePicture: response.data.profilePicture || prev.profilePicture,
      }));
      // Refresh profile data after saving
      fetchUserData();
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return isEditing ? (
    <EditProfileForm
      initialName={userData.name}
      initialEmail={userData.email}
      initialDietaryPreferences={userData.preferences}
      initialProfilePicture={userData.profilePicture}
      onSave={handleSave}
      onCancel={() => setIsEditing(false)}
    />
  ) : (
    <Profile
      name={userData.name}
      email={userData.email}
      dietaryPreference={userData.preferences} // Display multiple preferences
      profilePicture={userData.profilePicture}
      onEdit={() => setIsEditing(true)}
    />
  );
};

export default ProfilePage;
