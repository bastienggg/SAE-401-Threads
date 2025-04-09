import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Follow } from "../../data/follow";
import { UserBlock } from "../../data/blocked";
import { useState, useEffect } from "react";
import { Ban } from "lucide-react";

interface ProfileHeaderProps {
    pseudo: string;
    email: string;
    isCurrentUser: boolean;
    followersCount: number;
    isFollowing: boolean;
    userId: string;
    isBlocked?: boolean;
    hasBlockedMe?: boolean;
}

export default function ProfileHeader({
    pseudo,
    email,
    isCurrentUser,
    followersCount,
    isFollowing: initialIsFollowing,
    userId,
    isBlocked: initialIsBlocked = false,
    hasBlockedMe: initialHasBlockedMe = false,
}: ProfileHeaderProps) {
    const navigate = useNavigate();
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [currentFollowersCount, setCurrentFollowersCount] = useState(followersCount);
    const [isBlocked, setIsBlocked] = useState(initialIsBlocked);
    const [hasBlockedMe, setHasBlockedMe] = useState(initialHasBlockedMe);

    // Vérifier l'état de blocage au chargement
    useEffect(() => {
        const checkBlockStatus = async () => {
            const token = sessionStorage.getItem("Token");
            if (!token || isCurrentUser) return;

            try {
                // Vérifier si l'utilisateur courant a bloqué l'utilisateur cible
                const blockedUsers = await UserBlock.getBlockedUsers(token);
                const isUserBlocked = blockedUsers.some((user: { id: number }) => user.id.toString() === userId);
                setIsBlocked(isUserBlocked);

                // Vérifier si l'utilisateur cible a bloqué l'utilisateur courant
                const response = await fetch(`http://localhost:8080/api/is-blocked/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setHasBlockedMe(data.isBlocked);
            } catch (error) {
                console.error("Erreur lors de la vérification du statut de blocage:", error);
            }
        };

        checkBlockStatus();
    }, [userId, isCurrentUser]);

    console.log('ProfileHeader received hasBlockedMe:', initialHasBlockedMe);

    console.log('Initial states:', {
        isFollowing: initialIsFollowing,
        isBlocked: initialIsBlocked,
        hasBlockedMe: initialHasBlockedMe,
    });

    const handleFollowClick = async () => {
        let token = sessionStorage.getItem("Token") || "";
        console.log('Attempting to follow/unfollow:', { isFollowing, userId });

        try {
            if (isFollowing) {
                const response = await Follow.unfollowUser(token, userId);
                if (response) {
                    setIsFollowing(false);
                    setCurrentFollowersCount((prevCount) => prevCount - 1);
                    console.log('Unfollowed successfully');
                }
            } else {
                const response = await Follow.followUser(token, userId);
                if (response) {
                    setIsFollowing(true);
                    setCurrentFollowersCount((prevCount) => prevCount + 1);
                    console.log('Followed successfully');
                }
            }
        } catch (error) {
            console.error("Erreur lors de l'action de suivi :", error);
        }
    };

    const handleBlock = async () => {
        const token = sessionStorage.getItem("Token");
        if (!token) return;

        try {
            if (isBlocked) {
                await UserBlock.unblockUser(token, userId);
            } else {
                await UserBlock.blockUser(token, userId);
            }
            setIsBlocked(!isBlocked);
        } catch (error) {
            console.error("Erreur lors du blocage/déblocage de l'utilisateur:", error);
        }
    };

    return (
        <div className="flex items-center justify-between pt-16 md:pt-20 pb-2 md:pb-4 px-4">
            <div className="flex flex-col space-y-1">
                <h1 className="text-lg md:text-xl font-bold">{pseudo}</h1>
                <h3>{currentFollowersCount} abonnés</h3>
                <div className="flex items-center text-muted-foreground text-sm space-x-4">
                    <span>{email}</span>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                {!isCurrentUser && (
                    <>
                        <Button
                            onClick={handleBlock}
                            variant="ghost"
                            size="default"
                            className={`hover:cursor-pointer ${isBlocked ? 'text-red-500' : ''}`}
                        >
                            <Ban className="h-5 w-5" />
                        </Button>
                        {hasBlockedMe ? (
                            <div className="text-sm text-red-500 font-medium">
                                Cet utilisateur vous a bloqué
                            </div>
                        ) : (
                            <Button
                                onClick={handleFollowClick}
                                className="hover:cursor-pointer"
                            >
                                {isFollowing ? "Se désabonner" : "S'abonner"}
                            </Button>
                        )}
                    </>
                )}
                {isCurrentUser && (
                    <Button
                        onClick={() => navigate("/modify", { state: { pseudo, email } })}
                        className="hover:cursor-pointer"
                    >
                        Update
                    </Button>
                )}
            </div>
        </div>
    );
}