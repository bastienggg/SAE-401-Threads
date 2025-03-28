import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NewPost from '../NewPost/NewPost';
import Logout from '../logout/logout';

interface NavbarProps {
  onPostCreated: () => void;
}

export default function Navbar({ onPostCreated }: NavbarProps) {
  const [isNewPostVisible, setNewPostVisible] = useState(false);
  const [isLogoutVisible, setLogoutVisible] = useState(false); // Nouvel état pour afficher le composant Logout
  const navigate = useNavigate();
  const location = useLocation();

  const handleIconClick = () => {
      setNewPostVisible(true);
  };

  const handleCloseNewPost = () => {
    setNewPostVisible(false);
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const handleLogoutClick = () => {
    setLogoutVisible(true); // Affiche le composant Logout
    setTimeout(() => {
      setLogoutVisible(false); // Cache le composant Logout après 2 secondes
      sessionStorage.clear(); // Supprime tout le contenu de sessionStorage
      navigateTo('/'); // Redirige vers la page racine
    }, 2000);
  };

  return (
    <>
    <div className="flex flex-row items-center p-4 h-14 justify-between w-full fixed bottom-0 bg-white z-50 border-t-2 border-t-neutral-900">
      <img src="/public/svg/feed.svg" alt="" className="hover:cursor-pointer hover:scale-110 ease-in-out duration-200" onClick={() => navigateTo('/home')} />
      <img src="/public/svg/explore.svg" alt="" className="hover:cursor-pointer hover:scale-110 ease-in-out duration-200" onClick={() => navigateTo('/explore')} />
      <img src="/public/svg/write.svg" alt="" className="hover:cursor-pointer hover:scale-110 ease-in-out duration-200" onClick={handleIconClick} />
      <img src="/public/svg/Rectangle_3.svg" alt="" className="hover:cursor-pointer hover:scale-110 ease-in-out duration-200" onClick={() => navigateTo('/profil')} />
      <img src="/public/svg/logout.svg" alt="" className="hover:cursor-pointer hover:scale-110 ease-in-out duration-200" onClick={handleLogoutClick} />
    </div>
    {isNewPostVisible && (
      <NewPost 
       onClose={handleCloseNewPost} 
       onPostCreated={() => { 
       onPostCreated(); // Appelle la fonction de rafraîchissement
        handleCloseNewPost(); 
       }} 
      />
      )}
    {isLogoutVisible && <Logout />}
  </>
  );
}