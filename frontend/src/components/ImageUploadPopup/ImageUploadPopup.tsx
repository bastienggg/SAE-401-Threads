"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Upload } from "lucide-react"
import { Button } from "../ui/button"

interface ImageUploadPopupProps {
  isOpen: boolean
  onClose: () => void
  onImagesSelected: (images: File[]) => void
}

export default function ImageUploadPopup({ isOpen, onClose, onImagesSelected }: ImageUploadPopupProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<{ type: "image" | "video"; url: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)

      // Vérifiez si le total des fichiers dépasse 4
      if (selectedFiles.length + newFiles.length > 4) {
        alert("You can only upload up to 4 media files.")
        return
      }

      setSelectedFiles((prev) => [...prev, ...newFiles])

      // Generate previews for the new files
      newFiles.forEach((file) => {
        const fileType = file.type.startsWith("image") ? "image" : file.type.startsWith("video") ? "video" : null
        if (fileType) {
          const url = URL.createObjectURL(file)
          setPreviews((prev) => [...prev, { type: fileType, url }])
        }
      })
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleConfirm = () => {
    onImagesSelected(selectedFiles)
    onClose()
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold">Upload Media</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <div className="grid grid-cols-3 gap-2">
            {previews.map((preview, index) => (
              <div key={index} className="relative h-24 rounded-md overflow-hidden border">
                {preview.type === "image" ? (
                  <img
                    src={preview.url}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={preview.url}
                    controls
                    className="w-full h-full object-cover"
                  />
                )}
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button variant="outline" onClick={triggerFileInput} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Select Media
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,video/*"
              multiple
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Add Media</Button>
          </div>
        </div>
      </div>
    </div>
  )
}