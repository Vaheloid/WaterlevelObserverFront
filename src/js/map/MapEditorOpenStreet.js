export class MapEditorOpenStreet {
    constructor(mapElementId) {
        this.mapElement = document.getElementById(mapElementId);

        // Создание карты
        this.map = L.map(this.mapElement).setView([55.76, 37.64], 10);

        // Добавление OpenStreetMap слоя
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(this.map);

        this.objects = L.layerGroup().addTo(this.map); // Группа объектов
        document.getElementsByClassName( 'leaflet-control-attribution' )[0].style.display = 'none';
    }
    markers = []
    polygons = []

    addMarker(coords, popup = '', tooltip = '') {
        const marker = L.marker(coords);
        if (popup) marker.bindPopup(popup);
        if (tooltip) marker.bindTooltip(tooltip);
        this.objects.addLayer(marker);
        this.markers.push(marker);
        return marker;
    }

    addPolygon(coordsArray, options = {}) {
        const polygon = L.polygon(coordsArray, options);
        this.objects.addLayer(polygon);
        this.polygons.push(polygon);
        return polygon;
    }

    addSquare(centerCoords, distanceInMeters = 50, options = {}) {
        // Функция для преобразования метров в градусы широты
        const metersToLatitudeDegrees = (meters) => {
            const earthRadius = 6378137; // Радиус Земли в метрах
            return (meters / earthRadius) * (180 / Math.PI);
        };

        // Функция для преобразования метров в градусы долготы
        const metersToLongitudeDegrees = (meters, latitude) => {
            const earthRadius = 6378137; // Радиус Земли в метрах
            const latitudeRadius = earthRadius * Math.cos(latitude * (Math.PI / 180));
            return (meters / latitudeRadius) * (180 / Math.PI);
        };

        // Вычисляем половину стороны квадрата в градусах
        const halfSideLat = metersToLatitudeDegrees(distanceInMeters);
        const halfSideLng = metersToLongitudeDegrees(distanceInMeters, centerCoords[0]);

        // Вычисляем координаты вершин квадрата (по часовой стрелке)
        const points = [
            [centerCoords[0] + halfSideLat, centerCoords[1] - halfSideLng], // Верхний левый
            [centerCoords[0] + halfSideLat, centerCoords[1] + halfSideLng], // Верхний правый
            [centerCoords[0] - halfSideLat, centerCoords[1] + halfSideLng], // Нижний правый
            [centerCoords[0] - halfSideLat, centerCoords[1] - halfSideLng]  // Нижний левый
        ];

        // Создаем полигон с полученными координатами и опциями
        const square = L.polygon(points, options);
        this.objects.addLayer(square);
        this.polygons.push(square);
        return square;
    }

    addHexagon(centerCoords, distanceInMeters = 50, options = {}) {
        // Функция для преобразования метров в градусы широты
        const metersToLatitudeDegrees = (meters) => {
            const earthRadius = 6378137; // Радиус Земли в метрах
            return (meters / earthRadius) * (180 / Math.PI);
        };

        // Функция для преобразования метров в градусы долготы
        const metersToLongitudeDegrees = (meters, latitude) => {
            const earthRadius = 6378137; // Радиус Земли в метрах
            const latitudeRadius = earthRadius * Math.cos(latitude * (Math.PI / 180));
            return (meters / latitudeRadius) * (180 / Math.PI);
        };

        // Вычисляем радиусы в градусах
        const radiusLat = metersToLatitudeDegrees(distanceInMeters);
        const radiusLng = metersToLongitudeDegrees(distanceInMeters, centerCoords[0]);

        // Вычисляем координаты вершин гексагона
        const points = [];
        const numSides = 6;  // Для гексагона количество сторон = 6
        const angleStep = (2 * Math.PI) / numSides;

        for (let i = 0; i < numSides; i++) {
            const angle = i * angleStep;
            const lat = centerCoords[0] + (radiusLat * Math.sin(angle));
            const lng = centerCoords[1] + (radiusLng * Math.cos(angle));
            points.push([lat, lng]);
        }

        // Создаем полигон с полученными координатами и опциями
        const hexagon = L.polygon(points, options);
        this.objects.addLayer(hexagon);
        this.polygons.push(hexagon);
        return hexagon;
    }

    removeObject(object) {
        this.objects.removeLayer(object);
    }

    removeAllMarkers() {
        if (Array.isArray(this.markers)) {
            this.markers.forEach(marker => this.objects.removeLayer(marker));
        }
        this.markers = [];
    }

    removeAllPolygons() {
        if (Array.isArray(this.polygons)) {
            this.polygons.forEach(polygon => this.objects.removeLayer(polygon));
        }
        this.polygons = [];
    }

    removeAll() {
        this.objects.clearLayers();
        this.markers = [];
        this.polygons = [];
    }

    setCenter(coords, zoom = 10) {
        this.map.setView(coords, zoom);
    }

    on(eventName, callback) {
        this.map.on(eventName, callback);
    }
}
