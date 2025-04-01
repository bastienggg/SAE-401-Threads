import { deleteRequest, postRequest } from "../lib/api-request";

interface BlockedType {
    BlockUser: (token: string, userId: string) => Promise<any>;
    UnblockUser: (token: string, userId: string) => Promise<any>;
}

let Blocked: BlockedType = {
    BlockUser: async function (token: string, userId: string) {
        try {
            let data = await postRequest(`api/block/${userId}`, {}, token);
            return data;
        } catch (error) {
            console.error('Error blocking user:', error);
            return null;
        }
    },
    UnblockUser: async function (token: string, userId: string) {
        try {
            let data = await deleteRequest(`api/unblock/${userId}`, token);
            return data;
        } catch (error) {
            console.error('Error unblocking user:', error);
            return null;
        }
    }
};

export { Blocked };