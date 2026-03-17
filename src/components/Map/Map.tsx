import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import type { MapProps } from "@/utils/types";
import { useTopicData } from "@/hooks/useTopicData"; // Наш новый хук
import { RecenterMap } from "@/utils/mapUtils";


export default function Map({ selectedTopicId, topics }: MapProps) {
    // 2. Получаем детальную геометрию для выбранного топика
    const { mergedGeoJSON } = useTopicData(selectedTopicId);
    
    // Находим информацию о выбранном топике из общего списка
    const currentTopicInfo = topics.find(t => t.ID_Topic === selectedTopicId);

    return (
        <MapContainer 
            style={{ height: "100vh", width: "100%" }} 
            center={[54.735141, 55.958726]} 
            zoom={12}
            zoomControl={false} 
            attributionControl={false} 
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

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
                </Marker>
                
            ))}
        </MapContainer>
    );
}