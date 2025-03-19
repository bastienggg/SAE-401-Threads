import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar/Navbar";
import Post from "../components/Post/Post";
import { Post as PostData } from "../data/post";
import NewPost from "../components/NewPost/NewPost"; // Assurez-vous d'importer NewPost

interface PostType {
  id: number;
  content: string;
  pseudo: string;
  created_at: string;
  token?: string;
}

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isNewPostVisible, setIsNewPostVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('Token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const fetchPosts = async (page: number) => {
    const token = sessionStorage.getItem('Token');
    const data = await PostData.getPost(token as string, page);
    if (data) {
      setPosts(prevPosts => {
        // Filter out any duplicate posts
        const newPosts = data.posts.filter((newPost: PostType) => !prevPosts.some(post => post.id === newPost.id));
        return [...prevPosts, ...newPosts];
      });
      setHasMore(data.next_page !== null);
    } else {
      console.error('Error fetching posts');
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const handleScroll = () => {
    if (sectionRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = sectionRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 1 && hasMore) {
        setCurrentPage(prevPage => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (section) {
      section.addEventListener('scroll', handleScroll);
      return () => section.removeEventListener('scroll', handleScroll);
    }
  }, [hasMore]);

  return (
    <main className="flex flex-col items-center justify-between h-screen">
      <div className="flex flex-row item-center p-2 h-20 justify-center w-full fixed top-0 bg-white z-10">
        <img src="./src/assets/Threads_Logo.svg" alt="" />
      </div>
      
      <section ref={sectionRef} className="h-full flex flex-col mt-20 overflow-y-auto items-center">
        {posts.map(post => (
            <Post key={post.id} content={post.content} pseudo={post.pseudo} createdAt={post.created_at} />
        ))}
      </section>
      <div className="w-full bg-white z-10">
        <Navbar onPostCreated={() => {
          setPosts([]);
          setCurrentPage(1);
          fetchPosts(1);
        }} />
      </div>
      {isNewPostVisible && <NewPost onClose={() => setIsNewPostVisible(false)} onPostCreated={() => {
        setPosts([]);
        setCurrentPage(1);
        fetchPosts(1);
      }} />}
    </main>
  );
}