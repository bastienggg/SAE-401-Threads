import { useState } from "react";
import { Button } from "../ui/button";
import { Post } from "../../data/post";
import { MessageCircle, X, Image, Video } from "lucide-react";

interface ReplyProps {
  postId: string;
  onReplyPosted: () => void;
  isBlocked: boolean;
  hasBlockedMe: boolean;
}

export default function Reply({ postId, onReplyPosted, isBlocked, hasBlockedMe }: ReplyProps) {
  const [isReplyFormVisible, setIsReplyFormVisible] = useState(false);
  const [content, setContent] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [media, setMedia] = useState<File[]>([]);
  const token = sessionStorage.getItem("Token");

  const handleReply = async () => {
    if (!token) return;
    try {
      const formData = new FormData();
      if (content.trim()) {
        formData.append('content', content);
      }
      media.forEach((file, index) => {
        formData.append(`media[${index}]`, file);
      });
      const response = await Post.createReply(token, postId, formData);
      if (response) {
        setContent("");
        setMedia([]);
        setIsReplyFormVisible(false);
        onReplyPosted();
      }
    } catch (error) {
      console.error("Erreur lors de la publication de la réponse:", error);
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newMedia = Array.from(e.target.files);
      setMedia([...media, ...newMedia]);
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  if (isBlocked || hasBlockedMe) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="text-neutral-600 hover:text-blue-500"
        onClick={() => setIsReplyFormVisible(true)}
      >
        <MessageCircle className="h-4 w-4 mr-1" />
        Répondre
      </Button>

      {isReplyFormVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Répondre</h3>
              <Button
                variant="ghost"
                onClick={() => setIsReplyFormVisible(false)}
                className="rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <textarea
              className="w-full min-h-[100px] border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              placeholder="Écrivez votre réponse..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setCharCount(e.target.value.length);
              }}
              maxLength={250}
            />
            <div className="flex justify-between items-center mb-4">
              <span className={`text-sm ${charCount === 250 ? "text-red-500" : "text-gray-500"}`}>
                {charCount}/250
              </span>
            </div>

            <div className="mb-4">
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleMediaChange}
                className="hidden"
                id="media-upload"
              />
              <label
                htmlFor="media-upload"
                className="cursor-pointer inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Image className="h-4 w-4 mr-1" />
                Ajouter des médias
              </label>
            </div>

            {media.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Médias ajoutés :</h4>
                <div className="grid grid-cols-2 gap-2">
                  {media.map((file, index) => (
                    <div key={index} className="relative group">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Media ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md"
                        />
                      ) : file.type.startsWith('video/') ? (
                        <video
                          src={URL.createObjectURL(file)}
                          className="w-full h-32 object-cover rounded-md"
                        />
                      ) : null}
                      <button
                        onClick={() => handleRemoveMedia(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsReplyFormVisible(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleReply}
                disabled={!content.trim() && media.length === 0}
              >
                Répondre
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 