import React, { useEffect, useState } from 'react';
import ProfileBanner from "../components/profile-banner/profile-banner"
import ProfileAvatar from "../components/profile-avatar/profile-avatar"
import ProfileHeader from "../components/profile-header/profile-header"
import ProfileInfo from "../components/profile-info/profile-info"
import Navbar from "../components/Navbar/Navbar"
import ProfileSkeleton from "../components/profil-squeleton/ProfileSkeleton"
import { Button } from '../components/ui/button';
import Header from '../components/ui/header';

import AllPostsUser from '../components/AllPostUser/AllPostUser';

import { User } from "../data/user"
import { useNavigate } from 'react-router-dom';
export default function ProfilePage() {
  const [user, setUser] = useState({
    email: '',
    pseudo: '',
    bio: '',
    avatar: '',
    place: '',
    banner: '',
    link: '',
  });
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // Ajout d'une clé pour forcer le rafraîchissement
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      let token = sessionStorage.getItem("Token") || '';
      let id = sessionStorage.getItem("id") || '';
      let data = await User.getUserInfos(token, id);

      setUser({
        email: data.email,
        pseudo: data.pseudo,
        bio: data.bio,
        avatar: data.avatar,
        place: data.place,
        banner: data.banner,
        link: data.link,
      });
      setLoading(false);
    };

    fetchData();
  }, []);

  const refreshPosts = () => {
    setRefreshKey(prevKey => prevKey + 1); // Change la clé pour forcer le rafraîchissement
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <main className="flex flex-col items-center justify-start h-screen w-full">
      <Header/>
      <div className="w-full max-w-3xl">
        <div className="overflow-hidden">
          <div className="relative">
            <ProfileBanner banner={user.banner} />
            <ProfileAvatar avatar={user.avatar} pseudo={user.pseudo} />
          </div>

          <ProfileHeader 
            pseudo={user.pseudo} 
            email={user.email} 
            isCurrentUser={true} 
          />
          <ProfileInfo bio={user.bio} place={user.place} link={user.link} />
        </div>
      </div>
      <div className="w-full mt-8">
        <AllPostsUser key={refreshKey} token={sessionStorage.getItem("Token") || ''} userId={sessionStorage.getItem("id") || ''} />
      </div>
      <div className="w-full">
        <Navbar 
          onPostCreated={refreshPosts} // Passe la fonction de rafraîchissement
        />
      </div>
    </main>
  )
}