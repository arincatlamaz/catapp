// Login.js
import { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signIn({
      email,
      password,
    });

    if (error) {
      setLoginError(error.message);
    } else {
      setLoginError(null);
      navigate("/dashboard");
    }
  };

  // const signupClick = async (e) => {
  //   navigate("/signup");
  // }

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={login} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      {loginError && <p className="error-message">{loginError}</p>}
      <p className="signup-or">
        Don't have an account? <Link to="/">Sign up</Link>
      </p>
    </div>
  );
}
