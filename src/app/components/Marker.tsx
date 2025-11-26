import { LatLngLiteral } from "google-maps-react-markers";
import React from "react";
import { MapPin } from "lucide-react";

interface MarkerProps {
  className?: string;
  draggable: boolean;
  lat: number;
  lng: number;
  markerId: any;
  onClick?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    props: { lat: number; lng: number; markerId: string }
  ) => void;
  onDrag?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    props: { latLng: LatLngLiteral }
  ) => void;
  onDragEnd?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    props: { latLng: LatLngLiteral }
  ) => void;
  onDragStart?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    props: { latLng: LatLngLiteral }
  ) => void;
}

const Marker = ({
  className,
  lat,
  lng,
  markerId,
  onClick,
  draggable,
  onDrag,
  onDragEnd,
  onDragStart,
  ...props
}: MarkerProps) =>
  lat && lng ? (
    <div
      className={className}
      onClick={(e) => (onClick ? onClick(e, { markerId, lat, lng }) : null)}
      style={{
        cursor: "pointer",
        transform: "translate(-50%, -100%)",
      }}
      {...props}
    >
      <MapPin size={35} className="text-red-600 fill-red-600" />
    </div>
  ) : null;

export default Marker;
