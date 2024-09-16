import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LabelInput from "./LabelInput";
import AlertStatus from "../AlertStatus";
import { useAuth } from "../section/AuthContext"; // Make sure this path is correct

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth(); // Use the register function from AuthContext

  const handleForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (confirmPassword !== password) {
      setErrorMessage("Passwords don't match");
      return;
    }

    try {
      await register({ name, email, password });
      setSuccessMessage("Thank you for registering");

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000); // Navigate after 2 seconds to show the success message
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div>
      <form onSubmit={handleForm} className="p-3 border border-dark">
        <LabelInput
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <LabelInput
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <LabelInput
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <LabelInput
          type="password"
          name="confirmpassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
        />

        <button className="btn bgAccent">Register</button>
        {successMessage && (
          <AlertStatus
            message={successMessage}
            state="alert-success"
            icon="#check-circle-fill"
          />
        )}
        {errorMessage && (
          <AlertStatus
            message={errorMessage}
            state="alert-danger"
            icon="#exclamation-triangle-fill"
          />
        )}
      </form>
    </div>
  );
}

export default RegisterForm;
