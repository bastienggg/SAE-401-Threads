import { deleteRequest, getRequest, postRequest } from "../lib/api-request";

interface LikeType {
    AddLike: (token: string, postId: string) => Promise<any>;
    Deletelike: (token: string, postId: string) => Promise<any>;
}

let Like: LikeType = {
    AddLike: async function (token: string, postId: string) {
        try {
            let data = await postRequest(`like/${postId}`, {}, token);
            return data;
        } catch (error) {
            console.error('Error adding like:', error);
            return null;
        }
    },
    Deletelike: async function (token: string, postId: string) {
        try {
            let data = await deleteRequest(`like/${postId}`, token);
            return data;
        } catch (error) {
            console.error('Error deleting like:', error);
            return null;
        }
    }
};

export { Like };