import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
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
  pictures?: string[]; // Ajout de la propriété picture
}

interface AllPostsProps {
  token: string;
}

const AllPosts = forwardRef(({ token }: AllPostsProps, ref) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  const fetchPosts = async (page: number) => {
    setLoading(true);
    const data = await PostData.getPost(token, page);
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

  const refreshPosts = async () => {
    setPosts([]);
    setCurrentPage(1);
    setHasMore(true);
    await fetchPosts(1); // Assurez-vous que fetchPosts est asynchrone
  };

  useImperativeHandle(ref, () => ({
    refreshPosts,
  }));

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
      section.addEventListener("scroll", handleScroll);
      return () => section.removeEventListener("scroll", handleScroll);
    }
  }, [hasMore]);

  // Auto-refresh logic
  useEffect(() => {
    const intervalId = setInterval(() => {
      const autoRefresh = sessionStorage.getItem("autoRefresh");
      if (autoRefresh === "true" && document.visibilityState === "visible") {
      refreshPosts();
      }
    }, 300000); 

    return () => clearInterval(intervalId); // Nettoyage de l'intervalle
  }, []);

  return (
    <section
      ref={sectionRef}
      className="h-full flex flex-col overflow-y-auto items-center w-full bg-neutral-100 px-2 mb-14"
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
            likeCount={post.like_count}
            userLiked={post.user_liked}
            isBlocked={post.user.is_blocked}
            pictures={post.pictures} // Passer les images ici
        />
      ))}
      {loading &&
        Array.from({ length: 5 }).map((_, index) => <SkeletonPost key={index} />)}
    </section>
  );
});

export default AllPosts;