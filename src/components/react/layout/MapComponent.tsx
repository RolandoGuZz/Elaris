import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { useFormContext } from "react-hook-form";
import type { LatLngExpression } from "leaflet";
import type { FormGetToken } from "../core/types/IFormGetToken";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { LatLng } from "leaflet";

const DEFAULT_LOCATION: LatLngExpression = [16.793404, -96.675031];

interface PropsMapsComponent {
  title?: string;
  name?: "identification.address" | "responsible.address";
}

interface Coordinates {
  lat: number;
  lng: number;
}

const MapClickHandler = ({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click: (e: { latlng: LatLng }) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export const MapComponent = ({ title, name }: PropsMapsComponent) => {
  const { setValue, watch } = useFormContext<FormGetToken>();
  const [selectedPosition, setSelectedPosition] =
    useState<LatLngExpression | null>(null);

  useEffect(() => {
    if (name) {
      const currentValue = watch(name as keyof FormGetToken) as unknown as
        | Coordinates
        | undefined;
      if (currentValue && currentValue.lat && currentValue.lng) {
        setSelectedPosition([currentValue.lat, currentValue.lng]);
      }
    }
  }, [name, watch]);

  const handleLocationSelect = (lat: number, lng: number) => {
    const coordinates: Coordinates = { lat, lng };
    console.log("Coordenadas: " + lat + " ____" + lng);
    setSelectedPosition([lat, lng]);
    if (name) {
      setValue(name as keyof FormGetToken, coordinates);
    }
  };

  const markerIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className="flex flex-col items-start gap-3 w-full">
      <p className="text-sm text-left font-medium dark:text-slate-300">
        {title}
      </p>
      <MapContainer
        center={DEFAULT_LOCATION}
        zoom={15}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onLocationSelect={handleLocationSelect} />
        {selectedPosition && (
          <Marker position={selectedPosition} icon={markerIcon}>
            <Popup>Ubicación seleccionada</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};
