"use client";

import { supabase } from "@/lib/supabase";
import { TrashIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const SliderPanel = () => {
  //movcut olan slidelarin state i
  const [sliderPhotos, setSliderPhotos] = useState<any[]>([]);
  //inputtan gelen foto
  const [addingSliderFile, setAddingSliderFile] = useState<File | null>(null);
  // dataya resim gonderendeki loader
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  //sehife acilanda database de olan fotograflari cekmek ucun
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { data, error } = await supabase
          .from("slides")
          .select("*")
          .order("order", { ascending: true });
        if (error) console.log(error);
        setSliderPhotos(data || []);
      } catch (error) {
        alert("slidelar cekilerken problem oldu" + error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  //form submit olanda storage e ve table a fotograflari yuklemek ucun

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (!addingSliderFile) {
      alert("Duzgun foto Yukleyin");
      return;
    }
    setUploading(true);
    const fileuzantisi = addingSliderFile?.name.split(".").pop();
    const fileName = `${Math.random()}.${fileuzantisi}`;

    const { error: uploadError } = await supabase.storage
      .from("slider-images")
      .upload(fileName, addingSliderFile);
    if (uploadError) {
      alert("fotograf storage e yuklenerken xeta bash verdi" + uploadError);
    }

    const { data: urlData } = await supabase.storage
      .from("slider-images")
      .getPublicUrl(fileName);
    const image = urlData.publicUrl;

    const { error: dbError } = await supabase.from("slides").insert([
      {
        image_url: image,
      },
    ]);
    if (dbError) {
      alert("Dataya yuklerken xeta bashverdi" + dbError);
    }
    setUploading(false);
  };

  //hem storeage hem tableden fotonu silmek
  const handleDeleteSlideImage = async (id: string, imageUrl: string) => {
    if (!confirm("Sekili silmek istediyinize eminsiniz ?")) return;

    try {
      const fileName = imageUrl.split("/").pop();

      if (!fileName) return;

      const { error: storageError } = await supabase.storage
        .from("slider-images")
        .remove([fileName]);
      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from("slides")
        .delete()
        .eq("id", id);
      if (dbError) throw dbError;

      alert("Sekil silindi");

      setSliderPhotos((prev) => prev.filter((foto) => foto.id !== id));
    } catch (error) {
      alert("Silinmə zamanı xəta: " + error);
    }
  };

  return (
    <div>
      {/* datadan gelen fotolari ekrana listelemek */}
      <section>
        <h1 className="text-center text-3xl font-bold pt-5">
          Movcut olan Sekiller
        </h1>
        <div>
          {loading ? (
            <div className="font-bold text-3xl text-center pt-3">
              Yuklenir...
            </div>
          ) : (
            <div className="relative flex mt-3 gap-5 justify-center flex-wrap">
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
      {/* Sliderin Database ine foto yuklemek ucun */}
      <section>
        <h1 className="text-center text-3xl font-bold pt-5">
          Slaydere Sekil elave etmek
        </h1>
        <div className="flex justify-center mt-5">
          {/* foto yuklemek ucun form */}
          <form
            className="p-6 bg-gray-800 rounded-xl shadow-lg max-w-sm"
            onSubmit={handleFormSubmit}
          >
            <label className="block">
              <span className="sr-only">Şəkil seçin</span>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-400
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-green-50 file:text-green-700
        hover:file:bg-green-100
        cursor-pointer
        focus:outline-none"
                onChange={(e) =>
                  setAddingSliderFile(e.target.files ? e.target.files[0] : null)
                }
              />
            </label>
            <button
              type="submit"
              className="bg-red-500 w-full rounded-lg mt-5 text-white font-bold"
            >
              {uploading ? "Yuklenir........." : "Yukle"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default SliderPanel;
