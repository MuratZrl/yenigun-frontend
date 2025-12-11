"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface GeoJSONMapProps {
  geoJSONData: any;
}

const GeoJSONMap: React.FC<GeoJSONMapProps> = ({ geoJSONData }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mapRef.current || !geoJSONData) return;

    if (mapInstance.current) {
      mapInstance.current.remove();
    }

    try {
      mapInstance.current = L.map(mapRef.current, {
        center: [41.0082, 28.9784],
        zoom: 6,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstance.current);

      const customIcon = L.divIcon({
        html: `
          <div style="
            background-color: #3b82f6;
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          ">
            <div style="
              transform: rotate(45deg);
              color: white;
              font-weight: bold;
              font-size: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </div>
        `,
        className: "custom-marker",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      });

      const geoJsonLayer = L.geoJSON(geoJSONData, {
        pointToLayer: (feature, latlng) => {
          return L.marker(latlng, { icon: customIcon });
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties) {
            const props = feature.properties;
            const popupContent = `
              <div style="min-width: 250px; max-width: 300px;">
                <h4 style="font-weight: bold; margin: 0 0 8px 0; color: #1f2937;">${
                  props.title || "İsimsiz İlan"
                }</h4>
                <div style="margin-bottom: 6px;">
                  <strong style="color: #059669;">💰 Fiyat:</strong> ${
                    props.price || "Belirtilmemiş"
                  }
                </div>
                <div style="margin-bottom: 6px;">
                  <strong style="color: #dc2626;">📍 Adres:</strong> ${
                    props.address || "Adres bilgisi yok"
                  }
                </div>
                ${
                  props.description
                    ? `<div style="margin-bottom: 8px; color: #4b5563; font-size: 13px;">
                        ${props.description.substring(0, 120)}...
                       </div>`
                    : ""
                }
                <a href="${
                  props.link || "#"
                }" target="_blank" style="display: inline-block; margin-top: 8px; padding: 6px 12px; background: #3b82f6; color: white; text-decoration: none; border-radius: 4px; font-size: 13px;">
                  👁️ İlanı Görüntüle
                </a>
              </div>
            `;
            layer.bindPopup(popupContent);
          }
        },
      }).addTo(mapInstance.current);

      if (geoJsonLayer.getBounds().isValid()) {
        mapInstance.current.fitBounds(geoJsonLayer.getBounds(), {
          padding: [50, 50],
          maxZoom: 15,
        });
      } else {
        mapInstance.current.setView([39.9334, 32.8597], 6);
      }

      console.log("🗺️ Harita başarıyla oluşturuldu");
    } catch (error) {
      console.error("❌ Harita oluşturulurken hata:", error);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [geoJSONData, isMounted]);

  if (!isMounted) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Harita yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default GeoJSONMap;
