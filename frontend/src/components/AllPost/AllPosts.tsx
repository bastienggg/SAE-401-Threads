import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import Post from "../Post/Post";
import SkeletonPost from "../Post/SkeletonPost";
import { Post as PostData } from "../../data/post";

interface PostType {
  id: number;
  content: string;
  created_at: string;
  user: {
    pseudo: string;
    avatar: string;
    id: string;
    is_blocked: boolean;
    read_only?: boolean;
  };
  like_count: number;
  user_liked: boolean;
  media?: string[];
  is_censored?: boolean;
}

interface AllPostsProps {
  token: string;
}

const AllPosts = forwardRef(({ token }: AllPostsProps, ref) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const observerTarget = useRef(null);

  const fetchPosts = async (page: number = 1) => {
    try {
      if (page === 1) {
        setLoading(true);
        setError(null);
      } else {
        setIsLoadingMore(true);
      }

      console.log(`Fetching posts for page ${page}`);
      const data = await PostData.getPost(token, page);
      
      if (!data) {
        console.error('No data received from getPost');
        setError('Erreur lors du chargement des posts');
        return;
      }

      if (page === 1) {
        setPosts(data.posts);
      } else {
        setPosts(prevPosts => [...prevPosts, ...data.posts]);
      }
      setHasMore(data.next_page !== null);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error in fetchPosts:', error);
      setError('Une erreur est survenue lors du chargement des posts');
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const refreshPosts = async () => {
    setCurrentPage(1);
    setHasMore(true);
    await fetchPosts(1);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !loading) {
          fetchPosts(currentPage + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [currentPage, hasMore, isLoadingMore, loading]);

  useImperativeHandle(ref, () => ({
    refreshPosts,
  }));

  useEffect(() => {
    fetchPosts(1);
  }, []);

  return (
    <section className="flex flex-col overflow-y-auto items-center w-full bg-neutral-100 px-2 mb-14">
      {error && (
        <div className="w-full max-w-2xl p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      {posts.map((post) => (
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
          media={post.media}
          isCensored={post.is_censored}
          isReadOnly={post.user.read_only}
        />
      ))}
      {loading && Array.from({ length: 5 }).map((_, index) => <SkeletonPost key={index} />)}
      <div ref={observerTarget} className="w-full h-10">
        {isLoadingMore && <SkeletonPost />}
      </div>
    </section>
  );
});

export default AllPosts;