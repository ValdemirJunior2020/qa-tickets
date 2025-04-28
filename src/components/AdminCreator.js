// src/components/AdminCreator.js
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";

function AdminCreator() {
  const [created, setCreated] = useState(false);

  const createAdminAccount = async () => {
    try {
      await createUserWithEmailAndPassword(auth, "admin@admin.com", "admin123");
      alert("Admin account created!");
      setCreated(true);
    } catch (err) {
      console.error("Error creating admin:", err.message);
      alert("Account may already exist or an error occurred.");
    }
  };

  return (
    <div style={{ margin: '30px' }}>
      {!created && (
        <button onClick={createAdminAccount} style={{ padding: '10px 20px', background: '#444', color: '#fff' }}>
          Create Admin Account
        </button>
      )}
    </div>
  );
}

export default AdminCreator;
