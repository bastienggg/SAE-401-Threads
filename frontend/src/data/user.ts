import { postRequest, getRequest, patchRequest } from "../lib/api-request";

interface UserType {
    verifyAdmin: (credentials: { token: string }) => Promise<any>;
    getAllUsers: (token: string) => Promise<any>;
    Usermodify: (token: string, userId: string, dataUser: { pseudo: string, email: string }) => Promise<any>;
    getUserInfos: (token: string, userId: string) => Promise<any>;
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
    }
};

export { User };