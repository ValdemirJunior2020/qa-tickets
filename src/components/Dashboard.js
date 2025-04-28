import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc
} from "firebase/firestore";

function Dashboard({ user }) {
  const [tickets, setTickets] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const allowedEditors = ["infojr.83@gmail.com", "karen@hotelplanner.com"];
  const canEdit = user && allowedEditors.includes(user.email);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tickets"), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTickets(items);
    });

    return () => unsub();
  }, []);

  const handleDelete = async (id) => {
    if (!canEdit) return;
    await deleteDoc(doc(db, "tickets", id));
  };

  const handleEdit = (ticket) => {
    setEditingId(ticket.id);
    setEditText(ticket.text);
  };

  const handleSave = async (id) => {
    if (!editText.trim()) return;
    await updateDoc(doc(db, "tickets", id), { text: editText });
    setEditingId(null);
    setEditText("");
  };

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Welcome, {user?.email}</h2>

      {/* Navigation Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "30px" }}>
        <Link to="/tickets">
          <button style={buttonStyle}>📝 Go to Evaluation</button>
        </Link>

        {user?.email === "infojr.83@gmail.com" && (
          <Link to="/manage-users">
            <button style={{ ...buttonStyle, backgroundColor: "#6f42c1" }}>
              👥 Manage User Roles
            </button>
          </Link>
        )}
      </div>

      {/* Ticket Guidelines List */}
      <h2 style={{ marginTop: "40px" }}>📋 Ticket Guidelines</h2>

      <ul style={{ paddingLeft: "20px" }}>
        {tickets.map((ticket) => (
          <li key={ticket.id} style={{ marginBottom: "10px" }}>
            {editingId === ticket.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{ padding: "6px", width: "400px" }}
                />
                <button onClick={() => handleSave(ticket.id)} style={{ marginLeft: "10px" }}>Save</button>
                <button onClick={() => setEditingId(null)} style={{ marginLeft: "5px" }}>Cancel</button>
              </>
            ) : (
              <>
                • {ticket.text}
                {canEdit && (
                  <>
                    <button onClick={() => handleEdit(ticket)} style={{ marginLeft: "10px" }}>Edit</button>
                    <button onClick={() => handleDelete(ticket.id)} style={{ marginLeft: "5px" }}>Delete</button>
                  </>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: "#007bff",
  color: "#fff",
  padding: "12px 20px",
  fontSize: "16px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default Dashboard;
