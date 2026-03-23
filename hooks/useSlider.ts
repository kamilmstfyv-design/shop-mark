import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export const useSlider = () => {
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
        toast.error("Slaydlar yüklənmədi", { description: String(error) });
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
      toast.warning("Şəkil seçin");
      return;
    }
    setUploading(true);
    const fileuzantisi = addingSliderFile?.name.split(".").pop();
    const fileName = `${Math.random()}.${fileuzantisi}`;

    const { error: uploadError } = await supabase.storage
      .from("slider-images")
      .upload(fileName, addingSliderFile);
    if (uploadError) {
      toast.error("Şəkil yüklənmədi", { description: uploadError.message });
      setUploading(false);
      return;
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
      toast.error("Verilənlər bazasına yazılmadı", {
        description: dbError.message,
      });
      setUploading(false);
      return;
    }

    toast.success("Slayd əlavə olundu");
    setAddingSliderFile(null);
    setUploading(false);
    const { data: rows } = await supabase
      .from("slides")
      .select("*")
      .order("order", { ascending: true });
    setSliderPhotos(rows || []);
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

      toast.success("Şəkil silindi");

      setSliderPhotos((prev) => prev.filter((foto) => foto.id !== id));
    } catch (error) {
      toast.error("Silinmə alınmadı", { description: String(error) });
    }
  };
  return {
    sliderPhotos,
    setSliderPhotos,
    addingSliderFile,
    setAddingSliderFile,
    uploading,
    setUploading,
    loading,
    setLoading,
    handleFormSubmit,
    handleDeleteSlideImage,
  };
};
