import L from 'leaflet';

export class MapEditorOpenStreet {
    // We assume these are initialized in a constructor or externally
    private objects: L.LayerGroup = L.layerGroup();
    
    private markers: L.Marker[] = [];
    private polygons: L.Polygon[] = [];

    /**
     * Adds a marker to the map
     */
    addMarker(coords: L.LatLngExpression, popup: string = '', tooltip: string = ''): L.Marker {
        const marker = L.marker(coords);
        if (popup) marker.bindPopup(popup);
        if (tooltip) marker.bindTooltip(tooltip);
        
        this.objects.addLayer(marker);
        this.markers.push(marker);
        return marker;
    }

    /**
     * Adds a generic polygon
     */
    addPolygon(coordsArray: L.LatLngExpression[] | L.LatLngExpression[][], options: L.PolylineOptions = {}): L.Polygon {
        const polygon = L.polygon(coordsArray, options);
        this.objects.addLayer(polygon);
        this.polygons.push(polygon);
        return polygon;
    }

    /**
     * Adds a square based on center and distance
     */
    addSquare(centerCoords: [number, number], distanceInMeters: number = 50, options: L.PolylineOptions = {}): L.Polygon {
        const halfSideLat = this.metersToLatitudeDegrees(distanceInMeters);
        const halfSideLng = this.metersToLongitudeDegrees(distanceInMeters, centerCoords[0]);

        const points: [number, number][] = [
            [centerCoords[0] + halfSideLat, centerCoords[1] - halfSideLng], // Top Left
            [centerCoords[0] + halfSideLat, centerCoords[1] + halfSideLng], // Top Right
            [centerCoords[0] - halfSideLat, centerCoords[1] + halfSideLng], // Bottom Right
            [centerCoords[0] - halfSideLat, centerCoords[1] - halfSideLng]  // Bottom Left
        ];

        return this.addPolygon(points, options);
    }

    /**
     * Adds a hexagon based on center and distance
     */
    addHexagon(centerCoords: [number, number], distanceInMeters: number = 50, options: L.PolylineOptions = {}): L.Polygon {
        const radiusLat = this.metersToLatitudeDegrees(distanceInMeters);
        const radiusLng = this.metersToLongitudeDegrees(distanceInMeters, centerCoords[0]);

        const points: [number, number][] = [];
        const numSides = 6;
        const angleStep = (2 * Math.PI) / numSides;

        for (let i = 0; i < numSides; i++) {
            const angle = i * angleStep;
            const lat = centerCoords[0] + (radiusLat * Math.sin(angle));
            const lng = centerCoords[1] + (radiusLng * Math.cos(angle));
            points.push([lat, lng]);
        }

        return this.addPolygon(points, options);
    }

    // --- Utility Calculation Methods ---

    private metersToLatitudeDegrees(meters: number): number {
        const earthRadius = 6378137; 
        return (meters / earthRadius) * (180 / Math.PI);
    }

    private metersToLongitudeDegrees(meters: number, latitude: number): number {
        const earthRadius = 6378137;
        const latitudeRadius = earthRadius * Math.cos(latitude * (Math.PI / 180));
        return (meters / latitudeRadius) * (180 / Math.PI);
    }

    // --- Cleanup Methods ---

    removeObject(object: L.Layer): void {
        this.objects.removeLayer(object);
    }

    removeAllMarkers(): void {
        this.markers.forEach(marker => this.objects.removeLayer(marker));
        this.markers = [];
    }

    removeAllPolygons(): void {
        this.polygons.forEach(polygon => this.objects.removeLayer(polygon));
        this.polygons = [];
    }

    removeAll(): void {
        this.objects.clearLayers();
        this.markers = [];
        this.polygons = [];
    }

}