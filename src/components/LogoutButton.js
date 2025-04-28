// src/components/LogoutButton.js
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <button onClick={handleLogout} style={{ marginTop: 20 }}>
      Logout
    </button>
  );
}

export default LogoutButton;
