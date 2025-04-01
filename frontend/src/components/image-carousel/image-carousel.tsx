"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../lib/utils"

// Helper function to check if a file is a video
const isVideo = (file: string) => {
  const videoExtensions = [".mp4", ".webm", ".ogg"]
  return videoExtensions.some((ext) => file.toLowerCase().endsWith(ext))
}

interface ImageCarouselProps {
  images: string[]
  className?: string
}

export function ImageCarousel({ images, className }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) return null

  if (images.length === 1) {
    const media = images[0]
    return (
      <div className={cn("relative w-full rounded-md overflow-hidden", className)}>
        {isVideo(media) ? (
          <video
            src={media}
            controls
            className="w-full h-auto object-cover rounded-md"
          />
        ) : (
          <img
            src={media || "/placeholder.svg"}
            alt="Post media"
            className="w-full h-auto object-cover rounded-md"
          />
        )}
      </div>
    )
  }

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1
    const newIndex = isLastImage ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex)
  }

  return (
    <div className={cn("relative w-full rounded-md group", className)}>
      <div className="w-full h-full rounded-md overflow-hidden">
        {isVideo(images[currentIndex]) ? (
          <video
            src={images[currentIndex]}
            controls
            className="w-full h-auto object-cover rounded-md transition-all duration-300 ease-in-out"
          />
        ) : (
          <img
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`Post media ${currentIndex + 1}`}
            className="w-full h-auto object-cover rounded-md transition-all duration-300 ease-in-out"
          />
        )}
      </div>

      {/* Left Arrow */}
      <div
        className="hidden group-hover:flex absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full cursor-pointer"
        onClick={goToPrevious}
      >
        <ChevronLeft size={20} />
      </div>

      {/* Right Arrow */}
      <div
        className="hidden group-hover:flex absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full cursor-pointer"
        onClick={goToNext}
      >
        <ChevronRight size={20} />
      </div>

      {/* Indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${
              currentIndex === slideIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  )
}