"use client"

import { useState } from "react"
import { Post as PostAPI } from "../../data/post"
import ConfirmDelete from "../confirmDelete/confirmDelete"
import { useNavigate } from "react-router-dom"
import { Like } from "../../data/like"
import { ImageCarousel } from "../image-carousel/image-carousel"
import { EditPostModal } from "../edit-post-modal/edit-post-modal"
import { Pencil } from "lucide-react"

interface PostProps {
  content: string
  pseudo: string
  createdAt: string
  avatar: string
  userId: string
  postId: string
  likeCount: number
  userLiked: boolean
  isBlocked: boolean
  hasBlockedMe?: boolean
  media?: string[]
  refreshPosts?: () => void
  isCensored?: boolean
}

export default function Post({
  content,
  createdAt,
  pseudo,
  avatar,
  userId,
  postId,
  likeCount,
  userLiked,
  isBlocked,
  hasBlockedMe = false,
  media,
  refreshPosts,
  isCensored = false,
}: PostProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isLiked, setIsLiked] = useState(userLiked)
  const [likes, setLikes] = useState(likeCount)
  const [postContent, setPostContent] = useState(content)
  const [postMedia, setPostMedia] = useState(media || [])
  const navigate = useNavigate()

  const currentUserId = Number(sessionStorage.getItem("id"))
  const isCurrentUser = currentUserId === Number(userId)
  const token = sessionStorage.getItem("Token")

  const handleLike = async () => {
    if (!token) {
      console.error("Token non trouvé")
      return
    }

    if (isCensored) {
      return
    }

    try {
      const response = await Like.AddLike(token, postId)
      if (response) {
        setIsLiked(true)
        setLikes(likes + 1)
      }
    } catch (error) {
      console.error("Erreur lors de l'appel à AddLike :", error)
    }
  }

  const handleUnlike = async () => {
    if (!token) {
      console.error("Token non trouvé")
      return
    }

    if (isCensored) {
      return
    }

    try {
      const response = await Like.Deletelike(token, postId)
      if (response) {
        setIsLiked(false)
        setLikes(likes - 1)
      }
    } catch (error) {
      console.error("Erreur lors de l'appel à Deletelike :", error)
    }
  }

  const handleDelete = async () => {
    if (!token) {
      console.error("Token non trouvé")
      return
    }

    try {
      const response = await PostAPI.deletePost(token, postId)
      if (response) {
        setIsVisible(false)
        refreshPosts?.()
      }
    } catch (error) {
      console.error("Erreur lors de l'appel à deletePost :", error)
    }
  }

  const handlePostUpdate = () => {
    refreshPosts?.()
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="flex flex-col gap-4 p-4 w-full bg-white rounded-md shadow-md my-2">
      <div className="flex flex-row gap-4 items-start">
        <img src={avatar || "/public/profil/default.jpg"} alt="profil" className="w-9 aspect-square rounded-full" />
        <div className="w-full flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2 justify-between w-full">
            <p
              className="font-bold text-neutral-900 hover:cursor-pointer hover:underline"
              onClick={() => navigate(`/profile/${userId}`)}
            >
              @{pseudo}
            </p>
            <p className="text-xs text-neutral-700">{new Date(createdAt).toLocaleString()}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className={`text-sm ${isCensored ? 'text-red-500 italic' : 'text-muted-foreground'}`}>
              {content}
            </p>
          </div>

          {media && media.length > 0 && !isCensored && (
            <div className="mt-2">
              <ImageCarousel images={media} className="w-full" />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        {!isBlocked && !hasBlockedMe && !isCensored && (
          <div className="flex items-center gap-2">
            <img
              src={isLiked ? "/public/svg/heart-filled.svg" : "/public/svg/heart.svg"}
              className="w-5 h-5 hover:cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out"
              alt={isLiked ? "Unlike" : "Like"}
              onClick={isLiked ? handleUnlike : handleLike}
            />
            <span className="text-sm text-neutral-700">{likes}</span>
          </div>
        )}

        {!isBlocked && !hasBlockedMe && isCurrentUser && (
          <div className="flex items-center gap-2">
            <Pencil
              className="w-5 h-5 hover:cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out text-neutral-600"
              onClick={() => setShowEditModal(true)}
            />
            <img
              src="/public/svg/trash.svg"
              className="w-5 h-5 hover:cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out"
              alt="Supprimer"
              onClick={() => setShowConfirm(true)}
            />
          </div>
        )}
      </div>
      {hasBlockedMe && (
        <div className="text-sm text-red-500 mt-2">
          Vous ne pouvez pas interagir avec ce post car l'utilisateur vous a bloqué
        </div>
      )}

      {showConfirm && (
        <ConfirmDelete
          onConfirm={() => {
            handleDelete()
            setShowConfirm(false)
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {showEditModal && (
        <EditPostModal
          postId={postId}
          initialContent={postContent}
          initialMedia={postMedia}
          onClose={() => setShowEditModal(false)}
          onUpdate={handlePostUpdate}
          onPostUpdated={refreshPosts}
        />
      )}
    </div>
  )
}