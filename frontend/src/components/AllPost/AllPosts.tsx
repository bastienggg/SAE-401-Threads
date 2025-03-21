import React, { useState, useEffect, useRef } from 'react';
import Post from "../Post/Post";
import SkeletonPost from "../Post/SkeletonPost"; // Import SkeletonPost
import { Post as PostData } from "../../data/post";

interface PostType {
  id: number;
  content: string;
  pseudo: string;
  created_at: string;
  token?: string;
}

interface AllPostsProps {
  token: string;
}

export default function AllPosts({ token }: AllPostsProps){
  const [posts, setPosts] = useState<PostType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true); // Add loading state
  const sectionRef = useRef<HTMLDivElement>(null);

  const fetchPosts = async (page: number) => {
    setLoading(true); // Set loading to true when fetching posts
    const data = await PostData.getPost(token, page);
    if (data) {
      setPosts(prevPosts => {
        const newPosts = data.posts.filter((newPost: PostType) => !prevPosts.some(post => post.id === newPost.id));
        return [...prevPosts, ...newPosts];
      });
      setHasMore(data.next_page !== null);
    } else {
      console.error('Error fetching posts');
    }
    setLoading(false); // Set loading to false after fetching posts
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
    <section ref={sectionRef} className="h-full flex flex-col mt-20 overflow-y-auto items-center w-full bg-neutral-100 px-2">
      {posts.map(post => (
        <Post key={post.id} content={post.content} pseudo={post.pseudo} createdAt={post.created_at} />
      ))}
      {loading && Array.from({ length: 5 }).map((_, index) => (
        <SkeletonPost key={index} />
      ))}
    </section>
  );
};