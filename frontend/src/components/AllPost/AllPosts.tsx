import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import Post from "../Post/Post";
import SkeletonPost from "../Post/SkeletonPost";
import { Post as PostData } from "../../data/post";
import { UserBlock } from "../../data/blocked";

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

interface AllPostsProps {
  token: string;
}

const AllPosts = forwardRef(({ token }: AllPostsProps, ref) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blockedUsers, setBlockedUsers] = useState<{[key: string]: boolean}>({});
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = async (page: number = 1) => {
    try {
      console.log("Début du chargement des posts pour la page:", page);
      
      if (page === 1) {
        setLoading(true);
        setError(null);
      }

      console.log(`Fetching posts for page ${page}`);
      const data = await PostData.getPost(token, page);
      
      if (!data) {
        console.error('No data received from getPost');
        setError('Erreur lors du chargement des posts');
        return;
      }

      console.log("Données reçues:", {
        postsCount: data.posts?.length,
        nextPage: data.next_page,
        currentPage: page
      });

      if (page === 1) {
        setPosts(data.posts);
      } else {
        setPosts(prevPosts => [...prevPosts, ...data.posts]);
      }

      setHasMore(data.posts?.length > 0 && data.next_page !== null);
      setCurrentPage(page);

      // Vérifier le statut de blocage pour chaque post
      const blockedStatus: {[key: string]: boolean} = {};
      for (const post of data.posts) {
        const blockedData = await UserBlock.isUserBlocked(token, post.user.id);
        blockedStatus[post.user.id] = blockedData.isBlocked;
      }
      setBlockedUsers(prev => ({...prev, ...blockedStatus}));
    } catch (error) {
      console.error('Error in fetchPosts:', error);
      setError('Une erreur est survenue lors du chargement des posts');
    } finally {
      setLoading(false);
    }
  };

  const attachObserver = () => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        console.log("Dernier post visible, chargement de la page suivante");
        setCurrentPage(prevPage => prevPage + 1);
      }
    }, {
      threshold: 0.5,
      rootMargin: '100px'
    });

    if (lastPostElementRef.current) {
      observer.current.observe(lastPostElementRef.current);
      console.log("Observer attaché au dernier post");
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  useEffect(() => {
    attachObserver();
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, hasMore, posts.length]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchPosts(currentPage);
    }
  }, [currentPage]);

  const refreshPosts = async () => {
    setCurrentPage(1);
    setPosts([]);
    setHasMore(true);
    await fetchPosts(1);
  };

  useImperativeHandle(ref, () => ({
    refreshPosts,
  }));

  return (
    <section className="flex flex-col overflow-y-auto items-center w-full bg-neutral-100 px-2 mb-14">
      {error && (
        <div className="w-full max-w-2xl p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      {posts.map((post, index) => (
        <div 
          key={post.id} 
          ref={index === posts.length - 1 ? lastPostElementRef : null}
          className="w-full max-w-2xl mb-4"
        >
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
            hasBlockedMe={blockedUsers[post.user.id] || false}
            media={post.media}
            refreshPosts={refreshPosts}
            isCensored={post.is_censored}
            isPinned={post.is_pinned}
            repliesCount={post.replies_count}
          />
        </div>
      ))}
      {loading && Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="w-full max-w-2xl mb-4">
          <SkeletonPost />
        </div>
      ))}
      {hasMore && !loading && (
        <div className="w-full max-w-2xl mb-4">
          <SkeletonPost />
        </div>
      )}
    </section>
  );
});

export default AllPosts;