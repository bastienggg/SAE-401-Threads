interface ProfileBannerProps {
  banner: string | null
}

export default function ProfileBanner({ banner }: ProfileBannerProps) {
  return (
      <div className="h-32 md:h-48 w-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center text-gray-400">
        {!banner && <span className="text-sm md:text-base">No banner image</span>}
      </div>

  )
}