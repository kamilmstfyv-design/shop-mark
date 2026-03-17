"use client";
import { supabase } from "@/lib/supabase";
import { Swiper, SwiperSlide } from "swiper/react";

// Swiper stillərini import edirik
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// Lazım olan modulları import edirik
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import { useEffect, useState } from "react";
const MainSlider = () => {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      const { data, error } = await supabase
        .from("slides")
        .select("*")
        .order("order", { ascending: true });
      if (error) {
        console.error("Slider yüklənməsində xəta:", error);
      } else {
        setSlides(data);
      }
      setLoading(false);
    };
    fetchSlides();
  }, []);

  if (loading)
    return (
      <div className="h-[300px] flex items-center justify-center text-white">
        Yüklənir...
      </div>
    );
  if (slides.length === 0) return null;

  return (
    <section className="main-container">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 30, // Dönmə dərəcəsi (Çox olsa şəkillər çox əyilir)
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={true}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="w-full py-12"
      >
        {slides.map((slide) => (
          <SwiperSlide
            key={slide.id}
            className="max-w-[280px] sm:max-w-[350px] md:max-w-[400px]"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={slide.image_url}
                alt="Slider Image"
                className="h-full w-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default MainSlider;
