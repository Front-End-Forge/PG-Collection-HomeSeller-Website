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

// ==========================================
// 1. STITCHING PORTFOLIO SERVICES
// ==========================================

export const fetchPortfolioItems = async () => {
    try {
        const response = await axios.get(`${API_URL}/portfolio`);
        return response.data;
    } catch (error) {
        console.error("Error fetching stitching portfolio:", error);
        return { success: false, data: [] };
    }
};

export const uploadPortfolioItem = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/add-portfolio`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading portfolio design:", error);
        return { success: false, message: error.response?.data?.message || "Server connection error" };
    }
};

export const deletePortfolioItem = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/portfolio/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting portfolio item:", error);
        return { success: false, message: "Deletion failed" };
    }
};

// ==========================================
// 2. CATEGORIES SERVICES
// ==========================================

export const fetchCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/categories`);
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return { success: false, data: [] };
    }
};

export const uploadCategoryImage = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/update-category`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading category image:", error);
        return { success: false, message: error.response?.data?.message || "Server connection error" };
    }
};

// ==========================================
// 3. HERO SLIDES SERVICES
// ==========================================

export const fetchHeroSlides = async () => {
    try {
        const response = await axios.get(`${API_URL}/hero-slides`);
        return response.data;
    } catch (error) {
        console.error("Error fetching hero slides:", error);
        return { success: false, data: [] };
    }
};

export const uploadHeroSlide = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/add-hero-slide`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading hero slide:", error);
        return { success: false, message: error.response?.data?.message || "Server connection error" };
    }
};

export const deleteHeroSlide = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/hero-slides/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting hero slide:", error);
        return { success: false, message: "Deletion failed" };
    }
};

// ==========================================
// 4. STUDENT ENROLLMENTS SERVICES
// ==========================================

export const fetchEnrollments = async () => {
    try {
        const response = await axios.get(`${API_URL}/enrollments`);
        return response.data;
    } catch (error) {
        console.error("Error fetching enrollments:", error);
        return { success: false, data: [] };
    }
};

export const addEnrollment = async (enrollmentData) => {
    try {
        const response = await axios.post(`${API_URL}/add-enrollment`, enrollmentData);
        return response.data;
    } catch (error) {
        console.error("Error adding student enrollment:", error);
        return { success: false, message: error.response?.data?.message || "Server connection error" };
    }
};

