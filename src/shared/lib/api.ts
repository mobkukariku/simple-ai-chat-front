import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    }
})

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 403:
                    console.error('Forbidden:', data.message);
                    break;
                case 404:
                    console.error('Not Found:', data.message);
                    break;
                case 500:
                    console.error('Server Error:', data.message);
                    break;
                default:
                    console.error('Error:', data.message);
            }
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Request error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
