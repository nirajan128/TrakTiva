import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserData() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://traktivaserver.onrender.com/user/userData`,
          {
            withCredentials: true,
          }
        );
        console.log("User data received:", response.data.user);
        setUserData(response.data.user);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching user data"
        );
        if (err.response?.status === 401) {
          // Unauthorized, redirect to login
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const logOut = async () => {
    try {
      await axios.get(`https://traktivaserver.onrender.com/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      setError(
        err.response?.data?.message || "An error occurred during logout"
      );
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      {userData ? (
        <div>
          <p>Welcome, {userData.name}!</p>
          {/* Display more user data as needed */}
          <button className="btn btn-primary" onClick={logOut}>
            Logout
          </button>
        </div>
      ) : (
        <p>No user data available. Please log in.</p>
      )}
    </div>
  );
}

export default UserData;
