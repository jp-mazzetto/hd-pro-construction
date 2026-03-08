import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Instagram,
} from "lucide-react";

import type { InstagramPost } from "../../consts/site";

interface InstagramCarouselProps {
  posts: InstagramPost[];
  activeSlide: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onSelectSlide: (index: number) => void;
}

const instagramProfileUrl = "https://www.instagram.com/hd_pro_construction_inc/";

/**
 * Carrossel de posts do Instagram com navegacao manual e indicador de slide.
 */
const InstagramCarousel = ({
  posts,
  activeSlide,
  onPrevSlide,
  onNextSlide,
  onSelectSlide,
}: InstagramCarouselProps) => {
  return (
    <div className="relative group">
      <div className="relative z-10 rounded-3xl overflow-hidden border-8 border-gray-800 shadow-2xl aspect-square bg-gray-800">
        {posts.map((post, index) => (
          <div
            key={post.link}
            className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${index === activeSlide ? "opacity-100 scale-100" : "opacity-0 scale-110 pointer-events-none"}`}
          >
            <a href={post.link} target="_blank" rel="noopener noreferrer">
              <img src={post.url} alt={post.caption} className="w-full h-full object-cover" />
            </a>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-center">
              <p className="text-sm font-bold italic text-white/90 uppercase tracking-tight flex items-center justify-center gap-2">
                <Instagram size={16} className="text-orange-500" />
                {post.caption}
              </p>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={onPrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-orange-600 p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
          aria-label="Previous post"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          type="button"
          onClick={onNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-orange-600 p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
          aria-label="Next post"
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute top-4 right-4 flex gap-2">
          {posts.map((post, index) => (
            <button
              key={post.link}
              type="button"
              className={`h-1 w-6 rounded-full transition-all ${index === activeSlide ? "bg-orange-600" : "bg-white/20"}`}
              onClick={() => onSelectSlide(index)}
              aria-label={`Show slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-600 rounded-full blur-[100px] opacity-20 animate-pulse"></div>

      <a
        href={instagramProfileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute -bottom-6 -right-6 z-20 bg-orange-600 p-4 rounded-2xl shadow-2xl hover:bg-white hover:text-orange-600 transition-all group flex items-center gap-3"
      >
        <Instagram size={32} />
        <div className="pr-4 border-r border-black/10 text-left">
          <p className="text-[10px] font-black uppercase tracking-widest text-black/50 leading-none mb-1">
            View Feed
          </p>
          <p className="text-sm font-black italic tracking-tighter leading-none">
            Instagram
          </p>
        </div>
        <ExternalLink size={16} />
      </a>
    </div>
  );
};

export default InstagramCarousel;
