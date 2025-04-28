import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AllTickets from "./components/AllTickets";
// import './scripts/seedTickets'; // ✅ REMOVE this after running once

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets" element={<AllTickets />} />
        {/* Optional: You can add a default route or 404 page here */}
      </Routes>
    </Router>
  );
}

export default App;
