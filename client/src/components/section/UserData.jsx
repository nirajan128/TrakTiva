import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserData() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `https://traktivaserver.onrender.com/auth/user`,
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
          {/* Display more user data as needed */}
          <button className="btn btn-primary" onClick={logOut}>
            Logout
          </button>
        </div>
      ) : (
        <p>
          No user data available. Please{" "}
          <button onClick={() => navigate("/")}>log in</button>.
        </p>
      )}
    </div>
  );
}

export default UserData;
