import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileBanner from "../components/profile-banner/profile-banner";
import ProfileAvatar from "../components/profile-avatar/profile-avatar";
import ProfileHeader from "../components/profile-header/profile-header";
import ProfileInfo from "../components/profile-info/profile-info";
import AllPostsUser from "../components/AllPostUser/AllPostUser";
import Header from "../components/ui/header";
import Navbar from "../components/Navbar/Navbar";

import { User } from "../data/user";
export default function UserProfilePage() {
    const { userId } = useParams(); // Récupère l'ID de l'utilisateur depuis l'URL
    const [user, setUser] = useState({
        email: "",
        pseudo: "",
        bio: "",
        avatar: "",
        place: "",
        banner: "",
        link: "",
    });
    const [loading, setLoading] = useState(true);

    const currentUserId = sessionStorage.getItem("id"); // ID de l'utilisateur connecté
    const isCurrentUser = currentUserId === userId; // Vérifie si c'est le profil de l'utilisateur connecté

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
            });
            setLoading(false);
        };

        fetchData();
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
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
                        isCurrentUser={isCurrentUser} // Passe la propriété isCurrentUser
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