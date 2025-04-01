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
import BlockedUsersList from "../components/BlockedUsersList/BlockedUsersList";
import { Blocked } from "../data/blocked";

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
        followersCount: 0,
        isFollowing: false,
        isBlocked: false,
        hasBlockedMe: false,
    });
    const [loading, setLoading] = useState(true);

    const currentUserId = sessionStorage.getItem("id");
    const isCurrentUser = currentUserId === userId;

    useEffect(() => {
        const fetchData = async () => {
            let token = sessionStorage.getItem("Token") || "";
            
            // Vérifier d'abord si l'utilisateur nous a bloqué
            let hasBlockedMe = false;
            try {
                const isBlockedResponse = await fetch(`http://localhost:8080/api/is-blocked/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const isBlockedData = await isBlockedResponse.json();
                hasBlockedMe = isBlockedData.isBlocked;
                console.log('API response for isBlocked:', isBlockedData);
            } catch (error) {
                console.error("Erreur lors de la vérification du blocage:", error);
            }

            // Si l'utilisateur nous a bloqué, on ne charge pas les données
            if (hasBlockedMe) {
                setUser(prev => ({
                    ...prev,
                    hasBlockedMe: true,
                    email: "Utilisateur bloqué",
                    pseudo: "Utilisateur bloqué",
                    bio: "Vous ne pouvez pas voir le profil de cet utilisateur car il vous a bloqué",
                    followersCount: 0,
                    isFollowing: false,
                }));
                setLoading(false);
                console.log('User has blocked me, updating state:', { hasBlockedMe: true });
                return;
            }

            // Sinon, on charge les données normalement
            let data = await User.getUserInfos(token, userId || "");
            setUser({
                email: data.email,
                pseudo: data.pseudo,
                bio: data.bio,
                avatar: data.avatar,
                place: data.place,
                banner: data.banner,
                link: data.link,
                followersCount: data.followersCount,
                isFollowing: data.isFollowing,
                isBlocked: data.isBlocked,
                hasBlockedMe: false,
            });
            setLoading(false);
            console.log('User data loaded, updating state:', { hasBlockedMe: false });
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
                        followersCount={user.followersCount}
                        isFollowing={user.isFollowing}
                        userId={userId || ""}
                        isBlocked={user.isBlocked}
                        hasBlockedMe={user.hasBlockedMe}
                    />
                    <ProfileInfo bio={user.bio} place={user.place} link={user.link} />
                </div>
            </div>
            {!user.hasBlockedMe && (
                <div className="w-full mt-8">
                    <AllPostsUser token={sessionStorage.getItem("Token") || ""} userId={userId || ""} />
                </div>
            )}
            {isCurrentUser && (
                <div className="w-full max-w-3xl mt-8">
                    <BlockedUsersList />
                </div>
            )}
            <Navbar onPostCreated={() => console.log("Post created")} />
        </main>
    );
}