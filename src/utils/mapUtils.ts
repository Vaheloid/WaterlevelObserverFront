import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            // animate: true для плавности или false для мгновенного прыжка
            map.setView([lat, lng], 12 /*map.getZoom()*/, { animate: true });
        }
    }, [lat, lng, map]);
    return null;
}