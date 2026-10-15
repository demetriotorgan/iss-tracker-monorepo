import axios from "axios";

const backendApi = axios.create({
    baseURL: "http://localhost:5000"
});

export async function saveISSPosition(position) {

    const response = await backendApi.post(
        "/iss/position",
        position
    );

    return response.data;
};

