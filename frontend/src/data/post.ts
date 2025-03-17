import { getRequest, postRequest } from "../lib/api-request";

interface PostType {
    getPost: () => Promise<any>;
    setPost: (post: { content: string, pseudo: string }) => Promise<any>;
}

let Post: PostType = {
  getPost: async function () {
    try {
      let data = await getRequest("posts/");
      return data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return null;
    }
  },

  setPost: async function (post: { content: string, pseudo: string }) {
    if (post.pseudo && post.content) {
      try {
        console.log('Sending post data:', post); // Log the data being sent
        let data = await postRequest("posts/", post);
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
  }
};

export { Post };