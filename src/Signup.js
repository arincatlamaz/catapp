// Signup.js
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h2>Signup</h2>
      <form onSubmit={signup}>
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
        <button type="submit">Signup</button>
      </form>
      {signupError && <p style={{ color: "red" }}>{signupError}</p>}
      {signupSuccess && <p style={{ color: "green" }}>Registered successfully!</p>}
    </div>
  );
}
