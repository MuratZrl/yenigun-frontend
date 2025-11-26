import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

const libraries: "places"[] = ["places"];

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

// Harita boyutunu düzelt - 100vh yerine sabit yükseklik
const mapContainerStyle = {
  width: "100%",
  height: "500px", // Sabit yükseklik
};

const center = {
  lat: 38.9637,
  lng: 35.2433,
};

export default function AdminGoogleMaps({ markers, setMarkers }: any) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDL9J82iDhcUWdQiuIvBYa0t5asrtz3Swk",
    libraries,
  });

  const [selected, setSelected] = React.useState(null);
  const mapRef = React.useRef<google.maps.Map | null>(null);

  const onMapClick = React.useCallback(
    (e: any) => {
      setMarkers([
        {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
          time: new Date(),
        },
      ]);
    },
    [setMarkers]
  );

  const onMapLoad = React.useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(
    ({ lat, lng }: any) => {
      if (mapRef.current) {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(14);
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

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="relative w-full">
      {/* Arama ve Konum butonları */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Search panTo={panTo} />
        <Locate panTo={panTo} />
      </div>

      {/* Harita Container - Taşmayı önleyen stiller */}
      <div
        className="relative rounded-lg overflow-hidden border border-gray-300 shadow-sm"
        style={{ height: "324px" }}
      >
        <GoogleMap
          id="map"
          mapContainerStyle={mapContainerStyle}
          zoom={8}
          center={center}
          options={options}
          onClick={onMapClick}
          onLoad={onMapLoad}
        >
          {markers.map((marker: any) => (
            <Marker
              key={`${marker.lat}-${marker.lng}`}
              position={{ lat: marker.lat, lng: marker.lng }}
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
}

function Locate({ panTo }: any) {
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
          () => null
        );
      }}
    >
      <span>📍</span>
      Konumumu Bul
    </button>
  );
}

function Search({ panTo }: any) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 43.6532, lng: () => -79.3832 } as any,
      radius: 100 * 1000,
    },
    debounce: 300,
  });

  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const handleInput = (e: any) => {
    setValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleSelect = async (address: any) => {
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
          {data.map(({ place_id, description }: any) => (
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
