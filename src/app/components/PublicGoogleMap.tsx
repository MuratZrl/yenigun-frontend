"use client";
import React from "react";
import {
    GoogleMap,
    useLoadScript,
    Marker,
    Polygon,
} from "@react-google-maps/api";
import {
    fetchDistrictFromOverpass,
    BoundaryCoord,
} from "@/app/utils/districtBoundary";

const libraries: ("places" | "drawing" | "geometry")[] = [
    "places",
    "drawing",
    "geometry",
];

const options = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: true,
    fullscreenControl: true,
    minZoom: 8,
    maxZoom: 20,
};

const mapContainerStyle = {
    width: "100%",
    height: "100%",
};

interface PublicGoogleMapProps {
    lat: number;
    lng: number;
    province?: string;
    district?: string;
}

export default function PublicGoogleMap({
    lat,
    lng,
    province,
    district,
}: PublicGoogleMapProps) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyDL9J82iDhcUWdQiuIvBYa0t5asrtz3Swk",
        libraries,
    });

    const mapRef = React.useRef<google.maps.Map | null>(null);
    const [boundaryCoords, setBoundaryCoords] = React.useState<BoundaryCoord[]>(
        []
    );

    // Sadece mavi sınır çizgisi göster
    const boundaryLineOptions = React.useMemo(() => {
        return {
            fillOpacity: 0.1, // Hafif bir dolgu
            fillColor: "#2563EB",
            strokeColor: "#2563EB",
            strokeOpacity: 0.8,
            strokeWeight: 3,
            clickable: false,
            draggable: false,
            editable: false,
            geodesic: false,
            zIndex: 1,
        };
    }, []);

    const onMapLoad = React.useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    React.useEffect(() => {
        const loadBoundary = async () => {
            if (province && district) {
                const coords = await fetchDistrictFromOverpass(district, province);
                if (coords) {
                    setBoundaryCoords(coords);
                }
            }
        };

        loadBoundary();
    }, [province, district]);

    React.useEffect(() => {
        if (mapRef.current) {
            if (boundaryCoords.length > 0) {
                const bounds = new google.maps.LatLngBounds();
                boundaryCoords.forEach((coord) => {
                    bounds.extend({ lat: coord.lat, lng: coord.lng });
                });
                bounds.extend({ lat, lng });

                mapRef.current.fitBounds(bounds, {
                    top: 50,
                    right: 50,
                    bottom: 50,
                    left: 50,
                });
            } else {
                mapRef.current.panTo({ lat, lng });
                mapRef.current.setZoom(15);
            }
        }
    }, [boundaryCoords, lat, lng]);

    if (loadError) return <div>Harita yüklenirken hata oluştu</div>;
    if (!isLoaded)
        return (
            <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-gray-500">Harita yükleniyor...</div>
            </div>
        );

    return (
        <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200">
            <GoogleMap
                id="public-map"
                mapContainerStyle={mapContainerStyle}
                zoom={15}
                center={{ lat, lng }}
                options={options}
                onLoad={onMapLoad}
            >
                <Marker position={{ lat, lng }} animation={google.maps.Animation.DROP} />

                {boundaryCoords.length > 0 && (
                    <Polygon paths={boundaryCoords} options={boundaryLineOptions} />
                )}
            </GoogleMap>
        </div>
    );
}
