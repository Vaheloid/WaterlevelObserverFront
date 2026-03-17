import * as turf from "@turf/turf";
import type { Feature, Polygon, MultiPolygon } from 'geojson';

/**
 * Превращает сырые координаты из БД в сглаженный полигон GeoJSON
 */
export const processCoordinatesToHull = (rawCoordsString: string): Feature<Polygon | MultiPolygon> | null => {
    try {
        const allPoints: [number, number][] = JSON.parse(rawCoordsString);
        
        // 1. Создаем точки (меняем [lat, lon] на [lon, lat] для Turf/GeoJSON)
        const points = allPoints.map(p => turf.point([p[1], p[0]]));
        const collection = turf.featureCollection(points);
        
        // 2. Генерируем вогнутую оболочку
        const concaveHull = turf.concave(collection, { maxEdge: 0.3, units: 'kilometers' });

        if (!concaveHull) return null;

        // 3. Сглаживание и упрощение
        const simplified = turf.simplify(concaveHull, { tolerance: 0.0001, highQuality: true });

        // 4. Создание буфера для закругления углов
        const buffered = turf.buffer(simplified, 0.1, { 
            units: 'kilometers', 
            steps: 256 
        });

        // 5. Округляем координаты
        return turf.truncate(buffered!, { precision: 6 }) as Feature<Polygon | MultiPolygon>;
    } catch (error) {
        console.error("Ошибка при обработке геометрии:", error);
        return null;
    }
};