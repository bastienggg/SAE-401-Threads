import { useEffect, useState } from "react";
import { Post as PostAPI } from "../../data/post";
import ConfirmDelete from "../confirmDelete/confirmDelete";
import { useNavigate } from "react-router-dom";
import { Like } from "../../data/like";

interface PostProps {
    content: string;
    pseudo: string;
    createdAt: string;
    avatar: string;
    userId: string;
    postId: string;
    likeCount: number; // Nouvelle prop pour le nombre de likes
    userLiked: boolean; // Nouvelle prop pour indiquer si l'utilisateur a liké
}

function timeSince(date: Date) {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

export default function Post({ content, createdAt, pseudo, avatar, userId, postId, likeCount, userLiked }: PostProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isLiked, setIsLiked] = useState(userLiked); // Initialisé avec la valeur de userLiked
    const [likes, setLikes] = useState(likeCount); // Initialisé avec la valeur de likeCount
    const navigate = useNavigate();

    const currentUserId = Number(sessionStorage.getItem("id"));
    const isCurrentUser = currentUserId === Number(userId);
    const token = sessionStorage.getItem("Token");

    const handleLike = async () => {
        if (!token) {
            console.error("Token non trouvé");
            return;
        }

        try {
            const response = await Like.AddLike(token, postId);
            if (response) {
                console.log("Post liké avec succès");
                setIsLiked(true);
                setLikes(likes + 1); // Incrémente le nombre de likes
            } else {
                console.error("Erreur lors du like du post");
            }
        } catch (error) {
            console.error("Erreur lors de l'appel à AddLike :", error);
        }
    };

    const handleUnlike = async () => {
        if (!token) {
            console.error("Token non trouvé");
            return;
        }

        try {
            const response = await Like.Deletelike(token, postId);
            if (response) {
                console.log("Like supprimé avec succès");
                setIsLiked(false);
                setLikes(likes - 1); // Décrémente le nombre de likes
            } else {
                console.error("Erreur lors de la suppression du like");
            }
        } catch (error) {
            console.error("Erreur lors de l'appel à Deletelike :", error);
        }
    };

    const handleDelete = async () => {
        if (!token) {
            console.error("Token non trouvé");
            return;
        }

        try {
            const response = await PostAPI.deletePost(token, postId);
            if (response) {
                console.log("Post supprimé avec succès");
                setIsVisible(false);
            } else {
                console.error("Erreur lors de la suppression du post");
            }
        } catch (error) {
            console.error("Erreur lors de l'appel à deletePost :", error);
        }
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div
            className="flex flex-col gap-4 p-4 w-full bg-white rounded-md shadow-md my-2"
            onDoubleClick={isLiked ? handleUnlike : handleLike} // Ajout de l'événement onDoubleClick
        >
            <div className="flex flex-row gap-4 items-start">
                <img
                    src={avatar || "/public/profil/default.jpg"}
                    alt="profil"
                    className="w-9 aspect-square rounded-full"
                />
                <div className="w-full flex flex-col gap-2">
                    <div className="flex flex-row items-center gap-2 justify-between w-full">
                        <p
                            className="font-bold text-neutral-900 hover:cursor-pointer hover:underline"
                            onClick={() => navigate(`/profile/${userId}`)}
                        >
                            @{pseudo}
                        </p>
                        <p className="text-xs text-neutral-700">{timeSince(new Date(createdAt))} ago</p>
                    </div>
                    <p>{content}</p>
                </div>
            </div>
            <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-2">
                    <img
                        src={isLiked ? "/public/svg/heart-filled.svg" : "/public/svg/heart.svg"}
                        className="w-5 h-5 hover:cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out"
                        alt={isLiked ? "Unlike" : "Like"}
                        onClick={isLiked ? handleUnlike : handleLike}
                    />
                    <span className="text-sm text-neutral-700">{likes}</span>
                </div>
                {isCurrentUser && (
                    <img
                        src="/public/svg/trash.svg"
                        className="w-5 h-5 hover:cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out"
                        alt="Supprimer"
                        onClick={() => setShowConfirm(true)}
                    />
                )}
            </div>
            {showConfirm && (
                <ConfirmDelete
                    onConfirm={() => {
                        handleDelete();
                        setShowConfirm(false);
                    }}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </div>
    );
}