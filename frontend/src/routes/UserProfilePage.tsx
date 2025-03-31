import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileBanner from "../components/profile-banner/profile-banner";
import ProfileAvatar from "../components/profile-avatar/profile-avatar";
import ProfileHeader from "../components/profile-header/profile-header";
import ProfileInfo from "../components/profile-info/profile-info";
import AllPostsUser from "../components/AllPostUser/AllPostUser";
import Header from "../components/ui/header";
import Navbar from "../components/Navbar/Navbar";
import ProfileSkeleton from "../components/profil-squeleton/ProfileSkeleton";

import { User } from "../data/user";

export default function UserProfilePage() {
    const { userId } = useParams();
    const [user, setUser] = useState({
        email: "",
        pseudo: "",
        bio: "",
        avatar: "",
        place: "",
        banner: "",
        link: "",
        followersCount: 0, // Ajout du compteur d'abonnés
        isFollowing: false, // Ajout de la propriété isFollowing
    });
    const [loading, setLoading] = useState(true);

    const currentUserId = sessionStorage.getItem("id");
    const isCurrentUser = currentUserId === userId;

    useEffect(() => {
        const fetchData = async () => {
            let token = sessionStorage.getItem("Token") || "";
            let data = await User.getUserInfos(token, userId || "");

            setUser({
                email: data.email,
                pseudo: data.pseudo,
                bio: data.bio,
                avatar: data.avatar,
                place: data.place,
                banner: data.banner,
                link: data.link,
                followersCount: data.followersCount, // Récupération du compteur
                isFollowing: data.isFollowing, // Récupération de l'état d'abonnement
            });
            setLoading(false);
        };

        fetchData();
    }, [userId]);

    if (loading) {
        return <ProfileSkeleton />;
    }

    return (
        <main className="flex flex-col items-center justify-start h-screen w-full">
            <Header />
            <div className="w-full max-w-3xl">
                <div className="overflow-hidden">
                    <div className="relative">
                        <ProfileBanner banner={user.banner} />
                        <ProfileAvatar avatar={user.avatar} pseudo={user.pseudo} />
                    </div>

                    <ProfileHeader
                        pseudo={user.pseudo}
                        email={user.email}
                        isCurrentUser={isCurrentUser}
                        followersCount={user.followersCount} // Passage du compteur
                        isFollowing={user.isFollowing} // Passage de l'état d'abonnement
                        userId={userId || ""} // Ajout de l'ID utilisateur
                    />
                    <ProfileInfo bio={user.bio} place={user.place} link={user.link} />
                </div>
            </div>
            <div className="w-full mt-8">
                <AllPostsUser token={sessionStorage.getItem("Token") || ""} userId={userId || ""} />
            </div>
            <Navbar onPostCreated={() => console.log("Post created")} />
        </main>
    );
}