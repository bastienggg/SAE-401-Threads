import { useState } from "react";
import { Button } from "../ui/button";
import { FaSpinner } from "react-icons/fa"; // Import d'une icône de spinner

interface RefreshButtonProps {
  onClick: () => Promise<void>;
}

export default function RefreshButton({ onClick }: RefreshButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await onClick();
    setIsLoading(false);
  };

  return (
    <Button
      onClick={handleClick}
      variant="default"
      size="default"
      className="my-4 hover:cursor-pointer"
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <FaSpinner className="animate-spin text-lg" /> {/* Spinner animé */}
          Chargement...
        </span>
      ) : (
        "Actualiser les posts"
      )}
    </Button>
  );
}