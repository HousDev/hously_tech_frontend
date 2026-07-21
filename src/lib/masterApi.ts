import api from "./api";

// Master Data API Service
export const masterDataAPI = {
    // Master Types
    getAllMasterTypes: async (tabId: string) => {
        const response = await api.get(`/masters/get-all/${tabId}`);
        console.log("first", response)
        return response.data.data;
    },

    createMasterType: async (data: { tabId: string; name: string; status: string }) => {
        const response = await api.post('/masters', data);
        console.log("first", response)
        return response.data.data;
    },

    getMasterType: async (id: string) => {
        const response = await api.get(`/masters/type/${id}`);
        console.log("first", response)
        return response.data;
    },

    updateMasterType: async (id: string, data: { name: string; status: string }) => {
        const response = await api.put(`/masters/type/update/${id}`, data);
        console.log("first", response)
        return response.data;
    },

    deleteMasterType: async (id: string) => {
        const response = await api.delete(`/masters/type/${id}`);
        console.log("first", response)
        return response.data;
    },

    exportMasterTypes: async (tabId: string) => {
        const response = await api.get(`/masters/export/${tabId}`, {
            responseType: 'blob'
        });
        console.log("first", response)
        return response.data;
    },

    importMasterTypes: async (tabId: string, file: File) => {
        console.log(tabId)
        console.log(file, "file", tabId)
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/masters/import/${tabId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log("first", response)
        return response.data;
    },

    // Master Values
    getMasterValues: async (masterTypeId: string) => {
        const response = await api.get(`/masters/values/${masterTypeId}`);
        console.log("first VALUE", response)
        return response.data.data;
    },

    createMasterValue: async (
        masterTypeId: string,
        data: { value: string; status?: string }
    ) => {
        if (!masterTypeId) throw new Error("masterTypeId is required");
        if (!data?.value) throw new Error("Value is required");

        const payload = {
            value: data.value,
            status: data.status || "Active"
        };

        const response = await api.post(`/masters/values/${masterTypeId}`, payload);
        console.log("first", response)
        return response.data;
    },

    updateMasterValue: async (id: string, data: { value: string; status: string }) => {
        const response = await api.put(`/masters/values/${id}`, data);
        console.log("first", response)
        return response.data;
    },

    deleteMasterValue: async (id: string) => {
        const response = await api.delete(`/masters/values/${id}`);
        console.log("first", response)
        return response.data;
    },

    exportMasterValues: async (masterTypeId: string) => {
        const response = await api.get(`/masters/values/export/${masterTypeId}`, {
            responseType: 'blob'
        });
        console.log("first", response)
        return response.data;
    },

    importMasterValues: async (masterTypeId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/masters/values/import/${masterTypeId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log("first", response)
        return response.data;
    },

    // Get States from Master Location API
    getStates: async (): Promise<LocationItem[]> => {
        const response = await api.get('/masters/states');
        return response.data.success ? response.data.data : [];
    },

    // Get Cities from Master Location API
    getCities: async (stateName?: string): Promise<LocationItem[]> => {
        const url = stateName
            ? `/masters/cities?stateName=${encodeURIComponent(stateName)}`
            : `/masters/cities`;
        const response = await api.get(url);
        return response.data.success ? response.data.data : [];
    },

    // Get database schema columns for document template suggestions
    getSchemaColumns: async () => {
        const response = await api.get('/document-templates/schema-columns');
        return response.data;
    }
};

export interface LocationItem {
    id: number;
    name: string;
}