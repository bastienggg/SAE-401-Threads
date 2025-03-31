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
  user: {
    pseudo: string;
    avatar: string;
    id: string;
    is_blocked: boolean; // Ajout de la propriété is_blocked
  };
  like_count: number; // Ajout de la propriété like_count
  user_liked: boolean; // Ajout de la propriété user_liked
}
interface AllPostsProps {
    token: string;
    userId: string; // Ajout de la prop userId
  }
  
  export default function AllPostsUser({ token, userId }: AllPostsProps) {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef<HTMLDivElement>(null);
  
    const fetchPosts = async () => {
      setLoading(true);
      const data = await PostData.getUserPosts(token, userId); // Utilisation de userId passé en prop
      if (data) {
        setPosts(prevPosts => {
          const newPosts = data.posts.filter(
            (newPost: PostType) => !prevPosts.some(post => post.id === newPost.id)
          );
          return [...prevPosts, ...newPosts];
        });
        setHasMore(data.next_page !== null);
      } else {
        console.error("Error fetching posts");
      }
      setLoading(false);
    };
  
    useEffect(() => {
      fetchPosts();
    }, [userId]); // Recharger les posts si userId change
  
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
          section.addEventListener("scroll", handleScroll);
          return () => section.removeEventListener("scroll", handleScroll);
      }
  }, [hasMore]);

  return (
      <section
          ref={sectionRef}
          className=" flex flex-col overflow-y-auto items-center w-full bg-neutral-100 px-2 mb-14"
      >
          {posts.map(post => (
           <Post
               key={post.id}
               content={post.content}
               pseudo={post.user.pseudo}
               avatar={post.user.avatar}
               createdAt={post.created_at}
               userId={post.user.id}
               postId={post.id.toString()}
               likeCount={post.like_count} // Passe le nombre de likes
               userLiked={post.user_liked} // Passe si l'utilisateur a liké
               isBlocked={post.user.is_blocked}
           />
          ))}
          {loading &&
              Array.from({ length: 5 }).map((_, index) => <SkeletonPost key={index} />)}
      </section>
  );
}