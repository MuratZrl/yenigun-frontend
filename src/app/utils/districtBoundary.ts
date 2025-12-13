export interface BoundaryCoord {
    lat: number;
    lng: number;
}

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
        .map((w: any) =>
            (w.geometry || []).map((p: any) => ({ lat: p.lat, lng: p.lon }))
        )
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
            break;
        }

        const seg = segments.splice(foundIndex, 1)[0];
        const segOrdered = foundReversed ? [...seg].reverse() : seg;

        const toAppend = samePoint(ring[ring.length - 1], segOrdered[0])
            ? segOrdered.slice(1)
            : segOrdered;
        ring.push(...toAppend);
    }

    return ring;
};

export const fetchDistrictFromOverpass = async (
    district: string,
    province: string
): Promise<BoundaryCoord[] | null> => {
    try {
        const districtNormalized = district.trim();

        const overpassQuery = `
      [out:json][timeout:30];
      area["name"="${province}"]["admin_level"="4"]->.province;
      (
        relation["name"~"${districtNormalized}"]["boundary"="administrative"]["admin_level"~"6|7"](area.province);
        relation["name"~"${districtNormalized}"]["admin_level"~"6|7"](area.province);
      );
      out geom;
    `;

        const response = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            body: `data=${encodeURIComponent(overpassQuery)}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const data = await response.json();

        if (data.elements && data.elements.length > 0) {
            let bestCoords: BoundaryCoord[] = [];

            for (const element of data.elements) {
                let coords: BoundaryCoord[] = [];

                if (element.type === "relation" && element.members) {
                    const outerWays = element.members
                        .filter(
                            (m: any) =>
                                m.type === "way" && (m.role === "outer" || m.role === "")
                        )
                        .filter((m: any) => m.geometry && m.geometry.length > 0);

                    if (outerWays.length > 0) {
                        coords = stitchOuterWays(outerWays);
                    }
                } else if (element.type === "way" && element.geometry) {
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
                return bestCoords;
            }
        }

        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
};
