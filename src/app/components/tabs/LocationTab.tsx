"use client";
import React from "react";
import { motion } from "framer-motion";
import { MapPin, Hash } from "lucide-react";
import { FormData } from "@/app/types/property";
import Select from "react-select";
import SimpleInput from "@/app/components/ui/SimpleInput";
import AdminGoogleMap from "@/app/components/layout/AdminGoogleMap";

interface LocationTabProps {
  fourthStep: FormData;
  marker: any[];
  setMarker: (markers: any[]) => void;
  onProvinceChange: (value: any) => void;
  onDistrictChange: (value: any) => void;
  onQuarterChange: (value: any) => void;
  onAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onParselChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  turkeyCities: any[];
}

interface BoundaryCoord {
  lat: number;
  lng: number;
}

export default function LocationTab({
  fourthStep,
  marker,
  setMarker,
  onProvinceChange,
  onDistrictChange,
  onQuarterChange,
  onAddressChange,
  onParselChange,
  turkeyCities,
}: LocationTabProps) {
  const [boundaryCoords, setBoundaryCoords] = React.useState<BoundaryCoord[]>([]);
  const [isLoadingBoundary, setIsLoadingBoundary] = React.useState(false);

  const getSafeAddress = (address: any): string => {
    if (!address) return "";

    if (typeof address === "string") {
      return address;
    }

    if (typeof address === "object") {
      console.warn(
        "⚠️ Adres alanı obje içeriyor, string'e çevriliyor:",
        address
      );

      if (address.lat && address.lng) {
        return `Konum: ${address.lat}, ${address.lng}`;
      }

      return "";
    }

    return String(address);
  };

  // Overpass API ile mahalle sınırlarını çek
  const fetchFromOverpass = async (quarter: string, district: string, province: string): Promise<BoundaryCoord[] | null> => {
    try {
      // Overpass API sorgusu - admin_level 9 veya 10 mahalle seviyesidir
      const overpassQuery = `
        [out:json][timeout:25];
        area["name"="${province}"]["admin_level"="4"]->.province;
        area["name"="${district}"]["admin_level"~"6|7"]->.district;
        (
          relation["name"~"${quarter}"]["boundary"="administrative"](area.district);
          relation["name"~"${quarter}"]["admin_level"~"9|10"](area.district);
          way["name"~"${quarter}"]["boundary"="administrative"](area.district);
        );
        out geom;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: `data=${encodeURIComponent(overpassQuery)}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const data = await response.json();
      
      if (data.elements && data.elements.length > 0) {
        // İlk uygun elementi bul
        for (const element of data.elements) {
          if (element.type === 'relation' && element.members) {
            // Relation'dan outer way'leri al
            const outerWays = element.members
              .filter((m: any) => m.type === 'way' && (m.role === 'outer' || m.role === ''))
              .map((m: any) => m.geometry)
              .filter((g: any) => g);
            
            if (outerWays.length > 0) {
              const coords: BoundaryCoord[] = [];
              outerWays.forEach((way: any[]) => {
                way.forEach((point: any) => {
                  coords.push({ lat: point.lat, lng: point.lon });
                });
              });
              if (coords.length > 0) return coords;
            }
          } else if (element.type === 'way' && element.geometry) {
            return element.geometry.map((point: any) => ({
              lat: point.lat,
              lng: point.lon,
            }));
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Overpass API hatası:", error);
      return null;
    }
  };

  // Nominatim API ile mahalle sınırlarını çek (yedek)
  const fetchFromNominatim = async (quarter: string, district: string, province: string): Promise<BoundaryCoord[] | null> => {
    try {
      // Farklı arama stratejileri dene
      const searchQueries = [
        `${quarter} mahallesi, ${district}, ${province}`,
        `${quarter}, ${district}, ${province}`,
        `${quarter} mh., ${district}`,
      ];

      for (const searchQuery of searchQueries) {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&polygon_geojson=1&addressdetails=1&limit=5&countrycodes=tr`,
          {
            headers: {
              'Accept-Language': 'tr',
              'User-Agent': 'YenigunEmlak/1.0'
            }
          }
        );

        const data = await response.json();

        // En uygun sonucu bul (suburb, neighbourhood, quarter tipi)
        const relevantResult = data.find((item: any) => 
          item.geojson && 
          (item.geojson.type === 'Polygon' || item.geojson.type === 'MultiPolygon') &&
          (item.type === 'suburb' || item.type === 'neighbourhood' || item.type === 'quarter' || item.type === 'administrative')
        ) || data.find((item: any) => 
          item.geojson && 
          (item.geojson.type === 'Polygon' || item.geojson.type === 'MultiPolygon')
        );

        if (relevantResult && relevantResult.geojson) {
          const geojson = relevantResult.geojson;
          
          if (geojson.type === 'Polygon') {
            return geojson.coordinates[0].map((coord: number[]) => ({
              lat: coord[1],
              lng: coord[0],
            }));
          } else if (geojson.type === 'MultiPolygon') {
            // Tüm polygonları birleştir veya en büyüğünü al
            let allCoords: BoundaryCoord[] = [];
            geojson.coordinates.forEach((polygon: number[][][]) => {
              const polygonCoords = polygon[0].map((coord: number[]) => ({
                lat: coord[1],
                lng: coord[0],
              }));
              if (polygonCoords.length > allCoords.length) {
                allCoords = polygonCoords;
              }
            });
            return allCoords;
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Nominatim API hatası:", error);
      return null;
    }
  };

  // Google Maps Geocoding API'den viewport ile dikdörtgen sınır oluştur
  const fetchFromGoogleViewport = async (quarter: string, district: string, province: string): Promise<BoundaryCoord[] | null> => {
    try {
      const searchQuery = `${quarter}, ${district}, ${province}, Türkiye`;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchQuery)}&key=AIzaSyDL9J82iDhcUWdQiuIvBYa0t5asrtz3Swk`
      );
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        
        // Viewport varsa kullan
        if (result.geometry && result.geometry.viewport) {
          const viewport = result.geometry.viewport;
          const ne = viewport.northeast;
          const sw = viewport.southwest;
          
          // Viewport'tan dikdörtgen oluştur
          return [
            { lat: ne.lat, lng: sw.lng },
            { lat: ne.lat, lng: ne.lng },
            { lat: sw.lat, lng: ne.lng },
            { lat: sw.lat, lng: sw.lng },
            { lat: ne.lat, lng: sw.lng }, // Kapatmak için
          ];
        }
      }
      return null;
    } catch (error) {
      console.error("Google Viewport hatası:", error);
      return null;
    }
  };

  // Mahalle sınırlarını çekmek için ana fonksiyon
  const fetchNeighborhoodBoundary = async (quarter: string, district: string, province: string) => {
    setIsLoadingBoundary(true);
    setBoundaryCoords([]);
    
    try {
      console.log("📍 Mahalle sınırları aranıyor:", quarter, district, province);
      
      // 1. Önce Nominatim'i dene (daha hızlı)
      let coords = await fetchFromNominatim(quarter, district, province);
      
      if (coords && coords.length > 3) {
        console.log("✅ Nominatim'den sınırlar bulundu:", coords.length, "nokta");
        setBoundaryCoords(coords);
        return;
      }

      // 2. Overpass API'yi dene
      coords = await fetchFromOverpass(quarter, district, province);
      
      if (coords && coords.length > 3) {
        console.log("✅ Overpass'tan sınırlar bulundu:", coords.length, "nokta");
        setBoundaryCoords(coords);
        return;
      }

      // 3. Google viewport kullan (son çare - dikdörtgen)
      coords = await fetchFromGoogleViewport(quarter, district, province);
      
      if (coords && coords.length > 0) {
        console.log("✅ Google viewport'tan sınırlar oluşturuldu");
        setBoundaryCoords(coords);
        return;
      }

      // 4. Hiçbir şey bulunamazsa marker etrafında alan çiz
      console.log("⚠️ Sınır bulunamadı, varsayılan alan çiziliyor");
      if (marker.length > 0) {
        const center = { lat: marker[0].lat, lng: marker[0].lng };
        const defaultBoundary = generateCircleCoords(center, 800);
        setBoundaryCoords(defaultBoundary);
      }
    } catch (error) {
      console.error("❌ Mahalle sınırları alınırken hata:", error);
    } finally {
      setIsLoadingBoundary(false);
    }
  };

  // Daire koordinatları oluşturma fonksiyonu
  const generateCircleCoords = (center: { lat: number; lng: number }, radiusMeters: number): BoundaryCoord[] => {
    const coords: BoundaryCoord[] = [];
    const numPoints = 64; // Daha yumuşak daire için 64 nokta
    
    for (let i = 0; i <= numPoints; i++) {
      const angle = (i * 360) / numPoints;
      const lat = center.lat + (radiusMeters / 111320) * Math.cos((angle * Math.PI) / 180);
      const lng = center.lng + (radiusMeters / (111320 * Math.cos((center.lat * Math.PI) / 180))) * Math.sin((angle * Math.PI) / 180);
      coords.push({ lat, lng });
    }
    
    return coords;
  };

  // Mahalle değiştiğinde sınırları çek
  React.useEffect(() => {
    if (fourthStep.province && fourthStep.district && fourthStep.quarter) {
      fetchNeighborhoodBoundary(fourthStep.quarter, fourthStep.district, fourthStep.province);
    } else {
      setBoundaryCoords([]);
    }
  }, [fourthStep.quarter]);

  React.useEffect(() => {
    const updateMapLocation = async () => {
      if (fourthStep.province && fourthStep.district && fourthStep.quarter) {
        try {
          const fullAddress = `${fourthStep.quarter}, ${fourthStep.district}, ${fourthStep.province}, Türkiye`;

          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              fullAddress
            )}&key=AIzaSyDL9J82iDhcUWdQiuIvBYa0t5asrtz3Swk`
          );

          const data = await response.json();

          if (data.results && data.results.length > 0) {
            const location = data.results[0].geometry.location;

            const newMarker = {
              lat: location.lat,
              lng: location.lng,
              time: new Date(),
            };

            setMarker([newMarker]);

            if (fourthStep.address !== fullAddress) {
              const event = {
                target: {
                  value: fullAddress,
                  name: "address",
                },
              } as React.ChangeEvent<HTMLInputElement>;
              onAddressChange(event);
            }

            console.log("📍 Harita konumu güncellendi:", location);
          }
        } catch (error) {
          console.error("❌ Konum bulunamadı:", error);
        }
      }
    };

    updateMapLocation();
  }, [fourthStep.province, fourthStep.district, fourthStep.quarter]);

  React.useEffect(() => {
    console.log("🔍 Adres değeri:", fourthStep.address);
    console.log("🔍 Adres tipi:", typeof fourthStep.address);

    if (fourthStep.address && typeof fourthStep.address === "object") {
      console.log("🔍 Obje içeriği:", JSON.stringify(fourthStep.address));
    }
  }, [fourthStep.address]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Konum Bilgileri
          </h3>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-900">
              İl
            </label>
            <Select
              options={turkeyCities.map((city: any) => ({
                value: city.province,
                label: city.province,
              }))}
              value={{
                value: fourthStep.province,
                label: fourthStep.province,
              }}
              onChange={onProvinceChange}
              placeholder="İl seçin"
              styles={{
                control: (base) => ({
                  ...base,
                  border: "1px solid #D1D5DB",
                  borderRadius: "0.5rem",
                  padding: "0.25rem",
                }),
              }}
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-900">
              İlçe
            </label>
            <Select
              options={turkeyCities
                .find((city: any) => city.province === fourthStep.province)
                ?.districts.map((district: any) => ({
                  value: district.district,
                  label: district.district,
                }))}
              value={{
                value: fourthStep.district,
                label: fourthStep.district,
              }}
              onChange={onDistrictChange}
              placeholder="İlçe seçin"
              noOptionsMessage={() => "İl seçiniz"}
              styles={{
                control: (base) => ({
                  ...base,
                  border: "1px solid #D1D5DB",
                  borderRadius: "0.5rem",
                  padding: "0.25rem",
                }),
              }}
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-900">
              Mahalle
            </label>
            <Select
              options={turkeyCities
                .find((city: any) => city.province === fourthStep.province)
                ?.districts.find(
                  (district: any) => district.district === fourthStep.district
                )
                ?.quarters.map((quarter: any) => ({
                  value: quarter,
                  label: quarter,
                }))}
              value={{
                value: fourthStep.quarter,
                label: fourthStep.quarter,
              }}
              onChange={onQuarterChange}
              placeholder="Mahalle seçin"
              noOptionsMessage={() => "İlçe seçiniz"}
              styles={{
                control: (base) => ({
                  ...base,
                  border: "1px solid #D1D5DB",
                  borderRadius: "0.5rem",
                  padding: "0.25rem",
                }),
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Adres Bilgisi
          </h3>

          <SimpleInput
            label="Tam Adres"
            value={getSafeAddress(fourthStep.address)}
            onChange={onAddressChange}
            placeholder="Tam adres giriniz"
            icon={MapPin}
          />

          <SimpleInput
            label="Parsel No"
            value={fourthStep.parsel || ""}
            onChange={onParselChange}
            placeholder="Parsel numarası giriniz"
            icon={Hash}
          />
        </div>
      </div>

      {/* Mahalle sınırları yüklenirken gösterge */}
      {isLoadingBoundary && (
        <div className="flex items-center gap-2 text-blue-600 text-sm">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Mahalle sınırları yükleniyor...</span>
        </div>
      )}

      {/* Mahalle sınırları yüklendiğinde bilgi */}
      {boundaryCoords.length > 0 && !isLoadingBoundary && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Mahalle sınırları haritada gösteriliyor ({fourthStep.quarter})</span>
        </div>
      )}

      <div className="border-2 border-dashed border-gray-100 rounded-xl h-96 bg-gray-50">
        <AdminGoogleMap 
          markers={marker} 
          setMarkers={setMarker} 
          boundaryCoords={boundaryCoords}
        />
      </div>
    </motion.div>
  );
}
