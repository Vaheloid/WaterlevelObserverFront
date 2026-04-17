import * as turf from "@turf/turf";
import type { Feature, Polygon, MultiPolygon } from 'geojson';

/**
 * Превращает сырые координаты из БД в сглаженный полигон GeoJSON
 */
export const processCoordinatesToHull = (allPoints: unknown): Feature<Polygon | MultiPolygon> | null => {
    try {
        // 1. Проверяем, что это действительно массив
        if (!Array.isArray(allPoints)) {
            console.error("processCoordinatesToHull: Ожидался массив, получено:", typeof allPoints, allPoints);
            return null;
        }

        // 2. Проверка на пустоту
        if (allPoints.length === 0) return null;
        
        // 3. Создаем точки (проверяем, что каждый элемент - массив координат)
        const points = allPoints
            .filter(p => Array.isArray(p) && p.length >= 2) // Доп. защита от битых данных
            .map(p => turf.point([Number(p[1]), Number(p[0])]));

        if (points.length === 0) return null;

        const collection = turf.featureCollection(points);
        
        // Далее ваш код без изменений...
        const concaveHull = turf.concave(collection, { maxEdge: 0.4, units: 'kilometers' });
        if (!concaveHull) return null;

        const simplified = turf.simplify(concaveHull, { tolerance: 0.0001, highQuality: true });
        const buffered = turf.buffer(simplified, 0.05, { units: 'kilometers', steps: 8 });

        return turf.truncate(buffered!, { precision: 6 }) as Feature<Polygon | MultiPolygon>;
    } catch (error) {
        console.error("Ошибка внутри processCoordinatesToHull:", error);
        return null;
    }
};