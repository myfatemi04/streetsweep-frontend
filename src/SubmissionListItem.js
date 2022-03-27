import { useMemo, useState } from "react";
import getMostLikelyClassNames from "./getMostLikelyClassNames";

const numFormat = new Intl.NumberFormat("en-US", {
  maximumSignificantDigits: 4,
});

export default function SubmissionListItem({ submission }) {
  const mostLikelyClassNames = useMemo(
    () => getMostLikelyClassNames(submission.class_likelihoods),
    [submission.class_likelihoods]
  );

  const classNamesByCount = {};

  for (const className of mostLikelyClassNames) {
    classNamesByCount[className] = (classNamesByCount[className] || 0) + 1;
  }

  const numUniqueClassnames = Object.keys(classNamesByCount).length;

  const [showImage, setShowImage] = useState(false);

  return (
    <div style={{ fontSize: "1rem" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <button
          onClick={() => setShowImage(!showImage)}
          style={{ fontSize: "1rem" }}
        >
          <b>
            {numFormat.format(submission.lat)},{" "}
            {numFormat.format(submission.lng)}
          </b>{" "}
          at {new Date(submission.timestamp).toLocaleString()}
        </button>
        {showImage && (
          <div style={{ padding: "0.5rem", textAlign: "left" }}>
            <b>Detections</b>
            <ul style={{ marginTop: 0 }}>
              {Object.keys(classNamesByCount).map((className, idx) => (
                <li key={className}>
                  <span key={className}>
                    {className}
                    {classNamesByCount[className] > 1 &&
                      ` (x${classNamesByCount[className]})`}
                  </span>
                  {idx + 1 < numUniqueClassnames && ", "}
                </li>
              ))}
            </ul>
            <img
              src={`http://127.0.0.1:5555/annotations/${submission.id}.jpg`}
              alt=""
              style={{
                maxWidth: "20rem",
                borderRadius: "0.5rem",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
