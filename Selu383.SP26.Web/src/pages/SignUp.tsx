import "./signup.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");

  const navigate = useNavigate();

  const handleSignup = () => {
    const cleanedPhone = phone.replace(/\D/g, "");

    if (cleanedPhone.length !== 10) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    const newUser = {
      name: name || "User",
      email,
      password,
      phone: cleanedPhone,
      birthday,
    };

    const updatedUsers = [...existingUsers, newUser];

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("user", JSON.stringify(newUser));

    window.dispatchEvent(new Event("userChange"));
    navigate("/profile");
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="tel"
        placeholder="Phone Number (10 digits)"
        value={phone}
        onChange={(e) => {
          const onlyNumbers = e.target.value.replace(/\D/g, "");
          setPhone(onlyNumbers.slice(0, 10));
        }}
      />

      <input
        type="date"
        value={birthday}
        onChange={(e) => setBirthday(e.target.value)}
      />

      <button onClick={handleSignup}>
        Sign Up
      </button>
    </div>
  );
};

export default SignUp;