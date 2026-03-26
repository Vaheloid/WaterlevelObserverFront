import { Marker, Popup, GeoJSON, Tooltip, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import type { MapProps } from "@/utils/types";
import { RecenterMap } from "@/utils/mapUtils";
import { lazy } from "react";

const MapContainer = lazy(() =>
  import("react-leaflet").then((module) => ({ default: module.MapContainer }))
);
const TileLayer = lazy(() =>
  import("react-leaflet").then((module) => ({ default: module.TileLayer }))
);

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}



export default function Map({ selectedTopicId, topics, onMapClick, isAdding, mergedGeoJSON }: MapProps) {
    const currentTopicInfo = topics.find(t => t.ID_Topic === selectedTopicId);

    return (
        <MapContainer 
            style={{ height: "100vh", width: "100%" }} 
            center={[54.735141, 55.958726]} 
            zoom={12}
            zoomControl={false} 
            attributionControl={false}
            preferCanvas={true}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Активируем обработчик кликов только в режиме добавления */}
            {isAdding && onMapClick && <MapClickHandler onMapClick={onMapClick} />}

            {/* Центрирование */}
            {currentTopicInfo && (
                <RecenterMap 
                    lat={currentTopicInfo.Latitude_Topic} 
                    lng={currentTopicInfo.Longitude_Topic} 
                />
            )}

            {/* Полигон из кастомного хука */}
            {mergedGeoJSON && (
                <GeoJSON 
                    key={JSON.stringify(mergedGeoJSON)} 
                    data={mergedGeoJSON}
                    style={{
                        color: 'red',
                        fillColor: '#ff6363',
                        fillOpacity: 0.25,
                        weight: 1.1
                    }}
                />
            )}

            {/* Маркер */}
            {topics.map((topic) => (
                <Marker key={topic.ID_Topic} position={[topic.Latitude_Topic, topic.Longitude_Topic]}>
                    <Popup>{topic.Name_Topic}</Popup>
                    <Tooltip>
                        {topic.Name_Topic}
                    </Tooltip>
                </Marker>
                
            ))}
        </MapContainer>
    );
}