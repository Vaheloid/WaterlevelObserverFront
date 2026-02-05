import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { api } from '../../utils/api';
import { useEffect, useState } from "react";
import * as turf from "@turf/turf";
import type { Feature, Polygon, MultiPolygon, GeoJsonProperties } from 'geojson';

export default function Map() {
    // Состояние для хранения объединенного GeoJSON объекта
    const [mergedGeoJSON, setMergedGeoJSON] = useState<Feature<Polygon | MultiPolygon, GeoJsonProperties> | null>(null);

    const loadTopicData = async () => {
    try {
        const response = await api.get('/topic_data?id_topic=2&limit=25');
        const rawCoordsString = response.data.Depression_AreaPoints?.[0];
        console.log("Данные топика: ", response.data)

        if (rawCoordsString) {
            const allPoints: [number, number][] = JSON.parse(rawCoordsString);

            // 1. Создаем точки
            const points = allPoints.map(p => turf.point([p[1], p[0]]));
            const collection = turf.featureCollection(points);


            // 2. Генерируем вогнутую оболочку (Concave)
            const concaveHull = turf.concave(collection, { maxEdge: 0.3, units: 'kilometers' }); //0.5

            if (concaveHull) {
                // --- ЭТАП СГЛАЖИВАНИЯ ---

                // 3. Упрощаем полигон, чтобы убрать лишние "зубцы"
                const simplified = turf.simplify(concaveHull, { tolerance: 0.0001, highQuality: true }); //0.0001

                // 4. Используем микро-буфер с параметром steps
                // Положительный буфер с большим количеством шагов (steps) закругляет углы
                const buffered = turf.buffer(simplified, 0.1, { //0.002
                    units: 'kilometers', 
                    steps: 256 // Чем больше шагов, тем плавнее закругление 64
                });

                // 5. Округляем координаты для чистоты
                const finalResult = turf.truncate(buffered!, { precision: 6 }); // 6
                
                setMergedGeoJSON(finalResult as Feature<Polygon | MultiPolygon>);
            }
        }
    } catch (err) {
        console.error("Ошибка при обработке:", err);
    }
};

    useEffect(() => {
    // 1. Создаем функцию-обертку для асинхронного вызова
    const fetchData = async () => {
        try {
            await loadTopicData();
        } catch (error) {
            console.error("Failed to load data:", error);
        }
    };

    // 2. Вызываем ее
    fetchData();

    // 3. Устанавливаем интервал
    const interval = setInterval(fetchData, 10000);

    // 4. Очистка при размонтировании
    return () => clearInterval(interval);
}, []);

    return (
        <MapContainer 
            style={{ height: "100vh", width: "100%" }} 
            center={[54.735141, 55.958726]} 
            zoom={12}
            zoomControl={false} 
            attributionControl={false} 
            scrollWheelZoom={true}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Отрисовка объединенного полигона */}
            {mergedGeoJSON && (
                <GeoJSON 
                    key={JSON.stringify(mergedGeoJSON)} // Ключ нужен для перерисовки при обновлении данных
                    data={mergedGeoJSON}
                    style={{
                        color: 'red',
                        fillColor: 'red',
                        fillOpacity: 0.25,
                        weight: 1
                    }}
                />
            )}

            <Marker position={[54.735141, 55.958726]}>
                <Popup>Центр мониторинга</Popup>
            </Marker>
        </MapContainer>
    );
}