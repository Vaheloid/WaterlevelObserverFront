import d3 from 'd3-delaunay';

export interface DataPoint {
    Value_Data: string;
    Time_Data: number;
}

export interface ProcessedDataPoint {
    Value_Data: number | null;
    Time_Data: number;
}

export type Point = [number, number];

export class OtherScripts {
    calculateMovingAverage(data: DataPoint[], windowSize: number = 7): ProcessedDataPoint[] {
        if (data.length === 0) {
            return [];
        }

        const movingAverage: ProcessedDataPoint[] = [];
        const dataValues: number[] = data.map(item => parseFloat(item.Value_Data));

        for (let i = 0; i < dataValues.length; i++) {
            if (i < windowSize - 1) {
                movingAverage.push({ Value_Data: null, Time_Data: data[i].Time_Data });
            } else {
                const sum = dataValues.slice(i - windowSize + 1, i + 1).reduce((acc, val) => acc + val, 0);
                const average = sum / windowSize;
                movingAverage.push({ Value_Data: average, Time_Data: data[i].Time_Data });
            }
        }

        const lastValues: number[] = dataValues.slice(-windowSize);
        const lastTimes: number[] = data.slice(-windowSize).map(item => item.Time_Data);
        const lastAverage: number = lastValues.reduce((acc, val) => acc + val, 0) / windowSize;

        const timeIntervals: number[] = lastTimes.slice(1).map((time, index) => time - lastTimes[index]);
        const averageTimeInterval: number = timeIntervals.reduce((acc, val) => acc + val, 0) / timeIntervals.length;

        const slope: number = (lastValues[lastValues.length - 1] - lastValues[0]) / (windowSize - 1);

        for (let i = 0; i < 3; i++) {
            const predictedValue: number = lastAverage + slope * (i + 1);
            const predictedTime: number = lastTimes[lastTimes.length - 1] + averageTimeInterval * (i + 1);
            movingAverage.push({ Value_Data: predictedValue, Time_Data: predictedTime });
        }

        return movingAverage;
    }

    calculateEMA(data: DataPoint[], windowSize: number = 7, smoothing: number = 2, slopeFactor: number = 1): ProcessedDataPoint[] {
        if (data.length === 0) {
            return [];
        }

        const emaData: ProcessedDataPoint[] = [];
        const alpha: number = smoothing / (windowSize + 1);
        const dataValues: number[] = data.map(item => parseFloat(item.Value_Data));
        let ema: number = dataValues[0];
        emaData.push({ Value_Data: null, Time_Data: data[0].Time_Data });

        for (let i = 1; i < dataValues.length; i++) {
            if (i < windowSize - 1) {
                emaData.push({ Value_Data: null, Time_Data: data[i].Time_Data });
            } else {
                ema = alpha * dataValues[i] + (1 - alpha) * ema;
                emaData.push({ Value_Data: ema, Time_Data: data[i].Time_Data });
            }
        }

        const lastValues: number[] = dataValues.slice(-windowSize);
        const lastTimes: number[] = data.slice(-windowSize).map(item => item.Time_Data);
        const lastEMA: number = ema;

        const timeIntervals: number[] = lastTimes.slice(1).map((time, index) => time - lastTimes[index]);
        const averageTimeInterval: number = timeIntervals.reduce((acc, val) => acc + val, 0) / timeIntervals.length;

        const slope: number = (lastValues[lastValues.length - 1] - lastValues[0]) / (windowSize - 1);

        for (let i = 0; i < 3; i++) {
            const predictedValue: number = lastEMA + slope * ((i + 1) * slopeFactor);
            const predictedTime: number = lastTimes[lastTimes.length - 1] + averageTimeInterval * (i + 1);
            emaData.push({ Value_Data: predictedValue, Time_Data: predictedTime });
        }

        return emaData;
    }

    //////////////////////////////////////////////////////// SORTING ////////////////////////////////////////////////////////

    private distance(p1: Point, p2: Point): number {
        return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
    }

    private orientation(p: Point, q: Point, r: Point): number {
        const val: number = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
        if (val === 0) return 0;
        return (val > 0) ? 1 : 2;
    }

