import axiosClient from "./axiosClient";

export const teachingSessionApi = {
    getSessions: (month, year) => axiosClient.get(`/teaching-sessions?month=${month}&year=${year}`),
    generateMonth: (data) => axiosClient.post("/teaching-sessions/generate-month", data),
    createSession: (data) => axiosClient.post("/teaching-sessions", data),
    updateSession: (id, data) => axiosClient.put(`/teaching-sessions/${id}`, data),
    batchUpdateStatus: (data) => axiosClient.put("/teaching-sessions/batch-status", data),
    deleteSession: (id) => axiosClient.delete(`/teaching-sessions/${id}`),
    clearMonth: (data) => axiosClient.delete("/teaching-sessions/clear-month", { data })
};

export default teachingSessionApi;
