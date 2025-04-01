import React, { useState, useRef } from 'react';
import  Navbar  from "../components/Navbar/Navbar";
import Header from '../components/ui/header';
import AllPosts from "../components/AllPost/AllPosts";
import NewPost from "../components/NewPost/NewPost";
import RefreshButton from "../components/RefreshButton/RefreshButton";

export default function Home() {
  const [isNewPostVisible, setIsNewPostVisible] = useState(false);
  const token = sessionStorage.getItem('Token') as string;
  const allPostsRef = useRef<{ refreshPosts: () => Promise<void> }>(null);

  const handleRefreshPosts = async () => {
    if (allPostsRef.current) {
      await allPostsRef.current.refreshPosts();
    }
  };

  return (
    <main className="flex flex-col items-center justify-between h-screen">
      <Header />
      <RefreshButton onClick={handleRefreshPosts} />
      <AllPosts ref={allPostsRef} token={token} />
      <div className="w-full bg-white z-10">
        <Navbar onPostCreated={handleRefreshPosts} />
      </div>
      {isNewPostVisible && <NewPost onPostCreated={handleRefreshPosts} onClose={() => setIsNewPostVisible(false)} />}
    </main>
  );
}