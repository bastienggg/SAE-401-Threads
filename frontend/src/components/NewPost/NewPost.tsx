"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Post } from "../../data/post"
import BlockedPopup from "../BlockedPopup/BlockedPopup"
import { ImageIcon, X } from "lucide-react"
import ImageUploadPopup from "../ImageUploadPopup/ImageUploadPopup"

interface NewPostProps {
  onClose: () => void
  onPostCreated: () => void
}

function NewPost({ onClose, onPostCreated }: NewPostProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [content, setContent] = useState("")
  const [isBlocked, setIsBlocked] = useState(false)
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const pseudo = localStorage.getItem("pseudo")

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handlePost = async () => {
    const pseudo = sessionStorage.getItem("Pseudo") as string;
    const token = sessionStorage.getItem("Token") as string;
  
    // Préparer les données en FormData
    const formData = new FormData();
    formData.append("content", content);
    formData.append("pseudo", pseudo);
  
    // Ajouter les images au FormData
    selectedImages.forEach((image) => {
      formData.append("pictures[]", image);
    });
  
    try {
      console.log("Sending post data as FormData:", formData); // Log pour debug
      const response = await Post.setPost(formData, token);
  
      if (response?.code === "C-3132") {
        console.warn("User is blocked. Showing popup.");
        setIsBlocked(true); // Affiche le popup
        return;
      }
      setIsVisible(false);
      onPostCreated(); // Appelle la fonction de rafraîchissement
    } catch (error) {
      console.error("Error while creating post:", error);
    }
  };

  const handleBlockedPopupClose = () => {
    sessionStorage.clear()
    window.location.href = "/"
  }

  const handleImagesSelected = (images: File[]) => {
    setSelectedImages(images)

    // Generate previews for the selected images
    const newPreviews: string[] = []
    images.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          newPreviews.push(e.target.result as string)
          if (newPreviews.length === images.length) {
            setImagePreviews(newPreviews)
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  

  return (
    <>
      {isBlocked && <BlockedPopup onClose={handleBlockedPopupClose} />}
      <ImageUploadPopup
        isOpen={isImagePopupOpen}
        onClose={() => setIsImagePopupOpen(false)}
        onImagesSelected={handleImagesSelected}
      />
      <div
        className={`fixed h-h-full inset-0 flex items-end justify-center z-10 backdrop-blur-sm transition-transform duration-300 ${isVisible ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="bg-white p-4 rounded shadow-lg relative w-full h-3/4 flex flex-col gap-4">
          <div className="flex flex-row justify-between w-full border-b-2 border-b-neutral-200 p-2">
            <p onClick={onClose} className="hover:cursor-pointer">
              Cancel
            </p>
            <p className="font-bold">New thread</p>
          </div>
          <p className="font-bold">{pseudo}</p>
          <textarea
            className={`border-none w-full h-full focus:outline-none resize-none ${charCount === 250 ? "text-red-500" : ""}`}
            placeholder="Start typing (0/250)"
            maxLength={250}
            onChange={(e) => {
              const length = e.target.value.length
              setCharCount(length)
              setContent(e.target.value)
            }}
          ></textarea>
          <label className={charCount === 250 ? "text-red-500" : ""}>{charCount}/250</label>

          {/* Image gallery */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative h-20 rounded-md overflow-hidden border">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => setIsImagePopupOpen(true)} className="rounded-full">
              <ImageIcon className="h-5 w-5 text-gray-500" />
            </Button>
            <span className="text-sm text-gray-500">
              {selectedImages.length > 0 ? `${selectedImages.length} image(s) selected` : "Add images"}
            </span>
          </div>

          <Button className="w-full hover:cursor-pointer mb-14" onClick={handlePost}>
            Post
          </Button>
        </div>
      </div>
    </>
  )
}

export default NewPost

