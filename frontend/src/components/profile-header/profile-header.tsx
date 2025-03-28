import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
    pseudo: string;
    email: string;
    isCurrentUser: boolean; // Ajout de la propriété isCurrentUser
}

export default function ProfileHeader({ pseudo, email, isCurrentUser }: ProfileHeaderProps) {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between pt-16 md:pt-20 pb-2 md:pb-4 px-4">
            <div className="flex flex-col space-y-1">
                <h1 className="text-lg md:text-xl font-bold">{pseudo}</h1>
                <div className="flex items-center text-muted-foreground text-sm">
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
                <Button className="ml-4 hover:cursor-pointer">S'abonner</Button>
            )}
        </div>
    );
}