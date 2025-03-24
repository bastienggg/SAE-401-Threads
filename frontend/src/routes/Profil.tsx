import React, { useEffect, useState } from 'react';
import ProfileBanner from "../components/profile-banner/profile-banner"
import ProfileAvatar from "../components/profile-avatar/profile-avatar"
import ProfileHeader from "../components/profile-header/profile-header"
import ProfileInfo from "../components/profile-info/profile-info"
import Navbar from "../components/Navbar/Navbar"
import ProfileSkeleton from "../components/profil-squeleton/ProfileSkeleton"

import { User } from "../data/user"

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

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <main className="flex flex-col items-center justify-between h-screen w-full">
      <div className="w-full max-w-3xl">
        <div className="overflow-hidden">
          <div className="relative">
            <ProfileBanner banner={user.banner} />
            <ProfileAvatar avatar={user.avatar} pseudo={user.pseudo} />
          </div>

          <ProfileHeader pseudo={user.pseudo} email={user.email} />
          <ProfileInfo bio={user.bio} place={user.place} link={user.link} />
        </div>
      </div>
      <div className="w-full">
        <Navbar 
          onPostCreated={() => { /* handle post creation */ }} 
        />
      </div>
    </main>
  )
}