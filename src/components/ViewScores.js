import { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function ViewScores({ user }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [callCenters, setCallCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [scores, setScores] = useState([]);

  // 🔐 Check admin role from Firestore
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user?.uid) return;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data().role === "admin") {
        setIsAdmin(true);
      }
    };
    checkAdmin();
  }, [user?.uid]);

  // 🏢 Load call centers
  useEffect(() => {
    const fetchCallCenters = async () => {
      const snapshot = await getDocs(collection(db, "qa_scores"));
      const allScores = snapshot.docs.map(doc => doc.data());
      const centers = [...new Set(allScores.map(score => score.callCenter?.trim()))];
      setCallCenters(centers);
    };
    fetchCallCenters();
  }, []);

  // 📥 Load scores
  useEffect(() => {
    const fetchScores = async () => {
      if (!selectedCenter) return;
      const q = query(collection(db, "qa_scores"), where("callCenter", "==", selectedCenter));
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => doc.data());
      setScores(results);
    };
    fetchScores();
  }, [selectedCenter]);

  const downloadCSV = () => {
    if (scores.length === 0) return;
    const header = ["Agent", "Call Center", "Supervisor", "Total Score", "Date"];
    const rows = scores.map(score =>
      [score.agent, score.callCenter, score.supervisor, score.totalScore, new Date(score.createdAt?.seconds * 1000).toLocaleDateString()]
    );
    const csvContent = [header, ...rows].map(e => e.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `qa_scores_${selectedCenter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    const input = document.getElementById("score-table");
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10);
      pdf.save(`qa_scores_${selectedCenter}.pdf`);
    });
  };

  if (!isAdmin) {
    return <h2 style={{ color: "red", textAlign: "center" }}>⛔ Access Denied: Admins Only</h2>;
  }

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "30px" }}>
      <h2>📊 QA Scores by Call Center</h2>

      <select
        value={selectedCenter}
        onChange={(e) => setSelectedCenter(e.target.value)}
        style={{ padding: "10px", marginBottom: "20px", width: "100%" }}
      >
        <option value="">Select a call center</option>
        {callCenters.map((center, index) => (
          <option key={index} value={center}>{center}</option>
        ))}
      </select>

      {scores.length > 0 && (
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <button
            onClick={downloadCSV}
            style={{ padding: "10px 20px", background: "#007bff", color: "#fff", border: "none", borderRadius: "4px" }}
          >📥 Download CSV</button>
          <button
            onClick={downloadPDF}
            style={{ padding: "10px 20px", background: "#28a745", color: "#fff", border: "none", borderRadius: "4px" }}
          >📄 Download PDF</button>
        </div>
      )}

      {scores.length === 0 && selectedCenter ? (
        <p>No scores found for {selectedCenter}</p>
      ) : (
        <table id="score-table" border="1" width="100%" cellPadding="10">
          <thead>
            <tr>
              <th>Agent</th>
              <th>Call Center</th>
              <th>Supervisor</th>
              <th>Total Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, idx) => (
              <tr key={idx}>
                <td>{score.agent}</td>
                <td>{score.callCenter}</td>
                <td>{score.supervisor}</td>
                <td style={{ color: score.totalScore >= 90 ? "green" : "red", fontWeight: "bold" }}>{score.totalScore}</td>
                <td>{new Date(score.createdAt?.seconds * 1000).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ViewScores;
