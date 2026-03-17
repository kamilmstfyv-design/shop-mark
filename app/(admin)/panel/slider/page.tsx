"use client";

import { supabase } from "@/lib/supabase";
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
    setUploading(true);
    const fileuzantisi = addingSliderFile?.name.split(".").pop();
    const fileName = `${Math.random()}.${fileuzantisi}`;

    if (!addingSliderFile) {
      alert("Duzgun foto Yukleyin");
      return;
    }
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
            <div className="flex mt-3 gap-5 justify-center">
              {sliderPhotos.map((foto) => (
                <Image
                  src={foto.image_url}
                  width={150}
                  height={150}
                  alt="fotos"
                  key={foto.id}
                />
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
