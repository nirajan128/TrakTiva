// src/components/section/UserData.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function UserData() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `https://traktivaserver.onrender.com/user/userData`,
        { withCredentials: true }
      );
      console.log("User data received:", response.data.user);
      setUserData(response.data.user);
      setError("");
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while fetching user data"
      );
      if (err.response?.status === 401) {
        navigate("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      setError("An error occurred during logout");
    }
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError("");
    fetchUserData();
  };

  if (isLoading) {
    return <p>Loading user data... Please wait.</p>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      {userData ? (
        <div>
          <h2>Welcome, {userData.name}!</h2>
          <p>Email: {userData.email}</p>
          <button className="btn btn-primary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <p>
          No user data available. Please{" "}
          <button onClick={() => navigate("/login")}>log in</button>.
        </p>
      )}
    </div>
  );
}

export default UserData;
