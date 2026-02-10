import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Polygon,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

const libraries: ("places" | "drawing" | "geometry")[] = [
  "places",
  "drawing",
  "geometry",
];

const options = {
  disableDefaultUI: true,
  zoomControl: true,
  minZoom: 8,
  maxZoom: 20,
};

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 38.9637,
  lng: 35.2433,
};

interface MarkerType {
  lat: number;
  lng: number;
  time?: Date;
}

interface BoundaryCoord {
  lat: number;
  lng: number;
}

interface AdminGoogleMapsProps {
  markers: MarkerType[];
  setMarkers: (markers: MarkerType[]) => void;
  boundaryCoords?: BoundaryCoord[];
}

export default function AdminGoogleMaps({
  markers,
  setMarkers,
  boundaryCoords,
}: AdminGoogleMapsProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDL9J82iDhcUWdQiuIvBYa0t5asrtz3Swk",
    libraries,
  });

  const mapRef = React.useRef<google.maps.Map | null>(null);

  // Sadece mavi sınır çizgisi göster
  const boundaryLineOptions = React.useMemo(() => {
    return {
      fillOpacity: 0.5,
      strokeColor: "#2563EB",
      strokeOpacity: 1,
      strokeWeight: 3,
      clickable: false,
      draggable: false,
      editable: false,
      geodesic: false,
      zIndex: 1,
    };
  }, []);

  const onMapClick = React.useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newMarker: MarkerType = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
          time: new Date(),
        };
        setMarkers([newMarker]);
        if (mapRef.current) {
          mapRef.current.setZoom(18);
        }
      }
    },
    [setMarkers]
  );

  const onMapLoad = React.useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(
    ({ lat, lng }: { lat: number; lng: number }) => {
      if (mapRef.current) {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(16);
        setMarkers([
          {
            lat,
            lng,
            time: new Date(),
          },
        ]);
      }
    },
    [setMarkers]
  );

  const handleMarkerClick = React.useCallback((marker: MarkerType) => {
    if (mapRef.current) {
      mapRef.current.setZoom(19);
      mapRef.current.panTo({ lat: marker.lat, lng: marker.lng });
    }
  }, []);

  // Boundary değiştiğinde haritayı sınırlara fit et
  React.useEffect(() => {
    if (boundaryCoords && boundaryCoords.length > 0 && mapRef.current) {
      const bounds = new google.maps.LatLngBounds();
      boundaryCoords.forEach((coord) => {
        bounds.extend({ lat: coord.lat, lng: coord.lng });
      });
      mapRef.current.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      });
    }
  }, [boundaryCoords]);

  React.useEffect(() => {
    if (
      validMarkers.length > 0 &&
      mapRef.current &&
      (!boundaryCoords || boundaryCoords.length === 0)
    ) {
      mapRef.current.setZoom(16);
    }
  }, [markers]);

  const validMarkers = markers.filter(
    (marker) =>
      marker &&
      typeof marker.lat === "number" &&
      typeof marker.lng === "number" &&
      !isNaN(marker.lat) &&
      !isNaN(marker.lng) &&
      marker.lat >= -90 &&
      marker.lat <= 90 &&
      marker.lng >= -180 &&
      marker.lng <= 180
  );
  const center =
    validMarkers.length > 0
      ? { lat: validMarkers[0].lat, lng: validMarkers[0].lng }
      : defaultCenter;

  const initialZoom = validMarkers.length > 0 ? 16 : 15;

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="relative w-full">
      {/* Arama ve Konum butonları */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Search panTo={panTo} />
        <Locate panTo={panTo} />

        {/* Zoom kontrol butonları */}
        <div className="flex gap-2">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg transition-colors duration-200 font-medium flex items-center gap-2"
            onClick={() => {
              if (mapRef.current) {
                const currentZoom = mapRef.current.getZoom() || initialZoom;
                mapRef.current.setZoom(currentZoom + 1);
              }
            }}
          >
            <span>➕</span>
            Yakınlaş
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg transition-colors duration-200 font-medium flex items-center gap-2"
            onClick={() => {
              if (mapRef.current) {
                const currentZoom = mapRef.current.getZoom() || initialZoom;
                mapRef.current.setZoom(Math.max(8, currentZoom - 1));
              }
            }}
          >
            <span>➖</span>
            Uzaklaş
          </button>
        </div>
      </div>

      {/* Harita Container */}
      <div
        className="relative rounded-lg overflow-hidden border border-gray-300 shadow-sm"
        style={{ height: "324px" }}
      >
        <GoogleMap
          id="map"
          mapContainerStyle={mapContainerStyle}
          zoom={initialZoom}
          center={center}
          options={options}
          onClick={onMapClick}
          onLoad={onMapLoad}
        >
          {validMarkers.map((marker, index) => (
            <Marker
              key={
                marker.time
                  ? `${marker.lat}-${marker.lng}-${marker.time.getTime()}`
                  : `marker-${index}`
              }
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => handleMarkerClick(marker)}
              animation={google.maps.Animation.DROP}
            />
          ))}

          {/* İlçe sınır çizgisi */}
          {boundaryCoords && boundaryCoords.length > 0 && (
            <Polygon paths={boundaryCoords} options={boundaryLineOptions} />
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

function Locate({
  panTo,
}: {
  panTo: (coords: { lat: number; lng: number }) => void;
}) {
  return (
    <button
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium whitespace-nowrap flex items-center gap-2 justify-center"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null,
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      }}
    >
      <span>📍</span>
      Konumumu Bul
    </button>
  );
}

function Search({
  panTo,
}: {
  panTo: (coords: { lat: number; lng: number }) => void;
}) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: new google.maps.LatLng(38.9637, 35.2433),
      radius: 100 * 1000,
    },
    debounce: 300,
  });

  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    setShowSuggestions(false);

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleFocus = () => {
    if (value) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="search relative flex-1">
      <input
        value={value}
        onChange={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={!ready}
        className="py-2 px-4 w-full bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-md transition-colors duration-200"
        placeholder="Herhangi bir yer arayın..."
      />

      {showSuggestions && status === "OK" && (
        <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
          {data.map(({ place_id, description }) => (
            <div
              key={place_id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
              onClick={() => handleSelect(description)}
              onMouseDown={(e) => e.preventDefault()}
            >
              {description}
            </div>
          ))}
        </div>
      )}

      {showSuggestions && status === "ZERO_RESULTS" && (
        <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1">
          <div className="px-4 py-2 text-gray-500">Sonuç bulunamadı</div>
        </div>
      )}
    </div>
  );
}
