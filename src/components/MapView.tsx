import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapMarker {
    id: string;
    lat: number;
    lng: number;
    popupContent: string;
}

interface MapViewProps {
    markers: MapMarker[];
    center?: [number, number]; // Optional center override
}

const UpdateMapCenter = ({ center, markers }: { center?: [number, number], markers: MapMarker[] }) => {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.flyTo(center, 13);
        } else if (markers.length > 0) {
            // Logic to fit bounds if many markers, or center if one
            if (markers.length === 1) {
                map.flyTo([markers[0].lat, markers[0].lng], 14);
            } else {
                // Ideally fit bounds here, for now just center on the first one or a default
                // Simple approach: Center on the first one or stay put
                // In a real app we'd use L.latLngBounds
            }
        }
    }, [center, markers, map]);

    return null;
}

const MapView: React.FC<MapViewProps> = ({ markers, center }) => {
    const defaultCenter: [number, number] = [12.9716, 77.5946]; // Bangalore

    return (
        <div className="h-full w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200">
            <MapContainer center={center || defaultCenter} zoom={11} scrollWheelZoom={true} className="h-full w-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {markers.map(marker => (
                    <Marker key={marker.id} position={[marker.lat, marker.lng]}>
                        <Popup>
                            {marker.popupContent}
                        </Popup>
                    </Marker>
                ))}

                <UpdateMapCenter center={center} markers={markers} />
            </MapContainer>
        </div>
    );
};

export default MapView;
