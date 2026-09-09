import axiosClient from "./axiosClient";

export const taskApi = {
    getTasks: (params) => axiosClient.get("/tasks", { params }),
    getTask: (params) => axiosClient.get("/tasks", { params }),
    getTaskById: (id) => axiosClient.get(`/tasks/${id}`),
    createTask: (data) => axiosClient.post('/tasks', data),
    updateTask: (id, data) => axiosClient.put(`/tasks/${id}`, data),
    deleteTask: (id) => axiosClient.delete(`/tasks/${id}`)
};