import * as turf from "@turf/turf";
import type { Feature, Polygon, MultiPolygon } from 'geojson';

/**
 * РЕЖИМ 1: Сглаженный вогнутый полигон (Hull)
 * Использует вашу логику с concave для заполнения пустот между точками
 */
export const processCoordinatesToHull = (allPoints: unknown): Feature<Polygon | MultiPolygon> | null => {
    try {
        if (!Array.isArray(allPoints) || allPoints.length === 0) return null;

        // Быстрая нормализация координат
        const coords: number[][] = [];
        for (const p of allPoints) {
            if (Array.isArray(p) && p.length >= 2) {
                // Turf использует [lng, lat], меняем местами если на входе [lat, lng]
                coords.push([Number(p[1]), Number(p[0])]);
            }
        }

        if (coords.length === 0) return null;

        // 1. Создаем MultiPoint вместо массива отдельных Point
        const multiPoint = turf.multiPoint(coords);

        // 2. Буферизируем ВЕСЬ MultiPoint сразу. 
        // Turf объединит пересекающиеся круги автоматически. Это быстрее чем union в цикле.
        const merged = turf.buffer(multiPoint, 0.15, { units: 'kilometers', steps: 4 });

        if (!merged) return null;

        // 3. "Сдуваем" результат (ваш алгоритм сохранения перемычек)
        const slimmed = turf.buffer(merged, -0.07, { units: 'kilometers', steps: 4 });

        if (!slimmed) return null;

        // 4. Упрощаем и обрезаем точность
        const simplified = turf.simplify(slimmed, { tolerance: 0.00005, highQuality: false });
        
        return turf.truncate(simplified as Feature<Polygon | MultiPolygon>, { precision: 6 });
    } catch (error) {
        console.error("Ошибка в SlimNetwork:", error);
        return null;
    }
};

/**
 * РЕЖИМ 2: Отображение отдельными кругами
 * Оптимизировано через combine, чтобы избежать зависаний
 */
export const processCoordinatesToSquares = (
    allPoints: unknown
): Feature<Polygon | MultiPolygon> | null => {
    try {
        if (!Array.isArray(allPoints) || allPoints.length === 0) return null;

        // 1. Быстро создаем массив буферов
        const pointZones = allPoints
            .filter(p => Array.isArray(p) && p.length >= 2)
            .map(p => {
                const pt = turf.point([Number(p[1]), Number(p[0])]);
                return turf.buffer(pt, 0.08, { units: 'kilometers' });
            })
            .filter(Boolean) as Feature<Polygon>[];

        if (pointZones.length === 0) return null;

        // 2. Вместо цикла используем combine + flatten. 
        // Это превращает массив полигонов в один MultiPolygon мгновенно.
        const collection = turf.featureCollection(pointZones);
        const combined = turf.combine(collection);
        
        // 3. Чтобы полигоны "слились" визуально без внутренних границ, 
        // используем flatten. Если нужно именно математическое слияние,
        // можно добавить turf.union(combined.features[0]), но для отрисовки combine обычно достаточно.
        
        return turf.truncate(combined.features[0] as Feature<MultiPolygon>, { precision: 6 });
    } catch (error) {
        console.error("Ошибка в оптимизированном processCoordinatesToHull:", error);
        return null;
    }
};