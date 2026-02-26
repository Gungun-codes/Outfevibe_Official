import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const fetchOutfits = async () => {
    try {
        const response = await axios.get(`${API_URL}/outfits`);
        return response.data;
    } catch (error) {
        console.error('Error fetching outfits:', error);
        return [];
    }
};

export const checkHealth = async () => {
    try {
        const response = await axios.get(`${API_URL}/health`);
        return response.data;
    } catch (error) {
        console.error('Backend health check failed:', error);
        return null;
    }
};
