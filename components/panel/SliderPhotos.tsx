"use client";
import { SliderGallerySkeleton } from "@/components/skeletons";
import { useSlider } from "@/hooks/useSlider";
import { TrashIcon } from "lucide-react";
import Image from "next/image";

const SliderPhotos = () => {
  const { sliderPhotos, loading, handleDeleteSlideImage } = useSlider();
  return (
    <section>
      <h1 className="pt-5 text-center text-3xl font-bold text-slate-900">
        Mövcud şəkillər
      </h1>
      <div>
        {loading ? (
          <div className="mt-6">
            <SliderGallerySkeleton count={6} />
          </div>
        ) : (
          <div className="relative mt-3 flex flex-wrap justify-center gap-5">
            {sliderPhotos.map((foto) => (
              <div
                key={foto.id}
                className="relative group border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm w-[150px] h-[150px]"
              >
                <Image
                  src={foto.image_url}
                  fill // Bu, şəkli olduğu div-in içinə tam doldurur
                  className="object-cover"
                  alt="slider-photo"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <TrashIcon
                    className="text-red-600"
                    onClick={() =>
                      handleDeleteSlideImage(foto.id, foto.image_url)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SliderPhotos;
