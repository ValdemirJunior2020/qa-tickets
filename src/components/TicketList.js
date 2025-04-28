// src/components/TicketList.js
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { isAdminEmail } from "../utils/isAdmin";

function TicketList({ setEditingTicket, fetchTicketsSignal }) {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    const snapshot = await getDocs(collection(db, "tickets"));
    setTickets(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    fetchTickets();
  }, [fetchTicketsSignal]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "tickets", id));
    fetchTickets();
  };

  const isAdmin = isAdminEmail(auth.currentUser?.email);

  return (
    <div style={{ marginTop: 30 }}>
      <h3>Ticket Guidelines</h3>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id} style={{ marginBottom: 10 }}>
            {ticket.text}
            {isAdmin && (
              <>
                <button onClick={() => setEditingTicket(ticket)} style={{ marginLeft: 10 }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(ticket.id)} style={{ marginLeft: 10 }}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TicketList;
    