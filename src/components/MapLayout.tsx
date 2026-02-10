"use client";

import { ReactNode, useEffect } from "react";

interface MapLayoutProps {
  children: ReactNode;
}

export default function MapLayout({ children }: MapLayoutProps) {
  useEffect(() => {
    const loadCSS = () => {
      const leafletCSS = document.createElement("link");
      leafletCSS.rel = "stylesheet";
      leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      leafletCSS.integrity =
        "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      leafletCSS.crossOrigin = "";
      document.head.appendChild(leafletCSS);

      const markerClusterCSS = document.createElement("link");
      markerClusterCSS.rel = "stylesheet";
      markerClusterCSS.href =
        "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css";
      document.head.appendChild(markerClusterCSS);

      const markerClusterDefaultCSS = document.createElement("link");
      markerClusterDefaultCSS.rel = "stylesheet";
      markerClusterDefaultCSS.href =
        "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css";
      document.head.appendChild(markerClusterDefaultCSS);

      return () => {
        document.head.removeChild(leafletCSS);
        document.head.removeChild(markerClusterCSS);
        document.head.removeChild(markerClusterDefaultCSS);
      };
    };

    const cleanup = loadCSS();
    return cleanup;
  }, []);

  return <>{children}</>;
}
