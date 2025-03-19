import { postRequest } from "../lib/api-request";

interface AuthType {
    login: (credentials: { email: string, password: string }) => Promise<any>;
}

let Auth: AuthType = {
    login: async function (credentials) {
    let data = await postRequest("login", credentials);
    console.log('Response data:', data); // Log the response data
    return data;
    },
};

export { Auth };