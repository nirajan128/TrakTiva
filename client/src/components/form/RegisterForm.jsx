import LabelInput from "./Form/LabelInput";
import { useState } from "react";
import Button from "./Button";
import axios from "axios";
import AlertStatus from "./AlertStatus";
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

        <Button content="Register" color="btn bg-primary" />
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
