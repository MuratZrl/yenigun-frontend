"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";

// Marker icon URL'leri
const markerIcon2x = "/leaflet/marker-icon-2x.png";
const markerIcon = "/leaflet/marker-icon.png";
const markerShadow = "/leaflet/marker-shadow.png";

// Marker icon fix
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface GeoJSONProperties {
  id: number;
  title: string;
  price: string;
  address: string;
  description: string;
  details: any;
  category: string;
  type: string;
  subType: string;
  link: string;
  photos: string[];
  advisor?: any;
  district?: string;
}

interface GeoJSONFeature {
  type: "Feature";
  properties: GeoJSONProperties;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

interface PropertyMapProps {
  geoJSONData: GeoJSONFeatureCollection;
  initialCenter?: [number, number];
  initialZoom?: number;
  showControls?: boolean;
  onMarkerClick?: (property: GeoJSONProperties) => void;
}

const PropertyMap = ({
  geoJSONData,
  initialCenter = [40.7569, 30.3783],
  initialZoom = 11,
  showControls = true,
  onMarkerClick,
}: PropertyMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Harita başlatma
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Harita oluştur
    mapRef.current = L.map(containerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: showControls,
    });

    // Tile layer ekle
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 19,
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Marker'ları ekle
  useEffect(() => {
    if (!mapRef.current || !geoJSONData) return;

    // Önceki marker'ları temizle
    markersRef.current.forEach((marker) => {
      mapRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Her feature için marker oluştur
    geoJSONData.features.forEach((feature) => {
      const { coordinates } = feature.geometry;
      const properties = feature.properties;

      // Marker ikonu (kategoriye göre renk)
      const getMarkerColor = (category: string) => {
        switch (category.toLowerCase()) {
          case "arsa":
            return "#22c55e";
          case "konut":
            return "#3b82f6";
          case "işyeri":
            return "#f59e0b";
          case "villa":
            return "#ef4444";
          case "tarla":
            return "#10b981";
          case "apartman":
            return "#8b5cf6";
          case "daire":
            return "#06b6d4";
          default:
            return "#8b5cf6";
        }
      };

      // Özel marker ikonu
      const customIcon = L.divIcon({
        html: `
          <div class="custom-marker" style="background-color: ${getMarkerColor(
            properties.category
          )}">
            <div class="marker-content">${properties.price.split(" ")[0]}</div>
          </div>
        `,
        className: "custom-div-icon",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      // Marker oluştur
      const marker = L.marker([coordinates[1], coordinates[0]], {
        icon: customIcon,
        title: properties.title,
      });

      // Popup içeriği
      const popupContent = `
        <div class="property-popup">
          <h3 class="font-bold">${properties.title}</h3>
          <p class="text-green-600 font-bold">${properties.price}</p>
          <p class="text-sm text-gray-600">${properties.address}</p>
          <a href="${properties.link}" class="block mt-2 text-blue-600 hover:text-blue-800">
            İlanı Gör →
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);

      // Marker'ı haritaya ekle
      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
    });

    // Marker'lara göre zoom yap
    if (geoJSONData.features.length > 0) {
      const bounds = L.latLngBounds(
        geoJSONData.features.map((f) => [
          f.geometry.coordinates[1],
          f.geometry.coordinates[0],
        ])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [geoJSONData]);

  return <div ref={containerRef} className="w-full h-[600px] rounded-lg" />;
};

export default PropertyMap;
