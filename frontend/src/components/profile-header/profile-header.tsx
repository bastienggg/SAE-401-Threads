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
}

export default function ProfileHeader({
    pseudo,
    email,
    isCurrentUser,
    followersCount,
    isFollowing: initialIsFollowing,
    userId,
    isBlocked: initialIsBlocked = false,
}: ProfileHeaderProps) {
    const navigate = useNavigate();
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isBlocked, setIsBlocked] = useState(initialIsBlocked);
    const [currentFollowersCount, setCurrentFollowersCount] = useState<number>(followersCount);

    const handleFollowClick = async () => {
        let token = sessionStorage.getItem("Token") || "";

        try {
            if (isFollowing) {
                const response = await Follow.unfollowUser(token, userId);
                if (response) {
                    setIsFollowing(false);
                    setCurrentFollowersCount((prevCount) => prevCount - 1);
                }
            } else {
                const response = await Follow.followUser(token, userId);
                if (response) {
                    setIsFollowing(true);
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
            if (isBlocked) {
                const response = await Blocked.UnblockUser(token, userId);
                if (response) {
                    setIsBlocked(false);
                }
            } else {
                const response = await Blocked.BlockUser(token, userId);
                if (response) {
                    setIsBlocked(true);
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
                            className={`hover:cursor-pointer ${isBlocked ? 'text-red-500' : ''}`}
                        >
                            <Ban className="h-5 w-5" />
                        </Button>
                        <Button
                            onClick={handleFollowClick}
                            className="hover:cursor-pointer"
                        >
                            {isFollowing ? "Se désabonner" : "S'abonner"}
                        </Button>
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