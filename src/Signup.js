// Signup.js
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import './Signup.css';

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupError, setSignupError] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();

  const signup = async (e) => {
    e.preventDefault();
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setSignupError(error.message);
      setSignupSuccess(false);
    } else {
      setSignupError(null);
      setSignupSuccess(true);
    }
  };

  useEffect(() => {
    if (signupSuccess) {
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  }, [signupSuccess, navigate]);

  return (
    <div className="signup-container">
      <h2 className="signup-title">Signup</h2>
      <form onSubmit={signup} className="signup-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="signup-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="signup-input"
        />
        <button type="submit" className="signup-button">Signup</button>
      </form>
      {signupError && <p className="error-message">{signupError}</p>}
      {signupSuccess && <p className="success-message">Registered successfully!</p>}
      <button onClick={() => navigate("/login")} className="login-button">Go to Login</button>
    </div>
  );
}
