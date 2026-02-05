export class AltitudeTools {

    // Задержка между запросами
    delay(ms) {
        return new Promise(function(resolve) {
            setTimeout(resolve, ms);
        });
    }

    // Метод для определения, находится ли точка ниже заданной высоты
    async isPointBelowHeight(coords, height, delayMs = 150) {
        const url = `https://api.open-elevation.com/api/v1/lookup?locations=${coords[0]},${coords[1]}`;

        try {
            // Задержка перед запросом
            await this.delay(delayMs);

            const response = await fetch(url);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const elevation = data.results[0].elevation;

                console.log(`Точка ${coords} with ${height} is ${elevation < height}`);
                return elevation < height;
            } else {
                throw new Error('No elevation data found for the given coordinates.');
            }
        } catch (error) {
            console.error('Error fetching elevation data:', error);
            return false;
        }
    }

    async getElevation(coords, delayMs = 150) {
        const url = `https://api.open-elevation.com/api/v1/lookup?locations=${coords[0]},${coords[1]}`;

        try {
            // Задержка перед запросом
            await this.delay(delayMs);

            const response = await fetch(url);
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
            return null; // Возвращаем null в случае ошибки
        }
    }


    // Метод для определения области, где точки ниже заданной высоты
    async findDepressionAreaWithIslands(centerCoords, initialHeight, distance = 200) {
        const pointsToCheck = [{ coords: centerCoords, height: initialHeight }];
        const checkedPoints = new Set();
        const depressionPoints = new Set();
        const nonFloodedPoints = new Set();
        const perimeterPoints = new Set();
        const includedPoints = new Set();
        const islands = []; // Островки
        let islandId = 0;

        // Формат координат в строку
        const formatCoords = ([lat, lon]) => `${lat.toFixed(6)},${lon.toFixed(6)}`;

        // Получение соседних точек
        const getNeighbors = (coords) => {
            const [lat, lon] = coords;
            const neighbors = [];
            for (let dLat = -1; dLat <= 1; dLat++) {
                for (let dLon = -1; dLon <= 1; dLon++) {
                    if (dLat === 0 && dLon === 0) continue;
                    const newLat = lat + dLat * (distance / 111320); // 1° широты ≈ 111.32 км
                    const newLon = lon + dLon * (distance / (111320 * Math.cos(lat * Math.PI / 180))); // 1° долготы ≈ 111.32 км * cos(latitude)
                    neighbors.push([newLat, newLon]);
                }
            }
            return neighbors;
        };

        // Основной обход
        while (pointsToCheck.length > 0) {
            const { coords: currentPoint, height: currentHeight } = pointsToCheck.shift();
            const currentKey = formatCoords(currentPoint);

            if (checkedPoints.has(currentKey)) continue;
            checkedPoints.add(currentKey);

            // Получаем текущую высоту точки
            const currentElevation = await this.getElevation(currentPoint);

            // Если точка ниже текущей высоты, добавляем её в затопленные
            if (currentElevation < currentHeight) { // добавить погрешность на проверку высоты в пользу воды. типа вода все таким может преодалеть высоту немного выше себя (напор воды там и тд). еще можно поставить <=
                depressionPoints.add(currentKey);

                const neighbors = getNeighbors(currentPoint);
                for (const neighbor of neighbors) {
                    const neighborKey = formatCoords(neighbor);
                    if (!checkedPoints.has(neighborKey)) {
                        pointsToCheck.push({
                            coords: neighbor,
                            height: Math.min(currentHeight, currentElevation) // Спуск вниз
                        });
                    }
                }
            } else {
                nonFloodedPoints.add(currentKey);
            }
        }

        // Поиск периметра и островков (без изменений)
        for (const pointKey of depressionPoints) {
            const [lat, lon] = pointKey.split(',').map(Number);
            const neighbors = getNeighbors([lat, lon]);

            let hasNonFloodedNeighbor = false;

            for (const neighbor of neighbors) {
                const neighborKey = formatCoords(neighbor);

                if (!depressionPoints.has(neighborKey)) {
                    hasNonFloodedNeighbor = true;

                    if (nonFloodedPoints.has(neighborKey)) {
                        perimeterPoints.add(neighborKey); // Периметр (незатопленные)
                    } else {
                        includedPoints.add(pointKey); // Граница затопленной области
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

        console.log("Depression Points:", Array.from(depressionPoints).map(point => point.split(',').map(Number)));
        console.log("Perimeter Points:", Array.from(perimeterPoints).map(point => point.split(',').map(Number)));
        console.log("Included Points:", Array.from(includedPoints).map(point => point.split(',').map(Number)));
        console.log("Islands:", islands);
        return {
            depressionPoints: Array.from(depressionPoints).map(point => point.split(',').map(Number)),
            perimeterPoints: Array.from(perimeterPoints).map(point => point.split(',').map(Number)),
            includedPoints: Array.from(includedPoints).map(point => point.split(',').map(Number)),
            islands
        };
    }

    areNeighbors(coord1, coord2, checkDistance) {
        const [lat1, lon1] = coord1;
        const [lat2, lon2] = coord2;
        const distance = Math.sqrt(
            Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2)
        );
        return distance <= (checkDistance / 111320);
    }
}
