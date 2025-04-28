import { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

function TicketForm({ fetchTickets, editingTicket, setEditingTicket }) {
  const [text, setText] = useState("");
  const [points, setPoints] = useState("");

  useEffect(() => {
    if (editingTicket) {
      setText(editingTicket.text || "");
      setPoints(editingTicket.points || "");
    }
  }, [editingTicket]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingTicket?.id) {
        // Only update if ID is valid
        await updateDoc(doc(db, "tickets", editingTicket.id), {
          text,
          points: Number(points),
        });
        setEditingTicket(null);
      } else {
        await addDoc(collection(db, "tickets"), {
          text,
          points: Number(points),
          createdAt: new Date(),
        });
      }

      setText("");
      setPoints("");
      fetchTickets();
    } catch (err) {
      console.error("Error saving ticket:", err.message);
      alert("❌ Error saving ticket: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        rows="3"
        placeholder="Ticket Guideline"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
        style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
      />

      <input
        type="number"
        placeholder="Points"
        value={points}
        onChange={(e) => setPoints(e.target.value)}
        required
        style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
      />

      <button type="submit" style={{ padding: "10px 20px" }}>
        {editingTicket ? "Update Ticket" : "Add Ticket"}
      </button>
    </form>
  );
}

export default TicketForm;
