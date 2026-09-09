import axiosClient from "./axiosClient";

export const authApi = {
    register: (data) => axiosClient.post('/auth/register', data),
    login: (data) => axiosClient.post('/auth/login', data),
    googleLogin: (credential) => axiosClient.post('/auth/google', {credential}),
};

