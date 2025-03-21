import React, { useState } from 'react';
import Navbar from "../components/Navbar/Navbar";
import Header from '../components/ui/header';
import AllPosts from "../components/AllPost/AllPosts";
import NewPost from "../components/NewPost/NewPost"; // Assurez-vous d'importer NewPost

export default function Home() {
  const [isNewPostVisible, setIsNewPostVisible] = useState(false);
  const token = sessionStorage.getItem('Token') as string;

  return (
    <main className="flex flex-col items-center justify-between h-screen">
      <Header />
      <AllPosts token={token} />
      <div className="w-full bg-white z-10">
        <Navbar onPostCreated={() => window.location.reload()} />
      </div>
      {isNewPostVisible && <NewPost onClose={() => setIsNewPostVisible(false)} onPostCreated={() => window.location.reload()} />}
    </main>
  );
}