import { CheckCircle, Instagram } from "lucide-react";

import { ABOUT_FEATURES, IG_POSTS } from "../../consts/site";
import useCarousel from "../../hooks/useCarousel";
import InstagramCarousel from "./InstagramCarousel";

const instagramProfileUrl = "https://www.instagram.com/hd_pro_construction_inc/";

const AboutSection = () => {
  const { activeIndex, next, prev, goTo } = useCarousel(IG_POSTS.length);

  return (
    <section
      id="about"
      className="py-32 bg-gray-900 text-white overflow-hidden relative text-left"
    >
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
        <InstagramCarousel
          posts={IG_POSTS}
          activeSlide={activeIndex}
          onNextSlide={next}
          onPrevSlide={prev}
          onSelectSlide={goTo}
        />

        <div className="text-left">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic mb-10 leading-none">
            Quality Built <br />
            <span className="text-orange-600">On Experience</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 leading-relaxed italic font-medium">
            We specialize in turning vision into reality. Whether it's a new
            driveway, a custom stone wall, or complex excavation, HD Pro
            Construction INC delivers unmatched durability and style.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {ABOUT_FEATURES.map((feature) => (
              <div key={feature.title} className="flex gap-4 items-start">
                <CheckCircle className="text-orange-600 shrink-0 mt-1" />
                <div>
                  <h4 className="font-black uppercase italic text-lg mb-1 tracking-tight">
                    {feature.title}
                  </h4>
                  <p className="text-gray-500 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-gray-800/50 rounded-2xl border-l-4 border-orange-600 flex items-center justify-between text-left">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-orange-600 mb-1">
                Follow Us
              </p>
              <p className="text-xl font-black italic tracking-tighter">
                @hd_pro_construction_inc
              </p>
            </div>
            <a
              href={instagramProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-600 p-4 rounded-xl hover:bg-orange-700 transition-colors"
            >
              <Instagram size={24} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
