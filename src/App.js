import "./App.css";
import Dashboard from "./Dashboard";

function App() {
  return (
    <div className="App">
      <div
        style={{
          width: "80vw",
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
          <form
            method="post"
            action="http://127.0.0.1:5000/submit_photo"
            encType="multipart/form-data"
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <input type="file" name="file" className="hover-btn" />
            <input name="lat" type="hidden" value="37.7749" />
            <input name="lon" type="hidden" value="-122.4194" />
            <button
              type="submit"
              className="hover-btn"
              style={{ height: "100%" }}
            >
              Upload
            </button>
          </form>
        </div>
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
