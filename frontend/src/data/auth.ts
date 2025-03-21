import { postRequest } from "../lib/api-request";

interface AuthType {
    login: (credentials: { email: string, password: string }) => Promise<any>;
    signup: (credentials: { email: string, password: string, pseudo: string }) => Promise<any>;
    verify: (credentials: { email: string, verificationCode: string }) => Promise<any>;
    resendVerificationEmail: (email: string) => Promise<any>;
}

let Auth: AuthType = {
    login: async function (credentials) {
    let data = await postRequest("login", credentials);
    console.log('Response data:', data); // Log the response data
    return data;
    },
    signup: async function (credentials) {
    let data = await postRequest("register", credentials);
    console.log('Response data:', data); // Log the response data
    return data;
    },
    verify: async function (credentials) {
    let data = await postRequest("verify", credentials);
    console.log('Response data:', data); // Log the response data
    return data;
    },
    resendVerificationEmail: async function (email) {
    let data = await postRequest("resend", { email });
    console.log('Response data:', data); // Log the response data
    return data;
    }
};

export { Auth };