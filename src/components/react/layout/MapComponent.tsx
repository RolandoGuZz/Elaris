import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LOCATION_OCOTLAN = { lat: 16.793404, lng: -96.675031 };
const LOCATION_NOVA = { lat: 16.770946, lng: -96.674896 };
interface PropsMapsComponent {
  title?: string;
}

export const MapComponent = ({ title }: PropsMapsComponent) => {
  return (
    <div className="flex flex-col items-start gap-3 w-full">
      <p className="text-sm text-left font-medium dark:text-slate-300">
        {title}
      </p>
      <MapContainer
        center={[LOCATION_OCOTLAN.lat, LOCATION_OCOTLAN.lng]}
        zoom={15}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[LOCATION_NOVA.lat, LOCATION_NOVA.lng]}>
          <Popup>NovaUniversitas</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
