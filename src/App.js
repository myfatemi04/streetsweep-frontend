import { useCallback, useState } from "react";
import "./App.css";
import Dashboard from "./Dashboard";

function App() {
  const [mapCenter, setMapCenter] = useState();

  const onMapCenterUpdate = useCallback((center) => {
    setMapCenter(center);
  }, []);

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
            action={
              mapCenter
                ? `http://127.0.0.1:5000/submit_photo/${mapCenter.lat},${mapCenter.lng}`
                : ""
            }
            encType="multipart/form-data"
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <input type="file" name="file" className="hover-btn" />
            <button
              type="submit"
              className="hover-btn"
              style={{ height: "100%" }}
            >
              Upload
            </button>
          </form>
        </div>
        <Dashboard onMapCenterUpdate={onMapCenterUpdate} />
      </div>
    </div>
  );
}

export default App;
