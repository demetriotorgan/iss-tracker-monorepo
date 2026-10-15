import { MapContainer, Polyline, TileLayer, useMap } from "react-leaflet";
import ISS from "./ISS";
import { useEffect } from "react";
import { useISSPosition } from "../hooks/useISSPosition";
import MapController from "./MapController";

function ISSMap() {
    const { issData, pastPath, livePath } = useISSPosition();

    // //Verificando coordenadas armazenadas em tempo real
    // useEffect(() => {
    //     console.log("PATH:", livePath);
    // }, [livePath]);

    if (!issData) {
        return <p>Carregando ISS...</p>;
    }

    const position = [
        issData.latitude,
        issData.longitude
    ];

    return (
        <>
            <MapContainer
                center={[0, 0]}
                zoom={2}
                style={{
                    height: "100vh",
                    width: "100%"
                }}
            >
                <TileLayer
                    attribution="© OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ISS issData={issData} />
                <MapController position={position} />
                {pastPath.map((segment, index) => (
                    segment.length > 1 && (
                        <Polyline
                            key={`past-${index}`}
                            positions={segment}
                            pathOptions={{
                                color: 'green',
                                weight: 1,
                                opacity: 0.8,
                                dashArray: "1, 8"
                            }}
                        />
                    )
                ))}
                {livePath.map((segment, index) => (
                    segment.length > 1 && (
                        <Polyline
                            key={`live-${index}`}
                            positions={segment}
                            pathOptions={{
                                color: 'yellow',
                                weight: 2,
                                opacity: 0.8,
                                dashArray: "2, 8"
                            }}
                        />
                    )
                ))}
            </MapContainer>
        </>
    );
}

export default ISSMap;