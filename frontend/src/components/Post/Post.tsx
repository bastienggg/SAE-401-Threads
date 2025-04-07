"use client"

import { useState, useEffect, useRef } from "react"
import { Post as PostAPI } from "../../data/post"
import ConfirmDelete from "../confirmDelete/confirmDelete"
import { useNavigate } from "react-router-dom"
import { Like } from "../../data/like"
import { ImageCarousel } from "../image-carousel/image-carousel"
import { EditPostModal } from "../edit-post-modal/edit-post-modal"
import { MessageCircle } from "lucide-react"
import { Blocked } from "../../data/blocked"
import { Link } from "react-router-dom"

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
  isReply?: boolean
  isReadOnly?: boolean
  isPinned?: boolean
  repliesCount?: number
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
  isReply = false,
  isReadOnly = false,
  isPinned = false,
  repliesCount = 0,
}: PostProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isLiked, setIsLiked] = useState(userLiked)
  const [likes, setLikes] = useState(likeCount)
  const [postContent, setPostContent] = useState(content)
  const [postMedia, setPostMedia] = useState(media || [])
  const [showReplies, setShowReplies] = useState(false)
  const [replies, setReplies] = useState<any[]>([])
  const [isLoadingReplies, setIsLoadingReplies] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showReplyMenu, setShowReplyMenu] = useState<number | null>(null)
  const [selectedReply, setSelectedReply] = useState<any>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const replyMenuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyMedia, setReplyMedia] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isPostPinned, setIsPostPinned] = useState(isPinned)
  const currentUserId = Number(sessionStorage.getItem("id"))
  const isCurrentUser = currentUserId === Number(userId)
  const token = sessionStorage.getItem("Token")
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  const handleShowReplies = async () => {
    if (!showReplies && token) {
      setIsLoadingReplies(true);
      try {
        const data = await PostAPI.getReplies(token, postId);
        if (data && data.replies) {
          setReplies(data.replies);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des réponses:", error);
      } finally {
        setIsLoadingReplies(false);
      }
    }
    setShowReplies(!showReplies);
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || ((!replyContent.trim() && replyMedia.length === 0) || isSubmitting) || isReadOnly) return

    setIsSubmitting(true)
    try {
      console.log("Création d'une nouvelle réponse pour le post:", postId);
      const formData = new FormData()
      if (replyContent.trim()) {
        formData.append("content", replyContent.trim())
      }
      
      // Ajout des médias au FormData
      replyMedia.forEach((file, index) => {
        formData.append(`media[${index}]`, file)
      })

      console.log("Envoi de la réponse avec le contenu:", replyContent);
      const response = await PostAPI.createReply(token, postId, formData)
      console.log("Réponse du serveur:", response);
      
      if (response) {
        setReplyContent("")
        setReplyMedia([])
        handleShowReplies()
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la réponse:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setReplyMedia(prev => [...prev, ...files])
  }

  const removeMedia = (index: number) => {
    setReplyMedia(prev => prev.filter((_, i) => i !== index))
  }

  const handlePinClick = async () => {
    if (!token) return;
    try {
      if (isPostPinned) {
        const response = await PostAPI.unpinPost(token, postId);
        if (response) {
          setIsPostPinned(false);
          if (refreshPosts) refreshPosts();
        }
      } else {
        const response = await PostAPI.pinPost(token, postId);
        if (response) {
          setIsPostPinned(true);
          if (refreshPosts) refreshPosts();
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'épinglage/désépinglage du post:", error);
    }
    setShowMenu(false);
  };

  if (!isVisible) {
    return null
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 relative w-full">
      <div className="flex items-start space-x-3">
        <Link to={`/profile/${userId}`} className="flex-shrink-0">
          <img
            src={avatar || "/public/profil/default.jpg"}
            alt={`Avatar de ${pseudo}`}
            className="w-10 h-10 rounded-full object-cover"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to={`/profile/${userId}`} className="font-semibold text-gray-900 hover:underline">
                {pseudo}
              </Link>
              <span className="text-gray-500 text-sm">{formatDate(createdAt)}</span>
              {isPinned && (
                <div className="flex items-center text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                  <span className="text-xs font-medium">Épinglé</span>
                </div>
              )}
            </div>
            {!isBlocked && !hasBlockedMe && (
              <div className="relative" ref={menuRef}>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <div className="py-1">
                      {isCurrentUser && (
                        <>
                          <button
                            onClick={() => {
                              setShowEditModal(true)
                              setShowMenu(false)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Modifier
                          </button>
                          <button
                            onClick={handlePinClick}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                            </svg>
                            {isPostPinned ? "Désépingler" : "Épingler"}
                          </button>
                          <button
                            onClick={() => {
                              setShowConfirm(true)
                              setShowMenu(false)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            Supprimer
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p className={`${isCensored || isBlocked ? 'text-red-500 italic' : 'text-muted-foreground'} ${isReply ? 'text-sm' : ''}`}>
              {isBlocked ? "Cet utilisateur a été bloqué par l'administrateur" : content}
            </p>
          </div>

          {media && media.length > 0 && !isCensored && (
            <div className="mt-2">
              <ImageCarousel images={media} className={`${isReply ? 'w-3/4' : 'w-full'}`} />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-2">
        {!isBlocked && !hasBlockedMe && !isCensored && (
          <>
            <div className="flex items-center gap-1">
              <img
                src={isLiked ? "/public/svg/heart-filled.svg" : "/public/svg/heart.svg"}
                className="w-5 h-5 hover:cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out"
                alt={isLiked ? "Unlike" : "Like"}
                onClick={isLiked ? handleUnlike : handleLike}
              />
              <span className="text-sm text-neutral-700">{likes}</span>
            </div>
            {!isReadOnly && (
              <div className="flex items-center gap-1">
                <MessageCircle 
                  className="h-5 w-5 text-neutral-500 hover:text-blue-500 hover:cursor-pointer"
                  onClick={handleShowReplies}
                />
                <span className="text-sm text-neutral-700">{repliesCount}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Affichage des réponses */}
      {showReplies && !isReply && !isReadOnly && (
        <div className="mt-2 space-y-2 border-l-2 border-neutral-200 pl-4">
          {!isBlocked && !hasBlockedMe && !isCensored && (
            <div className="flex items-start gap-2 py-2 border-b border-neutral-100">
              <img 
                src={sessionStorage.getItem("avatar") || "/public/profil/default.jpg"}
                alt="profil" 
                className="w-6 h-6 rounded-full"
              />
              <form onSubmit={handleSubmitReply} className="flex-1">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-neutral-900">
                      @{sessionStorage.getItem("pseudo")}
                    </span>
                  </div>
                  <div className="relative">
                    <textarea
                      value={replyContent}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value.length <= 250) {
                          setReplyContent(value)
                        }
                      }}
                      placeholder="Écrire une réponse..."
                      className="w-full text-sm text-neutral-700 bg-transparent border-none resize-none focus:outline-none focus:ring-0 min-h-[40px]"
                      rows={1}
                      maxLength={250}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement
                        target.style.height = 'auto'
                        target.style.height = target.scrollHeight + 'px'
                      }}
                    />

                    {/* Affichage des médias sélectionnés */}
                    {replyMedia.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {replyMedia.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Media ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeMedia(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-4">
                        <span className={`text-xs ${replyContent.length >= 250 ? 'text-red-500' : 'text-neutral-500'}`}>
                          {replyContent.length}/250 caractères
                        </span>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="p-1 rounded-full hover:bg-neutral-100 transition-colors"
                        >
                          <svg className="w-5 h-5 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                            <path d="M14 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-6" />
                          </svg>
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={(!replyContent.trim() && replyMedia.length === 0) || isSubmitting}
                        className="px-4 py-1 text-xs font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Envoi..." : "Répondre"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {isLoadingReplies ? (
            <div className="text-sm text-neutral-500">Chargement des réponses...</div>
          ) : replies.length > 0 ? (
            replies.map((reply) => (
              <div key={reply.id} className="flex items-start gap-2 py-2">
                <img
                  src={reply.user.avatar || "/public/profil/default.jpg"}
                  alt="profil"
                  className="w-6 h-6 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-medium text-neutral-900 hover:underline cursor-pointer"
                        onClick={() => navigate(`/profile/${reply.user.id}`)}
                      >
                        @{reply.user.pseudo}
                      </span>
                      <span className="text-xs text-neutral-500">·</span>
                      <span className="text-xs text-neutral-500">
                        {new Date(reply.created_at).toLocaleString()}
                      </span>
                    </div>
                    {Number(reply.user.id) === currentUserId && !isReadOnly && (
                      <div className="relative" ref={replyMenuRef}>
                        <button 
                          className="p-1 hover:bg-neutral-100 rounded-full"
                          onClick={() => setShowReplyMenu(showReplyMenu === reply.id ? null : reply.id)}
                        >
                          <svg className="w-4 h-4 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                        </button>
                        {showReplyMenu === reply.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                            <button
                              className="w-full px-4 py-2 text-sm text-left hover:bg-neutral-100 flex items-center gap-2"
                              onClick={() => {
                                setSelectedReply(reply)
                                setShowEditModal(true)
                                setShowReplyMenu(null)
                              }}
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                              Modifier
                            </button>
                            <button
                              className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-neutral-100 flex items-center gap-2"
                              onClick={async () => {
                                if (!token) return;
                                try {
                                  const response = await PostAPI.deletePost(token, reply.id.toString());
                                  if (response) {
                                    setReplies(replies.filter(r => r.id !== reply.id));
                                  }
                                } catch (error) {
                                  console.error("Erreur lors de la suppression de la réponse:", error);
                                }
                                setShowReplyMenu(null);
                              }}
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                              Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-neutral-700 mt-1">{reply.content}</p>
                  {reply.media && reply.media.length > 0 && (
                    <div className="mt-2">
                      <ImageCarousel images={reply.media} />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <img
                      src={reply.user_liked ? "/public/svg/heart-filled.svg" : "/public/svg/heart.svg"}
                      className="w-4 h-4 hover:cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out"
                      alt={reply.user_liked ? "Unlike" : "Like"}
                      onClick={async () => {
                        if (!token || isReadOnly) return;
                        try {
                          if (reply.user_liked) {
                            await Like.Deletelike(token, reply.id.toString());
                            reply.user_liked = false;
                            reply.like_count--;
                          } else {
                            await Like.AddLike(token, reply.id.toString());
                            reply.user_liked = true;
                            reply.like_count++;
                          }
                          setReplies([...replies]); // Force re-render
                        } catch (error) {
                          console.error("Erreur lors du like/unlike de la réponse:", error);
                        }
                      }}
                    />
                    <span className="text-xs text-neutral-500">{reply.like_count}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-neutral-500">Aucune réponse</div>
          )}
        </div>
      )}

      {hasBlockedMe && (
        <div className="text-sm text-red-500 mt-2">
          Vous ne pouvez pas interagir avec ce post car l'utilisateur vous a bloqué
        </div>
      )}

      {showConfirm && (
        <ConfirmDelete
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {showEditModal && (
        <EditPostModal
          postId={selectedReply ? selectedReply.id.toString() : postId}
          initialContent={selectedReply ? selectedReply.content : postContent}
          initialMedia={selectedReply ? selectedReply.media : postMedia}
          onClose={() => {
            setShowEditModal(false)
            setSelectedReply(null)
          }}
          onUpdate={handlePostUpdate}
          onPostUpdated={refreshPosts}
          isReply={!!selectedReply}
        />
      )}
    </div>
  )
}