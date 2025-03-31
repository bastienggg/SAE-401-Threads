import { Button } from "../ui/button";

interface BlockedPopupProps {
  onClose: () => void;
}

function BlockedPopup({ onClose }: BlockedPopupProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-20 backdrop-blur-sm bg-black/50">
      <div className="bg-white p-6 rounded shadow-lg text-center">
        <h2 className="text-xl font-bold mb-4">Account Blocked</h2>
        <p className="mb-4">Your account has been blocked. You will be logged out and redirected to the home page.</p>
        <Button
          className="hover:cursor-pointer w-full"
          variant="destructive"
          onClick={onClose}
        >
          OK
        </Button>
      </div>
    </div>
  );
}

export default BlockedPopup;