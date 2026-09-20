import axiosClient from "./axiosClient";

export const timetableApi = {
    getTimetable: () => axiosClient.get("/timetable"),
    createItem: (data) => axiosClient.post("/timetable", data),
    updateItem: (id, data) => axiosClient.put(`/timetable/${id}`, data),
    deleteItem: (id) => axiosClient.delete(`/timetable/${id}`),
    syncBulk: (items) => axiosClient.put("/timetable/sync", { items })
};

export default timetableApi;
