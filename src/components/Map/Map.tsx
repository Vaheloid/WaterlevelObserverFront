import { MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css"

export default function Map() {
return (
    <MapContainer 
        style={{ height: "100%", width: "100%" }} 
        center={[54.735141, 55.958726]} 
        zoom={13}
        zoomControl={false} 
        attributionControl={false} 
        scrollWheelZoom={true}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[54.735141, 55.958726]}>
            <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
        </Marker>
    </MapContainer>
    )
}