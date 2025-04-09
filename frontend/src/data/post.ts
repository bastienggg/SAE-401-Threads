import { deleteRequest, getRequest, postRequest } from "../lib/api-request";

interface PostType {
    getPost: (token: string, page: number) => Promise<any>;
    setPost: (post: FormData, token: string) => Promise<any>;
    getUserPosts: (token: string, userId: string, page: number) => Promise<any>;
    deletePost:(token:string, postID:string) => Promise<any>;
    updatePost: (token: string, postID: string, updatedData: FormData) => Promise<any>;
    censorPost: (token: string, postID: string) => Promise<any>;
    uncensorPost: (token: string, postID: string) => Promise<any>;
    getReplies: (token: string, postId: string) => Promise<any>;
    createReply: (token: string, postId: string, formData: FormData) => Promise<any>;
    pinPost: (token: string, postId: string) => Promise<any>;
    unpinPost: (token: string, postId: string) => Promise<any>;
    searchPosts: (token: string, query: string) => Promise<any>;
}

let Post: PostType = {
  getPost: async function (token: string, page: number = 1) {
    try {
      console.log(`Fetching posts for page ${page} with token:`, token ? 'Token present' : 'No token');
      let data = await getRequest(`posts?page=${page}`, token);
      if (!data) {
        console.error('No data received from getRequest');
        return null;
      }
      console.log('Received posts data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return null;
    }
  },

  setPost: async function (post: FormData, token: string) {
    try {
      console.log("Sending post data as form-data:", post); // Log pour debug
      let data = await postRequest("posts", post, token);
      console.log("Response data:", data); // Log pour debug
      return data;
    } catch (error) {
      console.error("Error posting:", error);
      return null;
    }
  },

  getUserPosts: async function (token: string, userId: string, page: number = 1) {
    try {
      let data = await getRequest(`user/${userId}/posts?page=${page}`, token);
      return data;
    } catch (error) {
      console.error(`Error fetching posts for user ${userId}:`, error);
      return null;
    }
  },

  deletePost: async function  (token:string, postID:string){
    try {
      let data = await deleteRequest(`posts/${postID}`, token);
      return data;
    } catch (error) {
      console.error(`Error fetching posts for user ${postID}:`, error);
      return null;
    }
  },

  updatePost: async function (token: string, postID: string, updatedData: FormData) {
    try {
      const data = await postRequest(`posts-update/${postID}`, updatedData, token)
      return data
    } catch (error) {
      console.error(`Error updating post ${postID}:`, error)
      return null
    }
  },

  censorPost: async function (token: string, postID: string) {
    try {
      const data = await postRequest(`posts/${postID}/censor`, new FormData(), token)
      return data
    } catch (error) {
      console.error(`Error censoring post ${postID}:`, error)
      return null
    }
  },

  uncensorPost: async function (token: string, postID: string) {
    try {
      const data = await postRequest(`posts/${postID}/uncensor`, new FormData(), token)
      return data
    } catch (error) {
      console.error(`Error uncensoring post ${postID}:`, error)
      return null
    }
  },

  getReplies: async function (token: string, postId: string) {
    try {
      const data = await getRequest(`posts/${postId}/replies`, token);
      return data;
    } catch (error) {
      console.error(`Error fetching replies for post ${postId}:`, error);
      return null;
    }
  },

  createReply: async function (token: string, postId: string, formData: FormData) {
    try {
      const data = await postRequest(`posts/${postId}/reply`, formData, token);
      return data;
    } catch (error) {
      console.error("Error creating reply:", error);
      return null;
    }
  },

  pinPost: async function (token: string, postId: string) {
    try {
      const data = await postRequest(`posts/${postId}/pin`, new FormData(), token);
      return data;
    } catch (error) {
      console.error(`Error pinning post ${postId}:`, error);
      return null;
    }
  },

  unpinPost: async function (token: string, postId: string) {
    try {
      const data = await postRequest(`posts/${postId}/unpin`, new FormData(), token);
      return data;
    } catch (error) {
      console.error(`Error unpinning post ${postId}:`, error);
      return null;
    }
  },

  searchPosts: async function (token: string, query: string) {
    try {
      const response = await getRequest(`search/posts?q=${encodeURIComponent(query)}`, token);
      return response;
    } catch (error) {
      console.error('Erreur lors de la recherche de posts:', error);
      throw error;
    }
  }
};

export { Post };