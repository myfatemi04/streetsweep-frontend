import GoogleMapReact from "google-map-react";
import React, {
  useEffect,
  useRef,
  useLayoutEffect,
  useState,
  useMemo,
} from "react";
import { getSubmissions } from "./api";
import getMostLikelyClassNames from "./getMostLikelyClassNames";

// function generatePositions() {
//   const positions = [];
//   for (let i = 0; i < 20; i++) {
//     positions.push({
//       lat: Math.random() * 0.3 + 37.7749,
//       lng: Math.random() * 0.3 + -122.4194,
//     });
//   }
//   return positions;
// }

// const positions = getSubmissions(); // generatePositions();

const numFormat = new Intl.NumberFormat("en-US", {
  maximumSignificantDigits: 4,
});

// https://www.npmjs.com/package/google-map-react
// https://zjor.medium.com/heatmaps-with-google-map-react-57e279315060
export default function Dashboard({ onMapCenterUpdate, submissionStatus }) {
  const mapRef = useRef();
  const center = { lat: 37.7749, lng: -122.4194 };
  const zoom = 9;
  const [northEast, setNorthEast] = useState();
  const [southWest, setSouthWest] = useState();
  const [submissions, setPositions] = useState([]);

  useEffect(() => {
    getSubmissions().then((submissions) => {
      setPositions(submissions);
    });
  }, [submissionStatus]);

  useLayoutEffect(() => {
    if (!mapRef.current) return;

    const listeners = [];

    function setup() {
      const map = mapRef.current.map_;
      if (!map) {
        console.log("No map");
        setTimeout(setup, 100);
        return;
      }

      if (listeners.length > 0) {
        return;
      }

      let previousMapBoundsChangedCallTime = 0;
      let previousCenterChangedCallTime = 0;

      const mapBoundsChangedListener = () => {
        const currentCallTime = new Date().getTime();
        if (currentCallTime - previousMapBoundsChangedCallTime < 200) {
          return;
        }

        const bounds = map.getBounds();
        const northEast = bounds.getNorthEast();
        const southWest = bounds.getSouthWest();

        setNorthEast(northEast.toJSON());
        setSouthWest(southWest.toJSON());

        previousMapBoundsChangedCallTime = currentCallTime;
      };

      const centerChangedListener = () => {
        const currentCallTime = new Date().getTime();
        if (currentCallTime - previousCenterChangedCallTime < 200) {
          return;
        }

        onMapCenterUpdate(map.getCenter().toJSON());
      };

      centerChangedListener();
      mapBoundsChangedListener();

      listeners.push(
        map.addListener("center_changed", mapBoundsChangedListener)
      );
      listeners.push(map.addListener("center_changed", centerChangedListener));
      listeners.push(map.addListener("zoom_changed", mapBoundsChangedListener));
    }

    setup();

    return () => {
      listeners.forEach((listener) => listener.remove());
    };
  }, [onMapCenterUpdate]);

  const visibleSubmissions = useMemo(() => {
    if (!northEast || !southWest) {
      return submissions;
    }

    return submissions.filter(
      (submission) =>
        submission.lat > southWest.lat &&
        submission.lat < northEast.lat &&
        submission.lng > southWest.lng &&
        submission.lng < northEast.lng
    );
  }, [northEast, southWest, submissions]);

  useLayoutEffect(() => {
    if (!mapRef.current) {
      return;
    }

    function setup() {
      const map = mapRef.current.map_;
      if (!map) {
        console.log("No map");
        setTimeout(setup, 100);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setCenter({ lat: latitude, lng: longitude });
        },
        () => {}
      );
    }

    setup();
  }, []);

  const visibleMostLikelyClassNames = useMemo(() => {
    if (!visibleSubmissions.length) {
      return [];
    }

    return visibleSubmissions.map((v) =>
      getMostLikelyClassNames(v.class_likelihoods)
    );
  }, [visibleSubmissions]);

  const totalGarbage = useMemo(() => {
    let count = 0;
    visibleMostLikelyClassNames.forEach((classNames) => {
      count += classNames.length;
    });
    return count;
  }, [visibleMostLikelyClassNames]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          height: "60vh",
          width: "60vw",
          minWidth: "30rem",
          marginBottom: "1rem",

          borderRadius: "1rem",
          overflow: "hidden",
        }}
      >
        <GoogleMapReact
          ref={mapRef}
          bootstrapURLKeys={{ key: "AIzaSyDUnWIrt-H4RuP2YFLpVPz4oAjBhpOOoyI" }}
          defaultCenter={center}
          defaultZoom={zoom}
          heatmapLibrary={true}
          heatmap={{
            positions: submissions.map((submission) => ({
              lat: submission.lat,
              lng: submission.lng,
            })),
            options: {
              radius: 20,
              opacity: 0.7,
            },
          }}
          onClick={() => {}}
        />
      </div>
      <div>
        {totalGarbage} instance
        {totalGarbage !== 1 ? "s" : ""} of garbage found in this area.
        <br />
        <br />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {visibleSubmissions.map((submission, idx) => {
            const classNamesByCount = {};

            for (const className of visibleMostLikelyClassNames[idx]) {
              classNamesByCount[className] =
                (classNamesByCount[className] || 0) + 1;
            }

            const numUniqueClassnames = Object.keys(classNamesByCount).length;

            return (
              <div
                key={`${submission.lat}:${submission.lng}:${idx}`}
                style={{ fontSize: "1rem" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ marginBottom: "0.5rem" }}>
                    <b>
                      {numFormat.format(submission.lat)},{" "}
                      {numFormat.format(submission.lng)}
                    </b>{" "}
                    at {new Date(submission.timestamp).toLocaleString()}
                  </span>
                  <b>Detections</b>
                  <ul style={{ marginTop: 0, textAlign: "left" }}>
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
                      marginBottom: "1rem",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
