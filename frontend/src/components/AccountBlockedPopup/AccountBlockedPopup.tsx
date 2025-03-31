import React from "react";
import { Button } from "../ui/button";

interface AccountBlockedPopupProps {
  onClose: () => void;
}

export function AccountBlockedPopup({ onClose }: AccountBlockedPopupProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
        <h2 className="text-lg font-bold mb-4">Account Blocked</h2>
        <p className="text-sm text-neutral-800 mb-6">
          Your account has been temporarily blocked due to suspicious activity.
        </p>
        <Button onClick={onClose} className="hover:cursor-pointer w-full" variant="destructive" >
          Close
        </Button>
      </div>
    </div>
  );
}