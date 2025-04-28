// src/components/Dashboard.js
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { isAdminEmail } from "../utils/isAdmin";
import TicketForm from "./TicketForm";
import TicketList from "./TicketList";
import LogoutButton from "./LogoutButton";

function Dashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [reloadSignal, setReloadSignal] = useState(0);

  const fetchTickets = () => {
    setReloadSignal(prev => prev + 1);
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user && isAdminEmail(user.email)) {
      setIsAdmin(true);
    }
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Welcome, {auth.currentUser?.email}</h2>
      <LogoutButton />

      <TicketList
        setEditingTicket={setEditingTicket}
        fetchTicketsSignal={reloadSignal}
      />

      {isAdmin && (
        <TicketForm
          fetchTickets={fetchTickets}
          editingTicket={editingTicket}
          setEditingTicket={setEditingTicket}
        />
      )}
    </div>
  );
}

export default Dashboard;
