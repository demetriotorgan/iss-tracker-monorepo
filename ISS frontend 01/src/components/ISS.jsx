import { Marker, Popup } from 'react-leaflet';

const ISS = ({issData}) => {    

    const position = [
        issData.latitude,
        issData.longitude
    ];

    return (
        <>
            <Marker position={position}>
                <Popup>
                    <div>
                        <h3>ISS</h3>
                        <p>Lat: {issData.latitude}</p>
                        <p>Lng: {issData.longitude}</p>
                    </div>
                </Popup>
            </Marker>
        </>
    )
}

export default ISS