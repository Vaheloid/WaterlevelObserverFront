// Тип для координат: [широта, долгота]
export type Coords = [number, number];

export interface Island {
    id: number;
    coords: Coords[];
}

export interface DepressionResults {
    depressionPoints: Coords[];
    perimeterPoints: Coords[];
    includedPoints: Coords[];
    islands: Island[];
}

interface PointToCheck {
    coords: Coords;
    height: number;
}

export class AltitudeTools {
    // Задержка между запросами
    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // Вспомогательный метод для форматирования ключей Set
    private formatCoords(coords: Coords): string {
        return `${coords[0].toFixed(6)},${coords[1].toFixed(6)}`;
    }

    // Десериализация ключа обратно в числа
    private parseCoords(key: string): Coords {
        return key.split(',').map(Number) as Coords;
    }

    /**
     * Получение высоты точки через API
     */
    async getElevation(coords: Coords, delayMs: number = 150): Promise<number | null> {
        const url = `https://api.open-elevation.com/api/v1/lookup?locations=${coords[0]},${coords[1]}`;

        try {
            await this.delay(delayMs);
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const elevation = data.results[0].elevation;
                console.log(`Высота точки ${coords}: ${elevation}`);
                return elevation;
            } else {
                throw new Error('No elevation data found for the given coordinates.');
            }
        } catch (error) {
            console.error('Error fetching elevation data:', error);
            return null;
        }
    }

    /**
     * Определение соседей точки
     */
    private getNeighbors(coords: Coords, distance: number): Coords[] {
        const [lat, lon] = coords;
        const neighbors: Coords[] = [];
        
        for (let dLat = -1; dLat <= 1; dLat++) {
            for (let dLon = -1; dLon <= 1; dLon++) {
                if (dLat === 0 && dLon === 0) continue;
                
                const newLat = lat + dLat * (distance / 111320);
                // Учет кривизны долготы в зависимости от широты
                const newLon = lon + dLon * (distance / (111320 * Math.cos(lat * Math.PI / 180)));
                
                neighbors.push([newLat, newLon]);
            }
        }
        return neighbors;
    }

    /**
     * Основной метод поиска области депрессии (затопления)
     */
    async findDepressionAreaWithIslands(
        centerCoords: Coords, 
        initialHeight: number, 
        distance: number = 200
    ): Promise<DepressionResults> {
        const pointsToCheck: PointToCheck[] = [{ coords: centerCoords, height: initialHeight }];
        
        const checkedPoints = new Set<string>();
        const depressionPoints = new Set<string>();
        const nonFloodedPoints = new Set<string>();
        const perimeterPoints = new Set<string>();
        const includedPoints = new Set<string>();
        
        const islands: Island[] = [];
        let islandId = 0;

        // 1. Основной обход (Flood Fill)
        while (pointsToCheck.length > 0) {
            const current = pointsToCheck.shift()!;
            const currentKey = this.formatCoords(current.coords);

            if (checkedPoints.has(currentKey)) continue;
            checkedPoints.add(currentKey);

            const currentElevation = await this.getElevation(current.coords);

            // Если данные не получены, пропускаем точку
            if (currentElevation === null) continue;

            // Логика затопления: добавляем небольшую погрешность (0.1м) для имитации напора
            const floodThreshold = current.height + 0.1;

            if (currentElevation <= floodThreshold) {
                depressionPoints.add(currentKey);

                const neighbors = this.getNeighbors(current.coords, distance);
                for (const neighbor of neighbors) {
                    const neighborKey = this.formatCoords(neighbor);
                    if (!checkedPoints.has(neighborKey)) {
                        pointsToCheck.push({
                            coords: neighbor,
                            height: Math.min(current.height, currentElevation)
                        });
                    }
                }
            } else {
                nonFloodedPoints.add(currentKey);
            }
        }

        // 2. Поиск периметра и островов
        for (const pointKey of depressionPoints) {
            const coords = this.parseCoords(pointKey);
            const neighbors = this.getNeighbors(coords, distance);

            let hasNonFloodedNeighbor = false;

            for (const neighbor of neighbors) {
                const neighborKey = this.formatCoords(neighbor);

                if (!depressionPoints.has(neighborKey)) {
                    hasNonFloodedNeighbor = true;

                    if (nonFloodedPoints.has(neighborKey)) {
                        perimeterPoints.add(neighborKey);
                    } else {
                        includedPoints.add(pointKey);
                    }
                }
            }

            // Логика островов
            if (!hasNonFloodedNeighbor) {
                const existingIsland = islands.find(island =>
                    island.coords.some(c => this.areNeighbors(c, coords, 50))
                );

                if (existingIsland) {
                    existingIsland.coords.push(coords);
                } else {
                    islands.push({ id: ++islandId, coords: [coords] });
                }
            }
        }

        return {
            depressionPoints: Array.from(depressionPoints).map(this.parseCoords),
            perimeterPoints: Array.from(perimeterPoints).map(this.parseCoords),
            includedPoints: Array.from(includedPoints).map(this.parseCoords),
            islands
        };
    }

    private areNeighbors(coord1: Coords, coord2: Coords, checkDistance: number): boolean {
        const [lat1, lon1] = coord1;
        const [lat2, lon2] = coord2;
        const distance = Math.sqrt(
            Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2)
        );
        return distance <= (checkDistance / 111320);
    }
}