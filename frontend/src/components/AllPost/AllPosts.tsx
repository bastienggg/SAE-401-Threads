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
  };
  like_count: number;
  user_liked: boolean;
  media?: string[];
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
  const observerTarget = useRef(null);

  const fetchPosts = async (page: number = 1) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    const data = await PostData.getPost(token, page);
    if (data) {
      if (page === 1) {
        setPosts(data.posts);
      } else {
        setPosts(prevPosts => [...prevPosts, ...data.posts]);
      }
      setHasMore(data.next_page !== null);
      setCurrentPage(page);
    } else {
      console.error("Error fetching posts");
    }
    setLoading(false);
    setIsLoadingMore(false);
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