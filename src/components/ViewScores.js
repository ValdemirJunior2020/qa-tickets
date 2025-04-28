import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

function ViewScores() {
  const [callCenters, setCallCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [scores, setScores] = useState([]);

  // Fetch all call centers from saved QA scores
  useEffect(() => {
    const fetchCallCenters = async () => {
      const snapshot = await getDocs(collection(db, "qa_scores"));
      const allScores = snapshot.docs.map(doc => doc.data());

      // Extract unique call centers
      const centers = [...new Set(allScores.map(score => score.callCenter?.trim()))];
      setCallCenters(centers);
    };

    fetchCallCenters();
  }, []);

  // Fetch scores for the selected call center
  useEffect(() => {
    const fetchScores = async () => {
      if (!selectedCenter) return;
      const q = query(
        collection(db, "qa_scores"),
        where("callCenter", "==", selectedCenter)
      );
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => doc.data());
      setScores(results);
    };

    fetchScores();
  }, [selectedCenter]);

  // Download CSV
  const downloadCSV = () => {
    if (scores.length === 0) return;

    const header = ["Agent", "Call Center", "Supervisor", "Total Score"];
    const rows = scores.map(score =>
      [score.agent, score.callCenter, score.supervisor, score.totalScore]
    );

    const csvContent =
      [header, ...rows]
        .map(e => e.map(v => `"${v}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `qa_scores_${selectedCenter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "30px" }}>
      <h2>📊 QA Scores by Call Center</h2>

      {callCenters.length === 0 ? (
        <p>Loading call centers...</p>
      ) : (
        <>
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
            <button
              onClick={downloadCSV}
              style={{
                marginBottom: "15px",
                padding: "10px 20px",
                background: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              📥 Download CSV
            </button>
          )}

          {scores.length === 0 && selectedCenter ? (
            <p>No scores found for {selectedCenter}</p>
          ) : (
            <table border="1" width="100%" cellPadding="10">
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Call Center</th>
                  <th>Supervisor</th>
                  <th>Total Score</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score, idx) => (
                  <tr key={idx}>
                    <td>{score.agent}</td>
                    <td>{score.callCenter}</td>
                    <td>{score.supervisor}</td>
                    <td>{score.totalScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default ViewScores;
