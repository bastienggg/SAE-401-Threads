"use client"

import { useState, useRef } from "react"
import { X, Plus } from "lucide-react"
import { cn } from "../../lib/utils"
import { useEffect } from "react"

const isVideo = (file: string | File) => {
  if (typeof file === "string") {
    return [".mp4", ".webm", ".ogg"].some((ext) => file.toLowerCase().endsWith(ext))
  }
  return file.type.startsWith("video/")
}

interface PostAttachmentEditorProps {
  initialMedia?: (string | File)[]
  onMediaChange: (media: (string | File)[]) => void
  onRemoveMedia?: (index: number) => void
  className?: string
}


export function PostAttachmentEditor({ initialMedia = [], onMediaChange, onRemoveMedia, className }: PostAttachmentEditorProps) {
    const [media, setMedia] = useState<(string | File)[]>(initialMedia)
    const fileInputRef = useRef<HTMLInputElement>(null)
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const newFiles = Array.from(e.target.files)
        setMedia((prev) => [...prev, ...newFiles])
      }
    }
  
    const removeMedia = (index: number) => {
      setMedia((prev) => prev.filter((_, i) => i !== index))
      onRemoveMedia?.(index)
    }
  
    const triggerFileUpload = () => {
      fileInputRef.current?.click()
    }
  
    // Use useEffect to notify parent of media changes
    useEffect(() => {
      onMediaChange(media)
    }, [media, onMediaChange])
  
    return (
      <div className={cn("w-full space-y-4", className)}>
        <div className="flex flex-wrap gap-2">
          {media.map((file, index) => (
            <div key={index} className="relative group w-24 h-24 rounded-md overflow-hidden border border-neutral-200">
              {isVideo(file) ? (
                <video
                  src={typeof file === "string" ? file : URL.createObjectURL(file)}
                  className="w-full h-full object-cover"
                  controls
                />
              ) : (
                <img
                  src={typeof file === "string" ? file : URL.createObjectURL(file)}
                  alt={`Attachment ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
              <button
                onClick={() => removeMedia(index)}
                className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
  
          <button
            onClick={triggerFileUpload}
            className="w-24 h-24 border-2 border-dashed border-neutral-300 rounded-md flex flex-col items-center justify-center hover:border-neutral-400 transition-colors"
          >
            <Plus className="w-6 h-6 text-neutral-500" />
            <span className="text-xs text-neutral-500 mt-1">Add Media</span>
          </button>
        </div>
  
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,video/*"
          multiple
        />
      </div>
    )
  }