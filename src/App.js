import "./App.css";
import Dashboard from "./Dashboard";

function App() {
  return (
    <div className="App">
      <div
        style={{
          width: "80rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1 style={{ marginBottom: "0.5rem" }}>StreetSweep</h1>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: "1rem",
          }}
        >
          <div className="hover-btn">Upload images</div>
          <div
            className="hover-btn"
            style={{
              marginLeft: "10px",
            }}
          >
            View dashboard
          </div>
        </div>
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
