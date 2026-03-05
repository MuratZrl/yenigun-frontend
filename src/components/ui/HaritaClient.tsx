"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  Polygon,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  fetchDistrictFromOverpass,
  BoundaryCoord,
} from "@/utils/districtBoundary";

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
  height: "600px",
};

const defaultCenter = {
  lat: 40.6937,
  lng: 30.4353,
};

interface Address {
  mapCoordinates: {
    lat: number;
    lng: number;
  };
  full_address: string;
  district: string;
  province: string;
  quarter: string;
  parcel?: string;
}

interface PropertyListing {
  _id: string;
  uid: number;
  address: Address;
  title: string;
  fee: string;
  thoughts: string;
  photos: string[];
  categoryId: string;
  steps: {
    first: string;
    second: string;
  };
  details?: {
    netArea?: number;
    grossArea?: number;
  };
}

interface MapProps {
  listings?: PropertyListing[];
  boundaryCoords?: Array<{ lat: number; lng: number }>;
  selectedDistrict?: string;
  selectedProvince?: string;
}

interface MarkerInfo {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  fee: string;
  address: Address;
  thoughts: string;
  photo: string;
  type: string;
  area?: number;
}

export default function PropertyMap({
  listings = [],
  boundaryCoords: propBoundaryCoords,
  selectedDistrict,
  selectedProvince,
}: MapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDL9J82iDhcUWdQiuIvBYa0t5asrtz3Swk",
    libraries,
  });

  const [markers, setMarkers] = useState<MarkerInfo[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerInfo | null>(null);
  const [infoImgError, setInfoImgError] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [activeBoundaryCoords, setActiveBoundaryCoords] = useState<
    BoundaryCoord[]
  >([]);
  const mapRef = React.useRef<google.maps.Map | null>(null);

  useEffect(() => { setInfoImgError(false); }, [selectedMarker]);

  const boundaryLineOptions = useMemo(() => {
    return {
      fillOpacity: 0.1,
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
  useEffect(() => {
    if (propBoundaryCoords && propBoundaryCoords.length > 0) {
      setActiveBoundaryCoords(propBoundaryCoords);
    }
  }, [propBoundaryCoords]);

  useEffect(() => {
    const loadBoundary = async () => {
      if (selectedProvince && selectedDistrict) {
        const coords = await fetchDistrictFromOverpass(
          selectedDistrict,
          selectedProvince
        );
        if (coords) {
          setActiveBoundaryCoords(coords);
        }
      } else if (!propBoundaryCoords || propBoundaryCoords.length === 0) {
        setActiveBoundaryCoords([]);
      }
    };

    loadBoundary();
  }, [selectedProvince, selectedDistrict, propBoundaryCoords]);

  useEffect(() => {
    if (listings && listings.length > 0) {
      const processedMarkers = listings
        .filter(
          (listing) =>
            listing.address?.mapCoordinates &&
            typeof listing.address.mapCoordinates.lat === "number" &&
            typeof listing.address.mapCoordinates.lng === "number" &&
            !isNaN(listing.address.mapCoordinates.lat) &&
            !isNaN(listing.address.mapCoordinates.lng) &&
            listing.address.mapCoordinates.lat >= -90 &&
            listing.address.mapCoordinates.lat <= 90 &&
            listing.address.mapCoordinates.lng >= -180 &&
            listing.address.mapCoordinates.lng <= 180
        )
        .map((listing) => ({
          id: listing._id || `marker-${listing.uid}`,
          position: listing.address.mapCoordinates,
          title: listing.title || "İsimsiz İlan",
          fee: listing.fee || "Fiyat Belirtilmemiş",
          address: listing.address,
          thoughts: listing.thoughts || "",
          photo: listing.photos?.[0] || "",
          type: `${listing.steps?.first || ""} ${listing.steps?.second || ""
            }`.trim(),
          area: listing.details?.netArea || listing.details?.grossArea,
        }));

      setMarkers(processedMarkers);

      if (selectedDistrict && processedMarkers.length > 0) {
        const districtMarker =
          processedMarkers.find(
            (m) => m.address.district === selectedDistrict
          ) || processedMarkers[0];
        setMapCenter(districtMarker.position);
      } else if (processedMarkers.length > 0) {
        const avgLat =
          processedMarkers.reduce((sum, m) => sum + m.position.lat, 0) /
          processedMarkers.length;
        const avgLng =
          processedMarkers.reduce((sum, m) => sum + m.position.lng, 0) /
          processedMarkers.length;
        setMapCenter({ lat: avgLat, lng: avgLng });
      }
    }
  }, [listings, selectedDistrict, selectedProvince]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleMarkerClick = useCallback((marker: MarkerInfo) => {
    setSelectedMarker(marker);
    if (mapRef.current) {
      mapRef.current.panTo(marker.position);
      mapRef.current.setZoom(16);
    }
  }, []);

  const fitToBounds = useCallback(() => {
    if (mapRef.current && markers.length > 0) {
      const bounds = new google.maps.LatLngBounds();

      markers.forEach((marker) => {
        bounds.extend(marker.position);
      });

      if (activeBoundaryCoords && activeBoundaryCoords.length > 0) {
        activeBoundaryCoords.forEach((coord) => {
          bounds.extend(coord);
        });
      }

      mapRef.current.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      });
    }
  }, [markers, activeBoundaryCoords]);

  useEffect(() => {
    if (markers.length > 0 && mapRef.current) {
      if (markers.length === 1) {
        mapRef.current.setCenter(markers[0].position);
        mapRef.current.setZoom(16);
      } else {
        fitToBounds();
      }
    }
  }, [markers, fitToBounds]);

  useEffect(() => {
    if (activeBoundaryCoords && activeBoundaryCoords.length > 0 && mapRef.current) {
      const bounds = new google.maps.LatLngBounds();
      activeBoundaryCoords.forEach((coord) => {
        bounds.extend(coord);
      });
      mapRef.current.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      });
    }
  }, [activeBoundaryCoords]);

  const renderAddress = useCallback((address: Address) => {
    if (!address) return "Adres bilgisi yok";

    let fullAddress = address.full_address;

    if (fullAddress && typeof fullAddress === "object") {
      const addrObj = fullAddress as any;
      fullAddress =
        addrObj.full_address ||
        `${addrObj.province || ""}, ${addrObj.district || ""}, ${addrObj.quarter || ""
        }`;
    }

    return (
      fullAddress ||
      `${address.province || ""}, ${address.district || ""}, ${address.quarter || ""
      }`
    );
  }, []);

  if (loadError) return <div>Harita yüklenirken hata oluştu</div>;
  if (!isLoaded) return <div>Harita yükleniyor...</div>;

  return (
    <div className="w-full">
      {/* Kontroller - AdminGoogleMap ile aynı stil */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <Search panTo={(coords) => setMapCenter(coords)} />
        <Locate panTo={(coords) => setMapCenter(coords)} />
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-300 shadow-lg">
        <GoogleMap
          id="property-map"
          mapContainerStyle={mapContainerStyle}
          zoom={selectedDistrict ? 14 : 12}
          center={mapCenter}
          options={options}
          onLoad={onMapLoad}
        >
          {activeBoundaryCoords && activeBoundaryCoords.length > 0 && (
            <Polygon paths={activeBoundaryCoords} options={boundaryLineOptions} />
          )}

          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              onClick={() => handleMarkerClick(marker)}
              animation={google.maps.Animation.DROP}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                scaledSize: new google.maps.Size(40, 40),
              }}
            />
          ))}

          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="p-3 max-w-xs">
                <div className="mb-2">
                  {selectedMarker.photo && (
                    <Image
                      src={infoImgError ? "https://via.placeholder.com/300x200?text=Resim+Yok" : selectedMarker.photo}
                      alt={selectedMarker.title}
                      width={300}
                      height={160}
                      className="w-full h-40 object-cover rounded-lg mb-2"
                      onError={() => setInfoImgError(true)}
                      unoptimized
                    />
                  )}
                </div>
                <h3 className="font-bold text-lg mb-1 text-gray-800">
                  {selectedMarker.title}
                </h3>
                <p className="text-red-600 font-bold text-xl mb-2">
                  {selectedMarker.fee}
                </p>

                <div className="text-gray-600 text-sm mb-3 space-y-1">
                  <p className="font-medium">
                    {renderAddress(selectedMarker.address)}
                  </p>
                  {selectedMarker.address.parcel && (
                    <p className="text-xs">
                      <span className="font-semibold">Parsel:</span>{" "}
                      {selectedMarker.address.parcel}
                    </p>
                  )}
                  <p className="text-xs">
                    <span className="font-semibold">Konum:</span>{" "}
                    {selectedMarker.address.quarter},{" "}
                    {selectedMarker.address.district},{" "}
                    {selectedMarker.address.province}
                  </p>
                </div>

                {selectedMarker.area && (
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Alan:</span>{" "}
                    {selectedMarker.area} m²
                  </p>
                )}

                {selectedMarker.thoughts && (
                  <p className="text-gray-600 text-sm italic border-t pt-2 mt-2">
                    "{selectedMarker.thoughts}"
                  </p>
                )}

                <button
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors duration-200"
                  onClick={() => {
                    window.open(`/ads/${selectedMarker.id}`, "_blank");
                  }}
                >
                  İlanı Görüntüle
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
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
      location: new google.maps.LatLng(40.6937, 30.4353),
      radius: 100 * 1000,
    },
    debounce: 300,
  });

  const [showSuggestions, setShowSuggestions] = useState(false);

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
    <div className="relative flex-1">
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
      <span></span>
      Konumumu Bul
    </button>
  );
}
