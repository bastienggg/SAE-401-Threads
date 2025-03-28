import { deleteRequest, getRequest, postRequest } from "../lib/api-request";

interface PostType {
    getPost: (token: string, page: number) => Promise<any>;
    setPost: (post: { content: string, pseudo: string }, token: string) => Promise<any>;
    getUserPosts: (token: string, userId: string) => Promise<any> ;
    deletePost:(token:string, postID:string) => Promise<any>;

    
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

  setPost: async function (post: { content: string, pseudo: string }, token: string) {
    if (post.pseudo && post.content) {
      try {
        console.log('Sending post data:', post); // Log the data being sent
        let data = await postRequest("posts", post, token);
        console.log('Response data:', data); // Log the response data
        return data;
      } catch (error) {
        console.error('Error posting:', error);
        return null;
      }
    } else {
      console.error('Pseudo or content is missing');
      return null;
    }
  },

  getUserPosts: async function (token: string, userId: string) {
    try {
      let data = await getRequest(`user/${userId}/posts`, token);
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
  }
};

export { Post };