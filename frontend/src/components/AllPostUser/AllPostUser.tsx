import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
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
  userId: string;
}

const AllPostsUser = forwardRef(({ token, userId }: AllPostsProps, ref) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const data = await PostData.getUserPosts(token, userId);
    if (data) {
      setPosts(data.posts);
    } else {
      console.error("Error fetching posts");
    }
    setLoading(false);
  };

  const refreshPosts = async () => {
    await fetchPosts();
  };

  useImperativeHandle(ref, () => ({
    refreshPosts,
  }));

  useEffect(() => {
    fetchPosts();
  }, [userId]);

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
    </section>
  );
});

export default AllPostsUser;