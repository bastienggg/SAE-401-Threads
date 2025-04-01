import { deleteRequest, getRequest, postRequest } from "../lib/api-request";

interface PostType {
    getPost: (token: string, page: number) => Promise<any>;
    setPost: (post: FormData, token: string) => Promise<any>;
    getUserPosts: (token: string, userId: string, page: number) => Promise<any>;
    deletePost:(token:string, postID:string) => Promise<any>;
    updatePost: (token: string, postID: string, updatedData: FormData) => Promise<any>;
    censorPost: (token: string, postID: string) => Promise<any>;
    uncensorPost: (token: string, postID: string) => Promise<any>;
}

let Post: PostType = {
  getPost: async function (token: string, page: number = 1) {
    try {
      let data = await getRequest(`posts?page=${page}`, token);
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
  }
};

export { Post };