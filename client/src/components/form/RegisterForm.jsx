import LabelInput from "./LabelInput";
import { useState } from "react";
import axios from "axios";
import AlertStatus from "../AlertStatus";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleForm = async (e) => {
    e.preventDefault();
    if (confirmPassword !== password) {
      setErrorMessage("Passwords don't match");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/register`,
        {
          name,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Important for maintaining session
        }
      );
      setSuccessMessage("Thank you for registering");
      console.log(response.data);

      setTimeout(() => {
        navigate("/userData");
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
        {/* Form inputs remain the same */}
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
