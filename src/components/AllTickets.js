import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, addDoc } from "firebase/firestore";

function AllTickets() {
  const [tickets, setTickets] = useState([]);
  const [checked, setChecked] = useState({});
  const [total, setTotal] = useState(0);
  const [agentName, setAgentName] = useState("");
  const [callCenter, setCallCenter] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [message, setMessage] = useState("");

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

  const handleCheck = (id, points) => {
    setChecked((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      const newTotal = tickets.reduce((sum, ticket) => {
        return sum + (updated[ticket.id] ? Number(ticket.points || 0) : 0);
      }, 0);
      setTotal(newTotal);
      return updated;
    });
  };

  const handleSave = async () => {
    if (!agentName.trim() || !callCenter.trim() || !supervisor.trim()) {
      alert("Please fill out all fields (Agent, Call Center, Supervisor).");
      return;
    }

    const selected = tickets.filter((ticket) => checked[ticket.id]);
    const data = {
      agent: agentName.trim(),
      callCenter: callCenter.trim(),
      supervisor: supervisor.trim(),
      totalScore: total,
      items: selected.map((item) => ({
        text: item.text,
        points: item.points,
        followed: true,
      })),
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, "qa_scores"), data);
      setMessage(`✅ Saved QA for ${agentName} from ${callCenter} by ${supervisor}`);
      setChecked({});
      setTotal(0);
      setAgentName("");
      setCallCenter("");
      setSupervisor("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error saving QA score:", err);
      alert("Failed to save.");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "700px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h2>📝 Ticket QA Evaluation</h2>

      <input
        type="text"
        placeholder="Enter agent name"
        value={agentName}
        onChange={(e) => setAgentName(e.target.value)}
        style={{ padding: 10, width: "100%", marginBottom: 10 }}
      />

      <input
        type="text"
        placeholder="Enter call center name"
        value={callCenter}
        onChange={(e) => setCallCenter(e.target.value)}
        style={{ padding: 10, width: "100%", marginBottom: 10 }}
      />

      <input
        type="text"
        placeholder="Enter supervisor name"
        value={supervisor}
        onChange={(e) => setSupervisor(e.target.value)}
        style={{ padding: 10, width: "100%", marginBottom: 20 }}
      />

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tickets
          .filter((ticket) =>
            ticket.text &&
            !ticket.text.toLowerCase().includes("passing score") &&
            ticket.text.toLowerCase() !== "testing"
          )
          .map((ticket) => (
            <li key={ticket.id} style={{
              marginBottom: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              backgroundColor: checked[ticket.id] ? "#e6ffe6" : "#fff4f4",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <input
                  type="checkbox"
                  checked={checked[ticket.id] || false}
                  onChange={() => handleCheck(ticket.id, ticket.points)}
                  style={{ marginTop: "4px" }}
                />
                <span>
                  <strong>✔ Did agent follow:</strong><br />
                  {ticket.text}<br />
                  <strong>Points:</strong> {ticket.points}
                </span>
              </label>
            </li>
        ))}
      </ul>

      <h3>Total Points: {total}</h3>

      <h3 style={{
        color: total >= 90 ? "green" : "red",
        fontWeight: "bold"
      }}>
        {total >= 90 ? "✅ PASS" : "❌ FAIL"}
      </h3>

      <button
        onClick={handleSave}
        style={{
          padding: "12px 24px",
          marginTop: 20,
          background: "green",
          color: "white",
          fontWeight: "bold",
          border: "none",
          borderRadius: "5px"
        }}
      >
        Save QA Score
      </button>

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  );
}

export default AllTickets;
