"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PanelSlider = () => {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from("slides")
        .select("*")
        .order("order", { ascending: true });
      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error("Slider yüklənməsində xəta:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const deleteSlidePhoto = async (id: string, image_url: string) => {
    // Storage içindəki dosyanın path'ini URL'den ayırırıq
    const path = image_url.split("slider-images/")[1];

    try {
      // 1) Əvvəlcə storage-dan şəkli silirik
      if (path) {
        const { error: storageError } = await supabase.storage
          .from("slider-images")
          .remove([path]);

        if (storageError) {
          console.error("Storage-dan şəkil silinərkən xəta:", storageError);
          // Storage silinməsə də davam edə bilərik, amma xəbərdar olmaq üçün log saxlayırıq
        }
      }

      // 2) Sonra slides cədvəlindən DB səviyyəsində qeydi silirik
      const { error: deleteError } = await supabase
        .from("slides")
        .delete()
        .eq("id", id);

      if (deleteError) {
        console.error("Supabase 'slides' delete xətası:", deleteError);
        // Burada return etməyimiz vacibdir ki, DB-də silinmə uğursuz olarsa
        // front-end state-dən element silinməsin və refresh sonrası "geri gəlmiş" kimi görünməsin
        return;
      }

      // 3) Əgər DB-də silinmə uğurludursa, front-end state-i yeniləyirik
      setSlides((prevSlides) => prevSlides.filter((slide) => slide.id !== id));
    } catch (error) {
      console.error("Slayd silinərkən gözlənilməyən xəta:", error);
    }
  };

  const uploadSlidePhoto = async () => {};

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold">Hazirda olan slaydlar</h2>
        {loading ? (
          <div className="text-center text-gray-500">Yüklənir...</div>
        ) : slides.length === 0 ? (
          <div className="text-center text-gray-500">Slaydlar yoxdur</div>
        ) : (
          <div className="flex gap-4 items-center">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="relative group w-[200px] h-[200px] overflow-hidden rounded-lg"
              >
                <Image
                  src={slide.image_url || ""}
                  alt={slide.title || ""}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                  <Trash2Icon
                    className="w-12 h-12 text-white"
                    onClick={() =>
                      confirm("Bu slaydı silmək istədiyinizdən əminsiniz?") &&
                      deleteSlidePhoto(slide.id, slide.image_url)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-bold">Yeni slayd əlavə et</h2>
        <div className="flex flex-col gap-4">
          <input
            type="file"
            accept="image/*"
            className="w-full border-2 border-gray-300 rounded-md p-2"
          />
          <Button onClick={uploadSlidePhoto}>Yüklə</Button>
        </div>
      </div>
    </div>
  );
};

export default PanelSlider;
