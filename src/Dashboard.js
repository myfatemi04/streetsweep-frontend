import GoogleMapReact from "google-map-react";
import { useEffect, useRef, useLayoutEffect, useState, useMemo } from "react";
import { getSubmissions } from "./api";

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

// https://www.npmjs.com/package/google-map-react
// https://zjor.medium.com/heatmaps-with-google-map-react-57e279315060
export default function Dashboard({ onMapCenterUpdate }) {
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
  }, []);

  useLayoutEffect(() => {
    if (!mapRef.current) return;

    const listeners = [];
    let foundMap = null;

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

      foundMap = map;

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

      map.addListener("center_changed", mapBoundsChangedListener);
      map.addListener("center_changed", centerChangedListener);
      map.addListener("zoom_changed", mapBoundsChangedListener);

      listeners.push(mapBoundsChangedListener);
      listeners.push(centerChangedListener);
    }

    setup();

    return () => {
      if (foundMap) {
        foundMap.removeListener("center_changed", listeners[0]);
        foundMap.removeListener("center_changed", listeners[1]);
        foundMap.removeListener("zoom_changed", listeners[0]);
      }
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

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          height: "60vh",
          width: "60vw",
          minWidth: "30rem",

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
      <p>
        {visibleSubmissions.length} instance
        {visibleSubmissions.length !== 1 ? "s" : ""} of garbage found in this
        area.
      </p>
    </div>
  );
}
