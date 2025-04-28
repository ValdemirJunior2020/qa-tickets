import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AllTickets from "./components/AllTickets";
import ViewScores from "./components/ViewScores";
import ManageUsers from "./components/ManageUsers";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // null to avoid flashing
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setRole(docSnap.data().role);
        } else {
          // default to agent if no role found
          setRole("agent");
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "100px" }}>
        🔄 Loading...
      </h2>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard user={user} role={role} />} />
        <Route path="/tickets" element={<AllTickets user={user} role={role} />} />
        <Route path="/view-scores" element={<ViewScores user={user} role={role} />} />
        <Route path="/manage-users" element={<ManageUsers user={user} role={role} />} />
      </Routes>
    </Router>
  );
}

export default App;
