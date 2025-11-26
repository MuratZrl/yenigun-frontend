"use client";
import { useEffect, useState } from "react";

interface MapComponentProps {
  lat: number | string | undefined;
  lng: number | string | undefined;
  address: string;
}

const MapComponent = ({ lat, lng, address }: MapComponentProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-96 w-full rounded-xl bg-gray-200 flex items-center justify-center">
        <div className="text-gray-500">Harita yükleniyor...</div>
      </div>
    );
  }

  // Dynamic import ile gerekli modülleri yükle
  const L = require("leaflet");
  const { MapContainer, TileLayer, Marker, Popup } = require("react-leaflet");

  // Marker icon sorununu çöz
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });

  // Koordinatları güvenli şekilde sayıya dönüştür
  const safeLat =
    typeof lat === "string"
      ? parseFloat(lat)
      : typeof lat === "number"
      ? lat
      : 0;
  const safeLng =
    typeof lng === "string"
      ? parseFloat(lng)
      : typeof lng === "number"
      ? lng
      : 0;

  // Geçerli koordinatları kontrol et
  const isValidCoordinate =
    !isNaN(safeLat) && !isNaN(safeLng) && safeLat !== 0 && safeLng !== 0;

  const position: [number, number] = isValidCoordinate
    ? [safeLat, safeLng]
    : [41.0082, 28.9784]; // Varsayılan İstanbul koordinatları

  return (
    <div className="h-96 w-full rounded-xl overflow-hidden border border-gray-200">
      {isValidCoordinate ? (
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <div className="text-sm">
                <strong>Konum</strong>
                <br />
                {address}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-500">
            <p>Harita bilgisi bulunamadı</p>
            <p className="text-sm mt-2">Adres: {address}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
