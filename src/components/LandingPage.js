import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div style={{
      textAlign: "center",
      padding: "50px",
      fontFamily: "Arial, sans-serif"
    }}>
      {/* 🔥 Logo */}
      <img src="/logo.png" alt="Logo" style={logoStyle} />

      <h1>📞 Call Center QA Portal</h1>
      <p style={{ fontSize: "18px", marginTop: "20px" }}>
        Welcome to the Quality Assurance system for call center agents.<br />
        Login to evaluate tickets or review performance by call center.
      </p>

      <div style={{
        marginTop: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        alignItems: "center"
      }}>
        <Link to="/login">
          <button style={buttonStyle}>🔐 Agent Login</button>
        </Link>

        <Link to="/view-scores">
          <button style={{ ...buttonStyle, backgroundColor: "#28a745" }}>
            📊 View QA Results
          </button>
        </Link>
      </div>
    </div>
  );
}

const logoStyle = {
    maxWidth: "200px",
    height: "auto",
    display: "block",
    margin: "0 auto 30px auto",
    objectFit: "contain"
  };
  

const buttonStyle = {
  backgroundColor: "#007bff",
  color: "white",
  padding: "12px 24px",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
  cursor: "pointer"
};

export default LandingPage;
