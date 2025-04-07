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
  is_pinned?: boolean;
  replies_count: number;
}

interface AllPostsUserProps {
  token: string;
  userId: string;
}

const AllPostsUser = forwardRef(({ token, userId }: AllPostsUserProps, ref) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = async (pageNum: number) => {
    try {
      const data = await PostData.getUserPosts(token, userId, pageNum);
      if (data && data.posts) {
        if (pageNum === 1) {
          setPosts(data.posts);
        } else {
          setPosts(prev => [...prev, ...data.posts]);
        }
        setHasMore(data.posts.length > 0);
      }
    } catch (err) {
      setError("Erreur lors du chargement des posts");
      console.error("Erreur lors du chargement des posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  useEffect(() => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (lastPostElementRef.current) {
      observer.current.observe(lastPostElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, hasMore]);

  useImperativeHandle(ref, () => ({
    refreshPosts: async () => {
      setPage(1);
      setPosts([]);
      setLoading(true);
      await fetchPosts(1);
    }
  }));

  const refreshPosts = async () => {
    setPage(1);
    setPosts([]);
    setLoading(true);
    await fetchPosts(1);
  };

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  // Séparer les posts épinglés et non épinglés
  const pinnedPosts = posts.filter(post => post.is_pinned);
  const unpinnedPosts = posts.filter(post => !post.is_pinned);

  return (
    <div className="w-full max-w-3xl mx-auto mb-14">
      {/* Posts épinglés */}
      {pinnedPosts.length > 0 && (
        <div className="mb-6">
          <div className="bg-blue-50 p-3 rounded-lg mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            <span className="text-blue-600 font-medium">Tweets épinglés</span>
          </div>
          <div className="space-y-4">
            {pinnedPosts.map((post, index) => (
              <div key={post.id} ref={index === pinnedPosts.length - 1 ? lastPostElementRef : null}>
                <div className="relative">
                  <div className="absolute -left-2 top-0 bottom-0 w-1 bg-blue-500 rounded-full"></div>
                  <Post
                    content={post.content}
                    pseudo={post.user.pseudo}
                    createdAt={post.created_at}
                    avatar={post.user.avatar}
                    userId={post.user.id}
                    postId={post.id.toString()}
                    likeCount={post.like_count}
                    userLiked={post.user_liked}
                    isBlocked={post.user.is_blocked}
                    media={post.media}
                    refreshPosts={refreshPosts}
                    isCensored={post.is_censored}
                    isPinned={true}
                    repliesCount={post.replies_count}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posts non épinglés */}
      {loading && page === 1 ? (
        Array(3).fill(0).map((_, index) => (
          <SkeletonPost key={index} />
        ))
      ) : (
        <div className="space-y-4">
          {unpinnedPosts.map((post, index) => (
            <div key={post.id} ref={index === unpinnedPosts.length - 1 ? lastPostElementRef : null}>
              <Post
                content={post.content}
                pseudo={post.user.pseudo}
                createdAt={post.created_at}
                avatar={post.user.avatar}
                userId={post.user.id}
                postId={post.id.toString()}
                likeCount={post.like_count}
                userLiked={post.user_liked}
                isBlocked={post.user.is_blocked}
                media={post.media}
                refreshPosts={refreshPosts}
                isCensored={post.is_censored}
                isPinned={false}
                repliesCount={post.replies_count}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

AllPostsUser.displayName = "AllPostsUser";

export default AllPostsUser;