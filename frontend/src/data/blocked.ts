import { deleteRequest, postRequest } from "../lib/api-request";

// Interface pour le blocage administrateur
interface AdminBlockType {
    blockUser: (token: string, userId: string) => Promise<any>;
    unblockUser: (token: string, userId: string) => Promise<any>;
}

// Interface pour le blocage entre utilisateurs
interface UserBlockType {
    blockUser: (token: string, userId: string) => Promise<any>;
    unblockUser: (token: string, userId: string) => Promise<any>;
    getBlockedUsers: (token: string) => Promise<any>;
    isUserBlocked: (token: string, userId: string) => Promise<any>;
}

// Implémentation du blocage administrateur
const AdminBlock: AdminBlockType = {
    blockUser: async function (token: string, userId: string) {
        try {
            let data = await postRequest(`blocked/${userId}`, {}, token);
            return data;
        } catch (error) {
            console.error('Erreur lors du blocage de l\'utilisateur par l\'administrateur:', error);
            return null;
        }
    },
    unblockUser: async function (token: string, userId: string) {
        try {
            let data = await deleteRequest(`blocked/${userId}`, token);
            return data;
        } catch (error) {
            console.error('Erreur lors du déblocage de l\'utilisateur par l\'administrateur:', error);
            return null;
        }
    }
};

// Implémentation du blocage entre utilisateurs
const UserBlock: UserBlockType = {
    blockUser: async function (token: string, userId: string) {
        try {
            let data = await postRequest(`block/${userId}`, {}, token);
            return data;
        } catch (error) {
            console.error('Erreur lors du blocage de l\'utilisateur:', error);
            return null;
        }
    },
    unblockUser: async function (token: string, userId: string) {
        try {
            let data = await deleteRequest(`unblock/${userId}`, token);
            return data;
        } catch (error) {
            console.error('Erreur lors du déblocage de l\'utilisateur:', error);
            return null;
        }
    },
    getBlockedUsers: async function (token: string) {
        try {
            let data = await fetch('http://localhost:8080/api/blocked-users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return await data.json();
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs bloqués:', error);
            return [];
        }
    },
    isUserBlocked: async function (token: string, userId: string) {
        try {
            let data = await fetch(`http://localhost:8080/api/is-blocked/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return await data.json();
        } catch (error) {
            console.error('Erreur lors de la vérification du statut de blocage:', error);
            return { isBlocked: false };
        }
    }
};

export { AdminBlock, UserBlock };