import GoogleMapReact from "google-map-react";
import { useEffect, useRef, useState, useMemo } from "react";

function generatePositions() {
  const positions = [];
  for (let i = 0; i < 20; i++) {
    positions.push({
      lat: Math.random() * 0.3 + 37.7749,
      lng: Math.random() * 0.3 + -122.4194,
    });
  }
  return positions;
}

const positions = generatePositions();

// https://www.npmjs.com/package/google-map-react
// https://zjor.medium.com/heatmaps-with-google-map-react-57e279315060
export default function Dashboard() {
  const mapRef = useRef();
  const center = { lat: 37.7749, lng: -122.4194 };
  const zoom = 9;
  const [northEast, setNorthEast] = useState();
  const [southWest, setSouthWest] = useState();

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.map_;

    if (!map) {
      return;
    }

    let previousCallTime = 0;

    const mapBoundsChangedListener = () => {
      const currentCallTime = new Date().getTime();

      if (currentCallTime - previousCallTime < 200) {
        return;
      }

      const bounds = map.getBounds();
      const northEast = bounds.getNorthEast();
      const southWest = bounds.getSouthWest();

      setNorthEast(northEast.toJSON());
      setSouthWest(southWest.toJSON());

      previousCallTime = currentCallTime;
    };

    map.addListener("center_changed", mapBoundsChangedListener);
    map.addListener("zoom_changed", mapBoundsChangedListener);

    return () => {
      map.removeListener("center_changed", mapBoundsChangedListener);
      map.removeListener("zoom_changed", mapBoundsChangedListener);
    };
  }, [mapRef]);

  const visiblePositions = useMemo(() => {
    if (!northEast || !southWest) {
      return positions;
    }

    return positions.filter(
      (position) =>
        position.lat > southWest.lat &&
        position.lat < northEast.lat &&
        position.lng > southWest.lng &&
        position.lng < northEast.lng
    );
  }, [northEast, southWest]);

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
            positions,
            options: {
              radius: 20,
              opacity: 0.7,
            },
          }}
          onClick={() => {}}
        />
      </div>
      <p>{visiblePositions.length} instances of garbage found in this area.</p>
    </div>
  );
}
