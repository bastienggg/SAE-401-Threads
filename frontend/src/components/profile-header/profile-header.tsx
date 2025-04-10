import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Follow } from "../../data/follow";
import { Blocked } from "../../data/blocked";
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
    isFollowing,
    userId,
    isBlocked,
    hasBlockedMe
}: ProfileHeaderProps) {
    const [isUserBlocked, setIsUserBlocked] = useState(false);
    const [currentFollowersCount, setCurrentFollowersCount] = useState(followersCount);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlockStatus = async () => {
            const token = sessionStorage.getItem('Token');
            if (!token || isCurrentUser) return;

            try {
                const response = await fetch(`http://localhost:8080/api/users/${userId}/block-status`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setIsUserBlocked(data.isBlocked);
            } catch (error) {
                console.error('Error fetching block status:', error);
            }
        };

        fetchBlockStatus();
    }, [userId, isCurrentUser]);

    const handleFollowClick = async () => {
        let token = sessionStorage.getItem("Token") || "";
        try {
            if (isFollowing) {
                const response = await Follow.unfollowUser(token, userId);
                if (response) {
                    setCurrentFollowersCount((prevCount) => prevCount - 1);
                }
            } else {
                const response = await Follow.followUser(token, userId);
                if (response) {
                    setCurrentFollowersCount((prevCount) => prevCount + 1);
                }
            }
        } catch (error) {
            console.error("Erreur lors de l'action de suivi :", error);
        }
    };

    const handleBlockClick = async () => {
        let token = sessionStorage.getItem("Token") || "";
        try {
            if (isUserBlocked) {
                const response = await Blocked.UnblockUser(token, userId);
                if (response) {
                    setIsUserBlocked(false);
                }
            } else {
                const response = await Blocked.BlockUser(token, userId);
                if (response) {
                    setIsUserBlocked(true);
                }
            }
        } catch (error) {
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
                            className={`hover:cursor-pointer ${isUserBlocked ? 'text-red-500' : ''}`}
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