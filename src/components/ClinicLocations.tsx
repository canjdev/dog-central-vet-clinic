import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 14.2118, // Approximate latitude for Calamba, Laguna
  lng: 121.1653, // Approximate longitude for Calamba, Laguna
};

const locations = [
  {
    name: "Branch 1",
    position: { lat: 14.2118, lng: 121.1653 },
    address: "55W6+CPH, Chipeco Ave, Calamba, 4027 Laguna",
  },
  {
    name: "Branch 2",
    position: { lat: 14.2087, lng: 121.1525 },
    address: "225 San Juan Rd, Calamba, 4027 Laguna",
  },
  {
    name: "Branch 3",
    position: { lat: 14.2131, lng: 121.1667 },
    address: "Calamba, 4027 Laguna",
  },
];

export function ClinicLocations() {
  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={location.position}
            title={`${location.name}: ${location.address}`}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
