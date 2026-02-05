/**
 * Интерфейс для результата запроса к Open-Elevation API
 */
interface ElevationResponse {
    results: Array<{
        latitude: number;
        longitude: number;
        elevation: number;
    }>;
}

/**
 * Структура островка внутри затопленной области
 */
interface Island {
    id: number;
    coords: [number, number][];
}

/**
 * Итоговый результат поиска области затопления
 */
interface DepressionAreaResult {
    depressionPoints: [number, number][];
    perimeterPoints: [number, number][];
    includedPoints: [number, number][];
    islands: Island[];
}

export class AltitudeTools {

    // Задержка между запросами
    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    /**
     * Метод для определения, находится ли точка ниже заданной высоты
     */
    async isPointBelowHeight(coords: [number, number], height: number, delayMs: number = 150): Promise<boolean> {
        const url = `https://api.open-elevation.com/api/v1/lookup?locations=${coords[0]},${coords[1]}`;

        try {
            await this.delay(delayMs);

            const response = await fetch(url);
            const data: ElevationResponse = await response.json();

            if (data.results && data.results.length > 0) {
                const elevation = data.results[0].elevation;
                console.log(`Точка ${coords} с высотой ${height} ниже: ${elevation < height}`);
                return elevation < height;
            } else {
                throw new Error('Данные о высоте не найдены для указанных координат.');
            }
        } catch (error) {
            console.error('Ошибка при получении данных о высоте:', error);
            return false;
        }
    }

    /**
     * Получение абсолютной высоты точки
     */
    async getElevation(coords: [number, number], delayMs: number = 150): Promise<number | null> {
        const url = `https://api.open-elevation.com/api/v1/lookup?locations=${coords[0]},${coords[1]}`;

        try {
            await this.delay(delayMs);

            const response = await fetch(url);
            const data: ElevationResponse = await response.json();

            if (data.results && data.results.length > 0) {
                const elevation = data.results[0].elevation;
                console.log(`Высота точки ${coords}: ${elevation}`);
                return elevation;
            } else {
                throw new Error('Данные о высоте не найдены для указанных координат.');
            }
        } catch (error) {
            console.error('Ошибка при получении данных о высоте:', error);
            return null;
        }
    }

    /**
     * Метод для определения области, где точки ниже заданной высоты (с учетом островков)
     */
    async findDepressionAreaWithIslands(
        centerCoords: [number, number], 
        initialHeight: number, 
        distance: number = 200
    ): Promise<DepressionAreaResult> {
        const pointsToCheck: { coords: [number, number]; height: number }[] = [
            { coords: centerCoords, height: initialHeight }
        ];
        
        const checkedPoints = new Set<string>();
        const depressionPoints = new Set<string>();
        const nonFloodedPoints = new Set<string>();
        const perimeterPoints = new Set<string>();
        const includedPoints = new Set<string>();
        const islands: Island[] = [];
        let islandId = 0;

        // Формат координат в строку для Set
        const formatCoords = ([lat, lon]: [number, number]): string => `${lat.toFixed(6)},${lon.toFixed(6)}`;

        // Получение соседних точек
        const getNeighbors = (coords: [number, number]): [number, number][] => {
            const [lat, lon] = coords;
            const neighbors: [number, number][] = [];
            for (let dLat = -1; dLat <= 1; dLat++) {
                for (let dLon = -1; dLon <= 1; dLon++) {
                    if (dLat === 0 && dLon === 0) continue;
                    const newLat = lat + dLat * (distance / 111320);
                    const newLon = lon + dLon * (distance / (111320 * Math.cos(lat * Math.PI / 180)));
                    neighbors.push([newLat, newLon]);
                }
            }
            return neighbors;
        };

        // Основной обход
        while (pointsToCheck.length > 0) {
            const currentItem = pointsToCheck.shift();
            if (!currentItem) continue;

            const { coords: currentPoint, height: currentHeight } = currentItem;
            const currentKey = formatCoords(currentPoint);

            if (checkedPoints.has(currentKey)) continue;
            checkedPoints.add(currentKey);

            const currentElevation = await this.getElevation(currentPoint);

            // Если данные не получены, пропускаем
            if (currentElevation === null) continue;

            if (currentElevation < currentHeight) {
                depressionPoints.add(currentKey);

                const neighbors = getNeighbors(currentPoint);
                for (const neighbor of neighbors) {
                    const neighborKey = formatCoords(neighbor);
                    if (!checkedPoints.has(neighborKey)) {
                        pointsToCheck.push({
                            coords: neighbor,
                            height: Math.min(currentHeight, currentElevation)
                        });
                    }
                }
            } else {
                nonFloodedPoints.add(currentKey);
            }
        }

        // Поиск периметра и островков
        for (const pointKey of depressionPoints) {
            const [lat, lon] = pointKey.split(',').map(Number) as [number, number];
            const neighbors = getNeighbors([lat, lon]);

            let hasNonFloodedNeighbor = false;

            for (const neighbor of neighbors) {
                const neighborKey = formatCoords(neighbor);

                if (!depressionPoints.has(neighborKey)) {
                    hasNonFloodedNeighbor = true;

                    if (nonFloodedPoints.has(neighborKey)) {
                        perimeterPoints.add(neighborKey);
                    } else {
                        includedPoints.add(pointKey);
                    }
                }
            }

            if (!hasNonFloodedNeighbor) {
                const existingIsland = islands.find(island =>
                    island.coords.some(coord =>
                        this.areNeighbors(coord, [lat, lon], 50)
                    )
                );

                if (existingIsland) {
                    existingIsland.coords.push([lat, lon]);
                } else {
                    islands.push({ id: ++islandId, coords: [[lat, lon]] });
                }
            }
        }

        const stringToCoords = (s: string): [number, number] => s.split(',').map(Number) as [number, number];

        const result: DepressionAreaResult = {
            depressionPoints: Array.from(depressionPoints).map(stringToCoords),
            perimeterPoints: Array.from(perimeterPoints).map(stringToCoords),
            includedPoints: Array.from(includedPoints).map(stringToCoords),
            islands
        };

        console.log("Depression Points:", result.depressionPoints);
        console.log("Perimeter Points:", result.perimeterPoints);
        console.log("Included Points:", result.includedPoints);
        console.log("Islands:", result.islands);

        return result;
    }

    public areNeighbors(coord1: [number, number], coord2: [number, number], checkDistance: number): boolean {
        const [lat1, lon1] = coord1;
        const [lat2, lon2] = coord2;
        const distance = Math.sqrt(
            Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2)
        );
        return distance <= (checkDistance / 111320);
    }
}