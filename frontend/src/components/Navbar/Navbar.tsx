import React, { useState } from 'react';
import NewPost from '../NewPost/NewPost';

interface NavbarProps {
  onPostCreated: () => void;
}

export default function Navbar({ onPostCreated }: NavbarProps) {
  const [isNewPostVisible, setNewPostVisible] = useState(false);

  const handleIconClick = () => {
    setNewPostVisible(true);
  };

  const handleCloseNewPost = () => {
    setNewPostVisible(false);
  };

  return (
    <>
      <div className="flex flex-row item-center p-4 h-14 justify-between w-full sticky bg-white b-0 z-50">
        <img src="./src/assets/svg/feed.svg" alt="" className="hover:cursor-pointer hover:scale-110 ease-in-out duration-200" onClick={handleIconClick} />
        <img src="./src/assets/svg/explore.svg" alt="" className="hover:cursor-pointer hover:scale-110 ease-in-out duration-200" onClick={handleIconClick} />
        <img src="./src/assets/svg/write.svg" alt="" className="hover:cursor-pointer hover:scale-110 ease-in-out duration-200" onClick={handleIconClick} />
        <img src="./src/assets/svg/heart.svg" alt="" className="hover:cursor-pointer hover:scale-110 ease-in-out duration-200" onClick={handleIconClick} />
        <img src="./src/assets/svg/Rectangle_3.svg" alt="" className="hover:cursor-pointer hover:scale-110 ease-in-out duration-200" onClick={handleIconClick} />
      </div>
      {isNewPostVisible && <NewPost onClose={handleCloseNewPost} onPostCreated={() => { onPostCreated(); handleCloseNewPost(); }} />}
    </>
  );
}