    sortPointsByNearestNeighbor(points: Point[]): Point[] {
        if (points.length < 3) return points;

        const sortedPoints: Point[] = [points.shift()!];

        while (points.length > 0) {
            let nearestIndex: number = 0;
            let minDistance: number = this.distance(sortedPoints[sortedPoints.length - 1], points[0]);

            for (let i = 1; i < points.length; i++) {
                const dist: number = this.distance(sortedPoints[sortedPoints.length - 1], points[i]);
                if (dist < minDistance) {
                    minDistance = dist;
                    nearestIndex = i;
                }
            }

            sortedPoints.push(points.splice(nearestIndex, 1)[0]);
        }

        return sortedPoints;
    }

    sortPointsByDelaunay(points: Point[]): Point[] {
        const delaunay = d3.Delaunay.from(points);
        return delaunay.hullPolygon();
    }

    grahamScan(points: Point[]): Point[] {
        const n: number = points.length;
        if (n < 3) return points;

        let ymin: number = points[0][1], min: number = 0;
        for (let i = 1; i < n; i++) {
            const y: number = points[i][1];
            if ((y < ymin) || (ymin === y && points[i][0] < points[min][0])) {
                ymin = points[i][1];
                min = i;
            }
        }

        [points[0], points[min]] = [points[min], points[0]];

        const p0: Point = points[0];
        points.sort((a: Point, b: Point) => {
            const o = this.orientation(p0, a, b);
            if (o === 0) {
                return (this.distance(p0, b) >= this.distance(p0, a)) ? -1 : 1;
            }
            return (o === 2) ? -1 : 1;
        });

        const stack: Point[] = [points[0], points[1], points[2]];

        for (let i = 3; i < n; i++) {
            while (stack.length > 1 && this.orientation(stack[stack.length - 2], stack[stack.length - 1], points[i]) !== 2) {
                stack.pop();
            }
            stack.push(points[i]);
        }

        return stack;
    }

    convexHull(points: Point[]): Point[] {
        const n: number = points.length;
        if (n < 3) return points;

        const hull: Point[] = [];
        let l: number = 0;

        for (let i = 1; i < n; i++) {
            if (points[i][0] < points[l][0]) {
                l = i;
            }
        }

        let p: number = l, q: number;
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

    sortPointsByPolarAngle(points: Point[]): Point[] {
        const center: Point = points.reduce((acc: Point, point: Point) => [acc[0] + point[0], acc[1] + point[1]], [0, 0]);
        center[0] /= points.length;
        center[1] /= points.length;

        points.sort((a: Point, b: Point) => {
            const angleA: number = Math.atan2(a[1] - center[1], a[0] - center[0]);
            const angleB: number = Math.atan2(b[1] - center[1], b[0] - center[0]);
            return angleA - angleB;
        });

        return points;
    }

    sortPointsByDistanceAndAngle(points: Point[]): Point[] {
        const center: Point = points.reduce((acc: Point, point: Point) => [acc[0] + point[0], acc[1] + point[1]], [0, 0]);
        center[0] /= points.length;
        center[1] /= points.length;

        points.sort((a: Point, b: Point) => {
            const distA: number = this.distance(a, center);
            const distB: number = this.distance(b, center);
            if (distA !== distB) {
                return distA - distB;
            }
            const angleA: number = Math.atan2(a[1] - center[1], a[0] - center[0]);
            const angleB: number = Math.atan2(b[1] - center[1], b[0] - center[0]);
            return angleA - angleB;
        });

        return points;
    }
    //////////////////////////////////////////////////////// SORTING ////////////////////////////////////////////////////////
}

const topicForm = document.getElementById('topicForm') as HTMLFormElement;
if (topicForm) {
    topicForm.addEventListener('submit', function (event: Event) {
        if (!this.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.classList.add('was-validated');
    }, false);
}

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    console.log("Тема установлена на темную");
} else {
    document.documentElement.setAttribute('data-bs-theme', 'light');
    console.log("Тема установлена на светлую");
}