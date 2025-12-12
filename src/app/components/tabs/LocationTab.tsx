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
  const [currentDistrictKey, setCurrentDistrictKey] = React.useState<string>("");

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

  const fetchDistrictFromOverpass = async (district: string, province: string): Promise<BoundaryCoord[] | null> => {
    try {
      const closePath = (coords: BoundaryCoord[]) => {
        if (!coords || coords.length === 0) return coords;
        const first = coords[0];
        const last = coords[coords.length - 1];
        if (first.lat === last.lat && first.lng === last.lng) return coords;
        return [...coords, first];
      };

      const samePoint = (a: BoundaryCoord, b: BoundaryCoord) => {
        const eps = 1e-4;
        return Math.abs(a.lat - b.lat) < eps && Math.abs(a.lng - b.lng) < eps;
      };

      const stitchOuterWays = (ways: any[]): BoundaryCoord[] => {
        const segments: BoundaryCoord[][] = ways
          .map((w: any) => (w.geometry || []).map((p: any) => ({ lat: p.lat, lng: p.lon })))
          .filter((seg: BoundaryCoord[]) => seg.length > 1);

        if (segments.length === 0) return [];

        const ring: BoundaryCoord[] = [...segments.shift()!];

        while (segments.length > 0) {
          const end = ring[ring.length - 1];
          let foundIndex = -1;
          let foundReversed = false;

          for (let i = 0; i < segments.length; i++) {
            const seg = segments[i];
            const segStart = seg[0];
            const segEnd = seg[seg.length - 1];

            if (samePoint(end, segStart)) {
              foundIndex = i;
              foundReversed = false;
              break;
            }
            if (samePoint(end, segEnd)) {
              foundIndex = i;
              foundReversed = true;
              break;
            }
          }

          if (foundIndex === -1) {
            // Bağlayamadık: kalanları olduğu gibi ekleme yerine bırak.
            break;
          }

          const seg = segments.splice(foundIndex, 1)[0];
          const segOrdered = foundReversed ? [...seg].reverse() : seg;

          // İlk nokta end ile aynıysa tekrar ekleme
          const toAppend = samePoint(ring[ring.length - 1], segOrdered[0])
            ? segOrdered.slice(1)
            : segOrdered;
          ring.push(...toAppend);
        }

        return ring;
      };

      // İlçe ismi normalize et
      const districtNormalized = district.trim();

      // Overpass API sorgusu - ilçe sınırları için (admin_level 6-7)
      const overpassQuery = `
        [out:json][timeout:30];
        area["name"="${province}"]["admin_level"="4"]->.province;
        (
          relation["name"~"${districtNormalized}"]["boundary"="administrative"]["admin_level"~"6|7"](area.province);
          relation["name"~"${districtNormalized}"]["admin_level"~"6|7"](area.province);
        );
        out geom;
      `;

      console.log("🔍 Overpass API ilçe sınırları sorgulanıyor:", districtNormalized, province);

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: `data=${encodeURIComponent(overpassQuery)}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const data = await response.json();
      
      if (data.elements && data.elements.length > 0) {
        // En uygun elementi bul (en çok geometri noktasına sahip olan)
        let bestCoords: BoundaryCoord[] = [];
        
        for (const element of data.elements) {
          let coords: BoundaryCoord[] = [];
          
          if (element.type === 'relation' && element.members) {
            // Relation'dan outer way'leri al ve sırala
            const outerWays = element.members
              .filter((m: any) => m.type === 'way' && (m.role === 'outer' || m.role === ''))
              .filter((m: any) => m.geometry && m.geometry.length > 0);
            
            if (outerWays.length > 0) {
              // Way'leri uç uca ekleyip ring oluştur
              coords = stitchOuterWays(outerWays);
            }
          } else if (element.type === 'way' && element.geometry) {
            coords = element.geometry.map((point: any) => ({
              lat: point.lat,
              lng: point.lon,
            }));
          }

          coords = closePath(coords);
          
          if (coords.length > bestCoords.length) {
            bestCoords = coords;
          }
        }
        
        if (bestCoords.length > 3) {
          console.log("✅ Overpass'tan ilçe sınırları bulundu:", bestCoords.length, "nokta");
          return bestCoords;
        }
      }
      
      console.log("⚠️ Overpass'tan ilçe sınırı bulunamadı");
      return null;
    } catch (error) {
      console.error("Overpass API hatası:", error);
      return null;
    }
  };

  // İlçe sınırlarını çekmek için ana fonksiyon
  const fetchDistrictBoundary = async (district: string, province: string) => {
    // Aynı ilçe için tekrar istek atmayı önle
    const districtKey = `${province}-${district}`;
    if (districtKey === currentDistrictKey) {
      return;
    }
    setCurrentDistrictKey(districtKey);
    
    setIsLoadingBoundary(true);
    setBoundaryCoords([]);
    
    try {
      console.log("📍 İlçe sınırları aranıyor:", district, province);
      
      // Sadece Overpass API kullan
      const coords = await fetchDistrictFromOverpass(district, province);
      
      if (coords && coords.length > 10) {
        setBoundaryCoords(coords);
        return;
      }

      console.log("⚠️ İlçe sınırı bulunamadı");
    } catch (error) {
      console.error("❌ İlçe sınırları alınırken hata:", error);
    } finally {
      setIsLoadingBoundary(false);
    }
  };

  // İlçe değiştiğinde sınırları çek
  React.useEffect(() => {
    if (fourthStep.province && fourthStep.district) {
      fetchDistrictBoundary(fourthStep.district, fourthStep.province);
    } else {
      setBoundaryCoords([]);
      setCurrentDistrictKey("");
    }
  }, [fourthStep.district, fourthStep.province]);

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

      {/* İlçe sınırları yüklenirken gösterge */}
      {isLoadingBoundary && (
        <div className="flex items-center gap-2 text-blue-600 text-sm">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>İlçe sınırları yükleniyor...</span>
        </div>
      )}

      {/* İlçe sınırları yüklendiğinde bilgi */}
      {boundaryCoords.length > 0 && !isLoadingBoundary && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>İlçe sınırları haritada gösteriliyor ({fourthStep.district})</span>
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
