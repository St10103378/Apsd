import axios from "axios";

const API = "https://secureportal-api-b9e3akasadg0cbc4.southafricanorth-01.azurewebsites.net/api/auth";

export const registerUser = (data) => {
    return axios.post(`${API}/register`, data);
};

export const loginUser = (data) => {
    return axios.post(`${API}/login`, data);
};