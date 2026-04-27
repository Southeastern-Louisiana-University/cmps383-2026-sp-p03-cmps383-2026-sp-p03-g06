import "./SignIn.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const foundUser = users.find(
      (u: any) => u.email === email
    );

    if (!foundUser) {
      setError("User not found. Please sign up or try again.");
      return;
    }

    // optional password check (basic version)
    if (foundUser.password && foundUser.password !== password) {
      setError("Incorrect password. Please try again.");
      return;
    }

    localStorage.setItem("user", JSON.stringify(foundUser));

    window.dispatchEvent(new Event("userChange"));
    navigate("/profile");
  };

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: "0 auto" }}>
      <h2>Sign In</h2>

      {error && (
        <p style={{ color: "red", marginBottom: 10 }}>
          {error}
        </p>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError("");
        }}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError("");
        }}
        style={{ width: "100%", padding: 10, marginBottom: 20 }}
      />

      <button onClick={handleLogin} className="login-btn">
        Log In
      </button>
    </div>
  );
};

export default SignIn;