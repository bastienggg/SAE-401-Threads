import { deleteRequest, postRequest } from "../lib/api-request";

// filepath: /home/bastieng/SAE-401-Threads/frontend/src/data/follow.ts

interface FollowType {
    followUser: (token: string, userId: string) => Promise<any>;
    unfollowUser: (token: string, userId: string) => Promise<any>;
}

let Follow: FollowType = {
    followUser: async function (token: string, userId: string) {
        try {
            let data = await postRequest(`follow/${userId}`, {}, token);
            return data;
        } catch (error) {
            console.error('Error following user:', error);
            return null;
        }
    },
    unfollowUser: async function (token: string, userId: string) {
        try {
            let data = await deleteRequest(`follow/${userId}`, token);
            return data;
        } catch (error) {
            console.error('Error unfollowing user:', error);
            return null;
        }
    }
};

export { Follow };