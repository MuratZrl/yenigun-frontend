// src/components/PublicGoogleMap.tsx
"use client";

import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Polygon,
  InfoWindow,
} from "@react-google-maps/api";
import {
  fetchDistrictFromOverpass,
  BoundaryCoord,
} from "@/utils/districtBoundary";
import {
  Navigation,
  X,
  Filter,
  School,
  Building,
  Trees,
  Coffee,
  ShoppingBag,
} from "lucide-react";

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

interface NearbyPlace {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  rating?: number;
  address?: string;
  distance?: number;
}

type PlaceCategory =
  | "education"
  | "health"
  | "park"
  | "food"
  | "shopping"
  | "all";

const PLACE_TYPES: Record<PlaceCategory, string[]> = {
  education: ["school", "university", "library", "book_store", "museum"],
  health: ["hospital", "pharmacy", "doctor", "dentist"],
  park: ["park", "gym", "stadium"],
  food: ["restaurant", "cafe", "bakery"],
  shopping: ["shopping_mall", "convenience_store", "supermarket"],
  all: [
    "school",
    "hospital",
    "park",
    "restaurant",
    "cafe",
    "shopping_mall",
    "pharmacy",
    "gym",
  ],
};

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
  const [nearbyPlaces, setNearbyPlaces] = React.useState<NearbyPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = React.useState<NearbyPlace | null>(
    null
  );
  const [showMainMarkerInfo, setShowMainMarkerInfo] = React.useState(false);
  const [showEnvironmentPanel, setShowEnvironmentPanel] = React.useState(false);
  const [isLoadingPlaces, setIsLoadingPlaces] = React.useState(false);

  const [selectedCategory, setSelectedCategory] =
    React.useState<PlaceCategory>("all");
  const [directionsService, setDirectionsService] =
    React.useState<google.maps.DirectionsService | null>(null);

  const boundaryLineOptions = React.useMemo(() => {
    return {
      fillOpacity: 0.1,
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
    setDirectionsService(new google.maps.DirectionsService());
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

        mapRef.current.fitBounds(bounds, 50);
      } else {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(15);
      }
    }
  }, [boundaryCoords, lat, lng]);

  React.useEffect(() => {
    const loadNearbyPlaces = async () => {
      if (!isLoaded || !mapRef.current) return;

      setIsLoadingPlaces(true);
      try {
        const service = new google.maps.places.PlacesService(mapRef.current);
        const types = PLACE_TYPES[selectedCategory];

        const request: google.maps.places.PlaceSearchRequest = {
          location: new google.maps.LatLng(lat, lng),
          radius: 2000,
        };

        const primaryType = types[0];

        service.nearbySearch(
          { ...request, type: primaryType },
          (results, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              results
            ) {
              const places: NearbyPlace[] = results
                .slice(0, 20)
                .map((place, index) => {
                  let placeType = "unknown";
                  for (const type of types) {
                    if (place.types?.includes(type)) {
                      placeType = type;
                      break;
                    }
                  }
                  if (
                    placeType === "unknown" &&
                    place.types &&
                    place.types.length > 0
                  ) {
                    placeType = place.types[0];
                  }

                  return {
                    id: place.place_id || `place_${index}`,
                    name: place.name || "İsimsiz",
                    lat: place.geometry?.location?.lat() || lat,
                    lng: place.geometry?.location?.lng() || lng,
                    type: placeType,
                    rating: place.rating,
                    address: place.vicinity,
                  };
                })
                .filter((place) => place.type !== "unknown");

              setNearbyPlaces(places);
            }
            setIsLoadingPlaces(false);
          }
        );
      } catch (error) {
        console.error("Yakın yerler yüklenirken hata:", error);
        setIsLoadingPlaces(false);
      }
    };

    if (isLoaded) {
      loadNearbyPlaces();
    }
  }, [isLoaded, lat, lng, selectedCategory]);

  const getMarkerIcon = (type: string) => {
    const colors: Record<string, string> = {
      school: "#4F46E5",
      university: "#7C3AED",
      library: "#8B5CF6",
      book_store: "#A78BFA",
      museum: "#C4B5FD",

      hospital: "#EF4444",
      pharmacy: "#F87171",
      doctor: "#FCA5A5",
      dentist: "#FECACA",

      park: "#10B981",
      gym: "#34D399",
      stadium: "#6EE7B7",

      restaurant: "#F59E0B",
      cafe: "#FBBF24",
      bakery: "#FCD34D",

      shopping_mall: "#EC4899",
      convenience_store: "#F472B6",
      supermarket: "#F9A8D4",
    };

    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: colors[type] || "#6B7280",
      fillOpacity: 1,
      strokeWeight: 1.5,
      strokeColor: "#FFFFFF",
      scale: 8,
    };
  };

  const translateType = (type: string) => {
    const translations: Record<string, string> = {
      school: "Okul",
      university: "Üniversite",
      library: "Kütüphane",
      book_store: "Kitapçı",
      museum: "Müze",

      hospital: "Hastane",
      pharmacy: "Eczane",
      doctor: "Doktor",
      dentist: "Dişçi",

      park: "Park",
      gym: "Spor Salonu",
      stadium: "Stadyum",

      restaurant: "Restoran",
      cafe: "Kafe",
      bakery: "Fırın",

      shopping_mall: "AVM",
      convenience_store: "Market",
      supermarket: "Süpermarket",
    };
    return translations[type] || type;
  };

  const getCategoryIcon = (category: PlaceCategory) => {
    switch (category) {
      case "education":
        return <School size={18} />;
      case "health":
        return <Building size={18} />;
      case "park":
        return <Trees size={18} />;
      case "food":
        return <Coffee size={18} />;
      case "shopping":
        return <ShoppingBag size={18} />;
      default:
        return <Filter size={18} />;
    }
  };

  const getGoogleMapsDirectionsUrl = () => {
    const destination = `${lat},${lng}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
  };

  const handleGetDirections = () => {
    const url = getGoogleMapsDirectionsUrl();
    window.open(url, "_blank", "noopener,noreferrer");
  };

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
        <Marker
          position={{ lat, lng }}
          animation={google.maps.Animation.DROP}
          icon={{
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new google.maps.Size(40, 40),
          }}
          onClick={() => setShowMainMarkerInfo(true)}
        />

        {boundaryCoords.length > 0 && (
          <Polygon paths={boundaryCoords} options={boundaryLineOptions} />
        )}

        {nearbyPlaces.map((place) => (
          <Marker
            key={place.id}
            position={{ lat: place.lat, lng: place.lng }}
            icon={getMarkerIcon(place.type)}
            onClick={() => setSelectedPlace(place)}
          />
        ))}

        {selectedPlace && (
          <InfoWindow
            position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div className="p-3 max-w-xs">
              <h3 className="font-bold text-lg text-gray-800">
                {selectedPlace.name}
              </h3>
              {selectedPlace.address && (
                <p className="text-sm text-gray-600 mt-1">
                  {selectedPlace.address}
                </p>
              )}
              <div className="mt-2">
                <div className="flex items-center mb-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {translateType(selectedPlace.type)}
                  </span>
                  {selectedPlace.rating && (
                    <div className="flex items-center ml-2">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="font-medium">
                        {selectedPlace.rating}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <div className="absolute top-14 right-2 flex flex-col gap-2">
        <button
          onClick={() => setShowEnvironmentPanel(!showEnvironmentPanel)}
          className="bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
          title="Çevre Bilgisi"
        >
          {showEnvironmentPanel ? (
            <X size={20} className="text-gray-700" />
          ) : (
            <p>Çevre Bilgisi</p>
          )}
        </button>

        <button
          onClick={handleGetDirections}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          title="Yol Tarifi Al"
        >
          <Navigation size={20} />
          <span className="text-sm font-medium">Yol Tarifi</span>
        </button>
      </div>

      <div
        className={`absolute top-4 right-4 bg-white rounded-lg shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          showEnvironmentPanel
            ? "w-80 h-[calc(100%-2rem)] opacity-100"
            : "w-0 h-0 opacity-0"
        }`}
        style={{ marginTop: "110px" }}
      >
        {showEnvironmentPanel && (
          <div className="h-60 flex flex-col">
            <div className="shrink-0 p-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Çevre Bilgisi</h3>
                <button
                  onClick={() => setShowEnvironmentPanel(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <div className="mb-3">
                <div className="space-y-1.5">
                  {Object.entries({
                    education: "Eğitim",
                    health: "Sağlık",
                    park: "Park & Spor",
                    food: "Yiyecek & İçecek",
                    shopping: "Alışveriş",
                    all: "Tümü",
                  }).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key as PlaceCategory)}
                      className={`w-full flex items-center justify-between p-1.5 rounded-md ${
                        selectedCategory === key
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`p-1 rounded mr-1.5 ${
                            selectedCategory === key
                              ? "bg-blue-100"
                              : "bg-gray-100"
                          }`}
                        >
                          {getCategoryIcon(key as PlaceCategory)}
                        </div>
                        <span className="text-xs font-medium">{label}</span>
                      </div>
                      {selectedCategory === key && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {isLoadingPlaces && (
                <div className="mb-4 text-center py-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-xs text-gray-500 mt-1">
                    Yerler yükleniyor...
                  </p>
                </div>
              )}

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Yakın Yerler:</p>
                {nearbyPlaces.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">
                      Bu kategoride yer bulunamadı
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {nearbyPlaces.map((place) => (
                      <div
                        key={place.id}
                        className="flex items-start p-2 hover:bg-gray-50 rounded-lg cursor-pointer border border-transparent hover:border-gray-200"
                        onClick={() => setSelectedPlace(place)}
                      >
                        <div
                          className="w-3 h-3 rounded-full mt-1 mr-2 shrink-0"
                          style={{
                            backgroundColor: getMarkerIcon(place.type)
                              .fillColor as string,
                          }}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {place.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {translateType(place.type)}
                          </p>
                          {place.address && (
                            <p className="text-xs text-gray-400 mt-0.5 truncate">
                              {place.address}
                            </p>
                          )}
                          {place.rating && (
                            <div className="flex items-center mt-1">
                              <span className="text-yellow-500 mr-0.5 text-xs">
                                ★
                              </span>
                              <span className="text-xs font-medium">
                                {place.rating}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
