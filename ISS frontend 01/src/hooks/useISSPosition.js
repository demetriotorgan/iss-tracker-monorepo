import { useEffect, useState } from "react";
import { getISSPastPositions, getISSPosition } from "../services/api";
import { buildSegments } from "../services/buildSegments";
import { saveISSPosition } from "../services/backendApi";

export function useISSPosition() {
    const [issData, setIssData] = useState(null);

    const [livePath, setLivePath] = useState([[]]);
    const [pastPath, setPastPath] = useState([[]]);

    async function loadISS() {
        try {
            const data = await getISSPosition();
            await saveISSPosition({
                latitude: data.latitude,
                longitude: data.longitude,
                altitude: data.altitude,
                velocity: data.velocity,
                visibility: data.visibility,
                timestamp: data.timestamp
            });
            setIssData(data);
            console.log(
                "Nova posição recebida",
                data.latitude,
                data.longitude
            );
            console.log(data);

            setLivePath(prev => {
                const paths = [...prev];

                const currentSegment =
                    [...paths[paths.length - 1]];

                const lastPoint =
                    currentSegment[currentSegment.length - 1];

                if (lastPoint) {
                    const deltaLng = Math.abs(
                        data.longitude - lastPoint[1]
                    );

                    if (deltaLng > 180) {

                        console.log(
                            "CRUZAMENTO DETECTADO",
                            {
                                deltaLng,
                                anterior: {
                                    latitude: lastPoint[0],
                                    longitude: lastPoint[1]
                                },
                                atual: {
                                    latitude: data.latitude,
                                    longitude: data.longitude
                                }
                            }
                        );

                        const newPaths = [
                            ...paths,
                            [[data.latitude, data.longitude]]
                        ];

                        console.log(
                            "NOVO TOTAL DE SEGMENTOS:",
                            newPaths.length
                        );

                        return newPaths;
                    }
                }

                currentSegment.push([
                    data.latitude,
                    data.longitude
                ]);

                paths[paths.length - 1] =
                    currentSegment;

                console.log(
                    "SEGMENTOS LIVE:",
                    paths.length
                );

                return paths;
            });
        } catch (error) {
            console.error(error);
        }
    };

    async function loadPastPath() {
        try {
            const positions = await getISSPastPositions();
            console.table(
                positions.map(p => ({
                    timestamp: p.timestamp,
                    latitude: p.latitude,
                    longitude: p.longitude
                }))
            );
            const formattedPath = positions.map(position => [
                position.latitude,
                position.longitude
            ]);
            setPastPath(buildSegments(formattedPath));
        } catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        loadISS();
        loadPastPath();

        const timer = setInterval(() => {
            loadISS();
        }, 5000);

        return () => {
            clearInterval(timer);
        }
    }, []);

    useEffect(() => {
        console.log(
            "LIVEPATH ALTERADO"
        );

        console.log(
            "Quantidade de segmentos:",
            livePath.length
        );

        console.log(
            "Conteúdo:",
            livePath
        );
    }, [livePath]);

    useEffect(() => {
        console.log(
            "PASTPATH ALTERADO"
        );

        console.log(
            "Quantidade de segmentos:",
            pastPath.length
        );

        console.log(
            "Conteúdo:",
            pastPath
        );
    }, [pastPath]);

    return {
        issData,
        pastPath,
        livePath
    }
}