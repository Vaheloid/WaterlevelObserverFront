export class OtherScripts {
    calculateMovingAverage(data, windowSize = 7) {
        // Проверка на пустоту данных
        if (data.length === 0) {
            return [];
        }

        const movingAverage = [];

        // Преобразуем строковые значения в числа
        const dataValues = data.map(item => parseFloat(item.Value_Data));
        // Рассчитываем скользящее среднее
        for (let i = 0; i < dataValues.length; i++) {
            if (i < windowSize - 1) {
                movingAverage.push({ Value_Data: null, Time_Data: data[i].Time_Data }); // Недостаточно данных для расчета
            } else {
                const sum = dataValues.slice(i - windowSize + 1, i + 1).reduce((acc, val) => acc + val, 0);
                const average = sum / windowSize;
                movingAverage.push({ Value_Data: average, Time_Data: data[i].Time_Data });
            }
        }

        // Предсказываем на 3 дня вперед с учетом тенденции
        const lastValues = dataValues.slice(-windowSize);
        const lastTimes = data.slice(-windowSize).map(item => item.Time_Data);
        const lastAverage = lastValues.reduce((acc, val) => acc + val, 0) / windowSize;

        // Рассчитываем средний интервал времени между последними событиями
        const timeIntervals = lastTimes.slice(1).map((time, index) => time - lastTimes[index]);
        const averageTimeInterval = timeIntervals.reduce((acc, val) => acc + val, 0) / timeIntervals.length;

        // Рассчитываем тенденцию (наклон)
        const slope = (lastValues[lastValues.length - 1] - lastValues[0]) / (windowSize - 1);

        for (let i = 0; i < 3; i++) {
            const predictedValue = lastAverage + slope * (i + 1);
            const predictedTime = lastTimes[lastTimes.length - 1] + averageTimeInterval * (i + 1);
            movingAverage.push({ Value_Data: predictedValue, Time_Data: predictedTime });
        }

        return movingAverage;
    }

    calculateEMA(data, windowSize = 7, smoothing = 2, slopeFactor = 1) {
        // Проверка на пустоту данных
        if (data.length === 0) {
            return [];
        }

        const emaData = [];
        const alpha = smoothing / (windowSize + 1); // Коэффициент сглаживания

        // Преобразуем строковые значения в числа
        const dataValues = data.map(item => parseFloat(item.Value_Data));
        // Инициализация EMA: начальное значение берется как первый элемент
        let ema = dataValues[0];
        emaData.push({ Value_Data: null, Time_Data: data[0].Time_Data });

        // Рассчитываем EMA для оставшихся данных
        for (let i = 1; i < dataValues.length; i++) {
            // ema = alpha * dataValues[i] + (1 - alpha) * ema;
            // emaData.push({ Value_Data: ema, Time_Data: data[i].Time_Data });

            if (i < windowSize - 1) {
                emaData.push({ Value_Data: null, Time_Data: data[i].Time_Data }); // Недостаточно данных для расчета
            } else {
                ema = alpha * dataValues[i] + (1 - alpha) * ema;
                emaData.push({ Value_Data: ema, Time_Data: data[i].Time_Data });
            }
        }

        // Предсказываем на 3 дня вперед с учетом тенденции
        const lastValues = dataValues.slice(-windowSize);
        const lastTimes = data.slice(-windowSize).map(item => item.Time_Data);
        const lastEMA = ema; // Последнее рассчитанное EMA

        // Рассчитываем средний интервал времени между последними событиями
        const timeIntervals = lastTimes.slice(1).map((time, index) => time - lastTimes[index]);
        const averageTimeInterval = timeIntervals.reduce((acc, val) => acc + val, 0) / timeIntervals.length;

        // Рассчитываем тенденцию (наклон)
        const slope = (lastValues[lastValues.length - 1] - lastValues[0]) / (windowSize - 1);

        for (let i = 0; i < 3; i++) {
            const predictedValue = lastEMA + slope * ((i + 1) * slopeFactor);
            const predictedTime = lastTimes[lastTimes.length - 1] + averageTimeInterval * (i + 1);
            emaData.push({ Value_Data: predictedValue, Time_Data: predictedTime });
        }

        return emaData;
    }

    //////////////////////////////////////////////////////// SORTING ////////////////////////////////////////////////////////

    distance(p1, p2) {
        return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
    }

    orientation(p, q, r) {
        const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
        if (val === 0) return 0;  // коллинеарны
        return (val > 0) ? 1 : 2; // по часовой стрелке или против часовой стрелки
    }

    sortPointsByNearestNeighbor(points) {
        if (points.length < 3) return points;

        const sortedPoints = [points.shift()];

        while (points.length > 0) {
            let nearestIndex = 0;
            let minDistance = this.distance(sortedPoints[sortedPoints.length - 1], points[0]);

            for (let i = 1; i < points.length; i++) {
                const dist = this.distance(sortedPoints[sortedPoints.length - 1], points[i]);
                if (dist < minDistance) {
                    minDistance = dist;
                    nearestIndex = i;
                }
            }

            sortedPoints.push(points.splice(nearestIndex, 1)[0]);
        }

        return sortedPoints;
    }

    sortPointsByDelaunay(points) {
        const delaunay = d3.Delaunay.from(points);
        return delaunay.hullPolygon();
    }

    grahamScan(points) {
        const n = points.length;
        if (n < 3) return points; // Для формирования выпуклой оболочки нужно минимум 3 точки

        // Находим самую нижнюю точку (и самую левую, если есть несколько)
        let ymin = points[0][1], min = 0;
        for (let i = 1; i < n; i++) {
            const y = points[i][1];
            if ((y < ymin) || (ymin === y && points[i][0] < points[min][0])) {
                ymin = points[i][1];
                min = i;
            }
        }

        // Помещаем самую нижнюю точку в начало массива
        [points[0], points[min]] = [points[min], points[0]];

        // Сортируем оставшиеся точки по полярному углу относительно первой точки
        const p0 = points[0];
        points.sort((a, b) => {
            const o = this.orientation(p0, a, b);
            if (o === 0) {
                return (this.distance(p0, b) >= this.distance(p0, a)) ? -1 : 1;
            }
            return (o === 2) ? -1 : 1;
        });

        // Создаем стек и добавляем первые три точки
        const stack = [points[0], points[1], points[2]];

        // Обрабатываем оставшиеся точки
        for (let i = 3; i < n; i++) {
            while (stack.length > 1 && this.orientation(stack[stack.length - 2], stack[stack.length - 1], points[i]) !== 2) {
                stack.pop();
            }
            stack.push(points[i]);
        }

        return stack;
    }

    convexHull(points) {
        const n = points.length;
        if (n < 3) return points; // Для формирования выпуклой оболочки нужно минимум 3 точки

        const hull = [];

        // Находим самую левую точку
        let l = 0;
        for (let i = 1; i < n; i++) {
            if (points[i][0] < points[l][0]) {
                l = i;
            }
        }

        let p = l, q;
        do {
            hull.push(points[p]);
            q = (p + 1) % n;

            for (let i = 0; i < n; i++) {
                if (this.orientation(points[p], points[i], points[q]) === 2) {
                    q = i;
                }
            }

            p = q;
        } while (p !== l);

        return hull;
    }

    sortPointsByPolarAngle(points) {
        // Вычисляем центральную точку как среднее значение всех точек
        const center = points.reduce((acc, point) => [acc[0] + point[0], acc[1] + point[1]], [0, 0]);
        center[0] /= points.length;
        center[1] /= points.length;

        // Сортируем точки по полярному углу относительно центральной точки
        points.sort((a, b) => {
            const angleA = Math.atan2(a[1] - center[1], a[0] - center[0]);
            const angleB = Math.atan2(b[1] - center[1], b[0] - center[0]);
            return angleA - angleB;
        });

        return points;
    }

    sortPointsByDistanceAndAngle(points) {
        // Вычисляем центральную точку как среднее значение всех точек
        const center = points.reduce((acc, point) => [acc[0] + point[0], acc[1] + point[1]], [0, 0]);
        center[0] /= points.length;
        center[1] /= points.length;

        // Сортируем точки по расстоянию от центральной точки, а затем по полярному углу
        points.sort((a, b) => {
            const distA = distance(a, center);
            const distB = distance(b, center);
            if (distA !== distB) {
                return distA - distB;
            }
            const angleA = Math.atan2(a[1] - center[1], a[0] - center[0]);
            const angleB = Math.atan2(b[1] - center[1], b[0] - center[0]);
            return angleA - angleB;
        });

        return points;
    }

    //////////////////////////////////////////////////////// SORTING ////////////////////////////////////////////////////////
}

document.getElementById('topicForm').addEventListener('submit', function (event) {
    if (!this.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
    }
    this.classList.add('was-validated');
}, false);

// Проверяем текущую тему системы при загрузке страницы
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    console.log("Тема установлена на темную");
} else {
    document.documentElement.setAttribute('data-bs-theme', 'light');
    console.log("Тема установлена на светлую");
}
