import GoogleMapReact from "google-map-react";
import { useState } from "react";

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

export default function Dashboard() {
  const [map, setMap] = useState();
  const center = { lat: 37.7749, lng: -122.4194 };
  const zoom = 9;
  return (
    <div
      style={{
        height: "60vh",
        width: "100%",

        borderRadius: "1rem",
        overflow: "hidden",
      }}
    >
      <GoogleMapReact
        ref={setMap}
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
      ></GoogleMapReact>
    </div>
  );
}
