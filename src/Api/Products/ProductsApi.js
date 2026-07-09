import axios from "axios";

const BASE_URL = "https://api.titto.com.bd/api";

export const products = {
  fetchProducts: async () => {
    const response = await axios.get(`${BASE_URL}/products`);
    return response.data;
  },
  fetchCategories: async () => {
    const response = await axios.get(`${BASE_URL}/categories`);
    return response.data;
  },
  fetchColors: async () => {
    const response = await axios.get(`${BASE_URL}/colors`);
    return response.data;
  },
};