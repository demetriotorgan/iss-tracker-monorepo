import { useEffect, useState } from "react";
import { getISSPastPositions, getISSPosition } from "../services/api";
import { saveISSPosition } from "../services/backendApi";

export function useISSPosition() {
    const [issData, setIssData] = useState(null);


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
        } catch (error) {
            console.error("Erro ao carregar ISS:", error);
        }
    };


    useEffect(() => {
        loadISS();        

        const timer = setInterval(() => {
            loadISS();
        }, 5000);

        return () => {
            clearInterval(timer);
        }
    }, []);

    return { 
        issData        
    }
}