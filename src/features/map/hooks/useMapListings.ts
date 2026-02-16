import { useEffect, useState } from "react";
import { Address, PropertyListing } from "../types";

export default function useMapListings() {
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");

  useEffect(() => {
    const storedAdverts = localStorage.getItem("haritaAdverts");
    if (storedAdverts) {
      try {
        const parsedAdverts: any[] = JSON.parse(storedAdverts);

        const formattedListings: PropertyListing[] = parsedAdverts.map(
          (advert: any) => {
            const address: Address = {
              mapCoordinates: advert.address?.mapCoordinates || {
                lat: 0,
                lng: 0,
              },
              full_address: advert.address?.full_address || "",
              district: advert.address?.district || "",
              province: advert.address?.province || "",
              quarter: advert.address?.quarter || "",
              parcel: advert.address?.parcel || "",
            };

            if (
              !address.mapCoordinates ||
              typeof address.mapCoordinates.lat !== "number" ||
              typeof address.mapCoordinates.lng !== "number" ||
              isNaN(address.mapCoordinates.lat) ||
              isNaN(address.mapCoordinates.lng)
            ) {
              address.mapCoordinates = { lat: 0, lng: 0 };
            }

            return {
              _id:
                advert._id ||
                advert.uid?.toString() ||
                Math.random().toString(),
              uid: advert.uid || 0,
              address: address,
              title: advert.title || "İsimsiz İlan",
              fee: advert.fee || "Fiyat Belirtilmemiş",
              thoughts: advert.thoughts || "",
              photos: advert.photos || [],
              categoryId: advert.categoryId || "",
              steps: advert.steps || { first: "", second: "" },
              details: advert.details || {},
            };
          }
        );

        const validListings = formattedListings.filter(
          (listing) =>
            listing.address.mapCoordinates &&
            listing.address.mapCoordinates.lat !== 0 &&
            listing.address.mapCoordinates.lng !== 0 &&
            !isNaN(listing.address.mapCoordinates.lat) &&
            !isNaN(listing.address.mapCoordinates.lng)
        );

        setListings(validListings);

        if (validListings.length > 0) {
          const firstListing = validListings[0];
          setSelectedProvince(firstListing.address.province || "");
          setSelectedDistrict(firstListing.address.district || "");
        }
      } catch (error) {
        console.error("Veri parse hatası:", error);
      }
    }

    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const provinceParam = urlParams.get("province");
      const districtParam = urlParams.get("district");

      if (provinceParam) setSelectedProvince(provinceParam);
      if (districtParam) setSelectedDistrict(districtParam);
    }
  }, []);

  return { listings, selectedDistrict, selectedProvince };
}
