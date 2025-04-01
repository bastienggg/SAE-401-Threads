"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "../ui/button"
import { PostAttachmentEditor } from "../post-attachment-editor/post-attachment-editor"
import { Post } from "../../data/post"

interface EditPostModalProps {
  postId: string
  initialContent: string
  initialMedia?: string[]
  onClose: () => void
  onUpdate: () => void
  onPostUpdated?: () => void
}

export function EditPostModal({ postId, initialContent, initialMedia = [], onClose, onUpdate, onPostUpdated }: EditPostModalProps) {
  const [content, setContent] = useState(initialContent)
  const [media, setMedia] = useState<(string | File)[]>(initialMedia)
  const [removedMedia, setRemovedMedia] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleMediaChange = (newMedia: (string | File)[]) => {
    setMedia(newMedia)
  }

  const handleRemoveMedia = (index: number) => {
    setMedia((prev) => {
      const removed = prev[index]
      if (removed && typeof removed === "string") {
        setRemovedMedia((prevRemoved) => [...prevRemoved, removed])
      }
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    const token = sessionStorage.getItem("Token")
    if (!token) {
      setError("Authentication token not found")
      setIsLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append("content", content)

      media.forEach((item) => {
        if (typeof item !== "string") {
          formData.append("media[]", item)
        }
      })

      removedMedia.forEach((url) => {
        formData.append("removedMedia[]", url)
      })

      const response = await Post.updatePost(token, postId, formData)
      if (!response) {
        throw new Error("Failed to update post")
      }

      onUpdate()
      onPostUpdated?.()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    window.location.reload()
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Edit Post</h2>
          <Button variant="ghost" onClick={onClose} className="w-8 h-8 rounded-full">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full min-h-[100px] border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <PostAttachmentEditor
            initialMedia={media}
            onMediaChange={handleMediaChange}
            onRemoveMedia={handleRemoveMedia}
            className="w-full"
          />

          {error && <div className="text-sm text-red-500 p-2 bg-red-50 rounded">{error}</div>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}