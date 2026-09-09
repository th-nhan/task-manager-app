import axiosClient from "./axiosClient";

export const categoryApi = {
    getAllCategories: () => axiosClient.get("/categories"),
    createCategory: (data) => axiosClient.post('/categories', data),
    deleteCategory: (id) => axiosClient.delete(`/categories/${id}`)
};