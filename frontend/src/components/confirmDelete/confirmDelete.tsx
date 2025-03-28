import { Button } from "../ui/button";

interface ConfirmDeleteProps {
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDelete({ onConfirm, onCancel }: ConfirmDeleteProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-5 rounded-lg text-center shadow-lg">
                <p className="mb-4">Êtes-vous sûr de vouloir supprimer ce post ?</p>
                <div className="flex justify-center gap-4">
                    <Button
                        onClick={onConfirm}
                        variant="destructive"
                        size="default"
                        className="hover:cursor-pointer"
                    >
                        Supprimer
                    </Button>
                    <Button
                        onClick={onCancel}
                        variant="secondary"
                        size="default"
                        className="hover:cursor-pointer"
                    >
                        Annuler
                    </Button>
                </div>
            </div>
        </div>
    );
}