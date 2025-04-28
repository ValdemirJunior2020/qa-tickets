import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Try logging in first
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (loginErr) {
      // If login fails, try creating the user (sign-up)
      if (loginErr.code === "auth/user-not-found") {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          navigate("/dashboard");
        } catch (signupErr) {
          setError("Signup failed: " + signupErr.message);
        }
      } else {
        setError("Login failed: " + loginErr.message);
      }
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Agent Login</h2>
      <form onSubmit={handleLogin} style={{ maxWidth: 400, margin: "0 auto" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 10, marginBottom: 10, width: "100%" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: 10, marginBottom: 10, width: "100%" }}
        />
        <br />
        <button type="submit" style={{ padding: 10, width: "100%" }}>
          Login or Sign Up
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
    </div>
  );
}

export default Login;
