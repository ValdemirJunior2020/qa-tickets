import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";

function ManageUsers({ user }) {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(list);
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, role: newRole } : u
        )
      );
      setMessage(`✅ Updated role to '${newRole}'`);
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Failed to update role");
    }
  };

  // ✅ Restrict to only infojr.83@gmail.com
  if (!user || user.email !== "infojr.83@gmail.com") {
    return (
      <h2 style={{ textAlign: "center", marginTop: "100px", color: "red" }}>
        ⛔ Access Denied: Only infojr.83@gmail.com can assign roles.
      </h2>
    );
  }

  return (
    <div style={{ padding: 30, maxWidth: 800, margin: "auto" }}>
      <h2>👥 Manage User Roles</h2>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table border="1" width="100%" cellPadding="10">
          <thead>
            <tr>
              <th>Email</th>
              <th>Current Role</th>
              <th>Set Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.role || "agent"}</td>
                <td>
                  <select
                    value={u.role || "agent"}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  >
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {message && <p style={{ marginTop: 15 }}>{message}</p>}
    </div>
  );
}

export default ManageUsers;
