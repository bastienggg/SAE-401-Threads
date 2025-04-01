import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Follow } from "../../data/follow";
import { Blocked } from "../../data/blocked";
import { useState } from "react";
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

    const handleBlockClick = async () => {
        let token = sessionStorage.getItem("Token") || "";
        console.log('Attempting to block/unblock:', { isBlocked, userId });

        try {
            if (isBlocked) {
                const response = await Blocked.UnblockUser(token, userId);
                if (response) {
                    setIsBlocked(false);
                    console.log('Unblocked successfully');
                }
            } else {
                const response = await Blocked.BlockUser(token, userId);
                if (response) {
                    setIsBlocked(true);
                    console.log('Blocked successfully');
                }
            }
        } catch (error: any) {
            console.error("Erreur lors du blocage/déblocage :", error);
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
                            onClick={handleBlockClick}
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