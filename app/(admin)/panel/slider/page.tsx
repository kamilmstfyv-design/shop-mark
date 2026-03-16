"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Upload, Image as ImageIcon, Loader2 } from "lucide-react"; // Ikonlar üçün

const Panel = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  // 1. Mövcud slaydları gətiririk (Siyahı üçün)
  const fetchSlides = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("slides")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setSlides(data || []);
    setFetching(false);
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // 2. Şəkil yükləmə funksiyası
  const handleUpload = async () => {
    if (!file) return alert("Zəhmət olmasa şəkil seçin!");

    try {
      setLoading(true);

      // Fayl adı tənzimləmə
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `slides/${fileName}`;

      // A. Storage-ə yüklə
      const { error: uploadError } = await supabase.storage
        .from("slider-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // B. Public URL al
      const {
        data: { publicUrl },
      } = supabase.storage.from("slider-images").getPublicUrl(filePath);

      // C. Database-ə yaz (Title sütunu yoxdur deyə çıxartdıq)
      const { error: dbError } = await supabase
        .from("slides")
        .insert([{ image_url: publicUrl, order: 0 }]);

      if (dbError) throw dbError;

      setFile(null); // İnputu sıfırla
      alert("Slayd uğurla əlavə edildi!");
      fetchSlides(); // Siyahını yenilə
    } catch (error: any) {
      alert("Xəta: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Slaydı silmə funksiyası
  const handleDelete = async (id: number, imageUrl: string) => {
    if (!confirm("Bu slaydı silmək istədiyinizə əminsiniz?")) return;

    try {
      // A. Database-dən sil
      const { error: dbError } = await supabase
        .from("slides")
        .delete()
        .eq("id", id);
      if (dbError) throw dbError;

      // B. Storage-dən sil (URL-dən fayl adını tapırıq)
      const fileName = imageUrl.split("/").pop();
      if (fileName) {
        await supabase.storage
          .from("slider-images")
          .remove([`slides/${fileName}`]);
      }

      fetchSlides(); // Siyahını yenilə
    } catch (error: any) {
      alert("Silinmə zamanı xəta: " + error.message);
    }
  };

  return (
    <div className="main-container py-10 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Üst Başlıq */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <h1 className="text-3xl font-bold text-white italic">
            Lənkəran Alko Panel
          </h1>
          <div className="bg-red-900/20 text-red-500 px-4 py-1 rounded-full text-sm border border-red-900/50">
            Admin Girişi
          </div>
        </div>

        {/* Yükləmə Bölməsi */}
        <div className="bg-[#1a1c20] p-8 rounded-3xl border border-white/5 shadow-2xl">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Upload size={20} className="text-red-500" /> Sliderə Şəkil Əlavə Et
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <label className="w-full md:w-2/3 flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/10 rounded-2xl hover:border-red-500/50 hover:bg-white/5 transition cursor-pointer group">
              {file ? (
                <span className="text-green-500 font-medium">{file.name}</span>
              ) : (
                <div className="flex flex-col items-center">
                  <ImageIcon
                    size={40}
                    className="text-white/20 group-hover:text-red-500/50 transition"
                  />
                  <span className="text-white/40 mt-2">
                    Şəkil seçmək üçün klikləyin
                  </span>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept="image/*"
              />
            </label>

            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className="w-full md:w-1/3 h-16 bg-red-800 hover:bg-red-700 disabled:bg-white/5 disabled:text-white/20 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Upload size={20} />
              )}
              {loading ? "Yüklənir..." : "İndi Yüklə"}
            </button>
          </div>
        </div>

        {/* Mövcud Slaydlar Siyahısı */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ImageIcon size={20} className="text-red-500" /> Mövcud Slaydlar
          </h2>

          {fetching ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-red-500" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  className="relative group rounded-xl overflow-hidden aspect-[3/4] border border-white/5"
                >
                  <img
                    src={slide.image_url}
                    alt="Slide"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(slide.id, slide.image_url)}
                      className="bg-red-600 p-3 rounded-full hover:scale-110 transition"
                    >
                      <Trash2 size={20} className="text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!fetching && slides.length === 0 && (
            <p className="text-white/30 text-center py-10">
              Hələ heç bir slayd əlavə edilməyib.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Panel;
