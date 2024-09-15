/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

function UserData() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
        const response = await axios.get(`${apiBaseUrl}/user/userData`, {
          withCredentials: true,
        });
        setUserData(response.data.user);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      }
    };

    fetchUserData();
  }, []);

  const logOut = async () => {
    try {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
      await axios.get(`${apiBaseUrl}/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null); // Clear user data after logout
      navigate("/"); //redirects to the home page
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during logout"
      );
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      {userData ? (
        <div>
          <p>Welcome, {userData.name}!</p>
          {/* Display more user data as needed */}
          <button className="btn btn-primary" onClick={logOut}>
            Logout
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default UserData;
