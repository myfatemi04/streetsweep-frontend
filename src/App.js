import { useCallback, useRef, useState } from "react";
import "./App.css";
import Dashboard from "./Dashboard";

function App() {
  const [mapCenter, setMapCenter] = useState();
  // can be "none", "submitting", "submitted", or "errored"
  const [submissionStatus, setSubmissionStatus] = useState("none");

  const onMapCenterUpdate = useCallback((center) => {
    setMapCenter(center);
  }, []);

  const imageInput = useRef();

  const submit = useCallback(() => {
    if (submissionStatus === "submitting") {
      return;
    }
    const formData = new FormData();
    formData.append("file", imageInput.current.files[0]);
    fetch(
      `http://127.0.0.1:5555/submit_photo/${mapCenter.lat},${mapCenter.lng}`,
      { mode: "no-cors", method: "post", body: formData }
    )
      .then(() => {
        setSubmissionStatus("submitted");
      })
      .catch(() => {
        console.log("Error submitting image");
        setSubmissionStatus("errored");
      });
  }, [mapCenter, submissionStatus]);

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
        <span style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
          Zoom into where you saw the trash and upload a photo.
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <input
            type="file"
            name="file"
            className="hover-btn"
            ref={imageInput}
          />
          <button
            type="submit"
            className="hover-btn"
            style={{ height: "100%" }}
            onClick={submit}
            disabled={submissionStatus === "submitting"}
          >
            {submissionStatus === "submitting"
              ? "Uploading..."
              : submissionStatus === "none"
              ? "Upload"
              : submissionStatus === "submitted"
              ? "Uploaded"
              : "Error"}
          </button>
        </div>
        <Dashboard
          onMapCenterUpdate={onMapCenterUpdate}
          submissionStatus={submissionStatus}
        />
      </div>
    </div>
  );
}

export default App;
