import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar/Navbar";
import Post from "../components/Post/Post";
import { Post as PostData } from "../data/post";

interface PostType {
  id: number;
  content: string;
  pseudo: string;
  created_at: string;
  token?: string;
}

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([]);

  const fetchPosts = async () => {
    const token = localStorage.getItem('Token');
    const data = await PostData.getPost(token as string);
    if (data) {
      setPosts(data.posts);
    } else {
      console.error('Error fetching posts');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <main className="flex flex-col items-center justify-between h-screen">
      <div className="flex flex-row item-center p-2 h-20 justify-center w-full fixed top-0 bg-white z-10">
        <img src="./src/assets/Threads_Logo.svg" alt="" />
      </div>
      
      <section className="h-full flex flex-col mt-20 overflow-y-auto items-center">
        {posts.map(post => (
          <Post key={post.id} content={post.content} pseudo={post.pseudo} createdAt={post.created_at} />
        ))}
      </section>
      <div className="w-full  bg-white z-10">
        <Navbar onPostCreated={fetchPosts} />
      </div>
    </main>
  );
}