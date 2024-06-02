// Login.js
import { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    const { user, error } = await supabase.auth.signIn({
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

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={login}>
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
        <button type="submit">Login</button>
      </form>
      {loginError && <p style={{ color: "red" }}>{loginError}</p>}
    </div>
  );
}
