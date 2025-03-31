import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Follow } from "../../data/follow"; // Import du module Follow
import { useState } from "react";

interface ProfileHeaderProps {
    pseudo: string;
    email: string;
    isCurrentUser: boolean;
    followersCount: number;
    isFollowing: boolean;
    userId: string; // Ajout de l'ID utilisateur
}
export default function ProfileHeader({
    pseudo,
    email,
    isCurrentUser,
    followersCount, // Prop originale
    isFollowing: initialIsFollowing,
    userId,
}: ProfileHeaderProps) {
    const navigate = useNavigate();
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [currentFollowersCount, setCurrentFollowersCount] = useState<number>(followersCount); // Renommé pour éviter la collision

    const handleFollowClick = async () => {
        let token = sessionStorage.getItem("Token") || "";

        console.log("Token : ", token);
        console.log("User ID : ", userId);

        try {
            if (isFollowing) {
                const response = await Follow.unfollowUser(token, userId);
                if (response) {
                    console.log("Se désabonner réussi");
                    setIsFollowing(false); // Met à jour l'état local
                    // Diminue le nombre d'abonnés
                    setCurrentFollowersCount((prevCount) => prevCount - 1);
                } else {
                    console.error("Erreur lors de la désinscription");
                }
            } else {
                const response = await Follow.followUser(token, userId);
                if (response) {
                    console.log("S'abonner réussi");
                    setIsFollowing(true); // Met à jour l'état local
                    // Augmente le nombre d'abonnés
                    setCurrentFollowersCount((prevCount) => prevCount + 1);
                } else {
                    console.error("Erreur lors de l'abonnement");
                }
            }
        } catch (error) {
            console.error("Erreur lors de l'action de suivi :", error);
        }
    };

    return (
        <div className="flex items-center justify-between pt-16 md:pt-20 pb-2 md:pb-4 px-4">
            <div className="flex flex-col space-y-1">
                <h1 className="text-lg md:text-xl font-bold">{pseudo}</h1>
                <h3>{currentFollowersCount} abonnés</h3> {/* Utilisation de l'état local renommé */}
                <div className="flex items-center text-muted-foreground text-sm space-x-4">
                    <span>{email}</span>
                </div>
            </div>
            {isCurrentUser ? (
                <Button
                    onClick={() => navigate("/modify", { state: { pseudo, email } })}
                    className="ml-4 hover:cursor-pointer"
                >
                    Update
                </Button>
            ) : (
                <Button
                    onClick={handleFollowClick}
                    className="ml-4 hover:cursor-pointer"
                >
                    {isFollowing ? "Se désabonner" : "S'abonner"}
                </Button>
            )}
        </div>
    );
}