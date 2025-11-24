import { useEffect, useRef, useState } from "react";
import { Marker as LeafletMarker } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type MapViewProps = {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  isEditable?: boolean;
  onLocationSelect?: (lat: number, lng: number, city?: string) => void;
};

async function reverseGeocode(lat: number, lng: number) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
    {
      headers: {
        "User-Agent": "matcha-app",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Reverse geocoding failed");
  }

  const data = await res.json();
  const cityCandidate =
    data?.address?.city ||
    data?.address?.town ||
    data?.address?.village ||
    data?.address?.municipality ||
    data?.address?.county;

  return {
    displayName: data?.display_name as string | undefined,
    city: cityCandidate as string | undefined,
  };
}

function ClickHandler({
  isEditable,
  onLocationSelect,
}: { 
  isEditable?: boolean;
  onLocationSelect?: (lat: number, lng: number, city?: string) => void;
}) {
  useMapEvents({
    async click(e) {
      if (!isEditable) {
        alert("Cannot adjust location in non-edit mode");
        return null;
      }
      if (onLocationSelect) {
        try {
          const { city } = await reverseGeocode(e.latlng.lat, e.latlng.lng);
          onLocationSelect(e.latlng.lat, e.latlng.lng, city);
        } catch {
          onLocationSelect(e.latlng.lat, e.latlng.lng, undefined);
        }
      }
    },
  });
  return null;
}

export default function MapView({
  latitude = 48.8566,
  longitude = 2.3522, 
  zoom = 13,
  isEditable = true,
  onLocationSelect
}: MapViewProps) {
  const [address, setAddress] = useState<string>("");
  const markerRef = useRef<LeafletMarker | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchAddress = async () => {
      setAddress("Loading address...");

      try {
        const data = await reverseGeocode(latitude, longitude);
        if (!cancelled) {
          setAddress(data?.displayName ?? "Address unvailable");
        }
      } catch {
        if (!cancelled) {
          setAddress("Address unvailable");
        }
      }
    };

    fetchAddress();
    return () => {
      cancelled = true;
    };
  }, [latitude, longitude]);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [latitude, longitude, address]);

  return (
    <MapContainer
      style={{ height: "450px", width: "100%" }}
      center={[latitude, longitude]}
      zoom={zoom}
      scrollWheelZoom={true}
    >
     <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
        />

      <ClickHandler 
        isEditable={isEditable}
        onLocationSelect={onLocationSelect}
      />

      <Marker position={[latitude, longitude]} ref={markerRef}>
        <Popup>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {address && (
              <span style={{ fontSize: "0.85rem", color: "#555" }}>{address}</span>
            )}
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
