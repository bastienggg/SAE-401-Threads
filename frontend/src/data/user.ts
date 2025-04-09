import { postRequest, getRequest, patchRequest } from "../lib/api-request";

interface UserType {
    verifyAdmin: (credentials: { token: string }) => Promise<any>;
    getAllUsers: (token: string) => Promise<any>;
    Usermodify: (token: string, userId: string, dataUser: { pseudo: string, email: string }) => Promise<any>;
    getUserInfos: (token: string, userId: string) => Promise<any>;
    userUpdate: (token: string, userId: string, formData: FormData) => Promise<any>;
    getReadOnlyState: (token: string) => Promise<boolean>;
    updateReadOnlyState: (token: string, readOnly: boolean) => Promise<any>;
    searchUsers: (token: string, query: string) => Promise<any>;
}

let User: UserType = {
    verifyAdmin: async function (credentials) {
        let data = await postRequest("verify-admin", credentials);
        console.log('Response data:', data); // Log the response data
        return data;
    },
    getAllUsers: async function (token) {
        let data = await getRequest("users", token);
        console.log('Response data:', data); // Log the response data
        return data;
    },
    Usermodify: async function (token, userId, dataUser) {
        let data = await patchRequest(`users/${userId}`, dataUser, token);
        console.log('Response data:', data); // Log the response data
        return data;
    },
    getUserInfos: async function (token, userId) {
        let data = await getRequest(`users/${userId}`, token);
        console.log('Response data:', data); // Log the response data
        return data;
    },
    userUpdate: async function (token, userId, formData) {
        let data = await postRequest(`users-update/${userId}`, formData, token);
        console.log('Response data:', data); // Log the response data
        return data;
    },
    getReadOnlyState: async function (token) {
        console.log('Token used for getReadOnlyState:', token); // Log the token
        let data = await getRequest("users-read-only", token) as { readOnly: boolean };
        console.log('Read-only state:', data); // Log the response data
        return data.readOnly;
    },
    updateReadOnlyState: async function (token, readOnly) {
        console.log('Token used for updateReadOnlyState:', token); // Log the token
        console.log('Read-only value being sent:', readOnly); // Log the value being sent
        let data = await postRequest("users-read-only", { readOnly }, token);
        console.log('Updated read-only state:', data); // Log the response data
        return data;
    },
    searchUsers: async function (token: string, query: string) {
        try {
            const response = await getRequest(`search/users?q=${encodeURIComponent(query)}`, token);
            return response;
        } catch (error) {
            console.error('Erreur lors de la recherche d\'utilisateurs:', error);
            throw error;
        }
    }
};

export { User };