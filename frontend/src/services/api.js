// frontend/src/services/api.js
import axios from 'axios';

// Set up the base connector dynamically pointing to your live Render server or local computer
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/admin`;

export const fetchLiveProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error("Error pulling live catalog:", error);
        return { success: false, data: [] };
    }
};

export const uploadNewDress = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/add-product`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Mandatory framework flag for processing files
            }
        });
        return response.data;
    } catch (error) {
        console.error("Database upload processing failed:", error);
        return { success: false, message: error.response?.data?.message || "Server connection error" };
    }
};
