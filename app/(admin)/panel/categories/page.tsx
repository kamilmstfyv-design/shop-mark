"use client";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { TrashIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const Categories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) {
          alert("Kategoriyalar cekilirken xeta bash verdi" + error);
        } else {
          setCategories(data);
        }
      } catch (error) {
        alert("Kategoriyalar cekilirken xeta bash verdi" + error);
      }
    };
    fetchCategories();
  }, []);
  //categori eklemek ucun
  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    if (!categoryImage || !categoryName) {
      alert("Butun melumatlari doldurun");
      return;
    }

    setLoading(true);

    const fileuzantisi = categoryImage?.name.split(".").pop();
    const fileName = `${Math.random()}.${fileuzantisi}`;
    //storage e resmi atmaq
    const { error: uploadError } = await supabase.storage
      .from("category_images")
      .upload(fileName, categoryImage);

    if (uploadError) {
      alert("fotograf storage e yuklenerken xeta bash verdi" + uploadError);
    }

    //storage dan resmi tapmaq

    const { data: urlData } = await supabase.storage
      .from("category_images")
      .getPublicUrl(fileName);
    const image = urlData.publicUrl;

    //resmi ve title i table atmaq
    const { error: dbError } = await supabase.from("categories").insert([
      {
        image_url: image,
        category: categoryName,
        slug: slug,
      },
    ]);
    if (dbError) {
      alert("Dataya yuklerken xeta bashverdi" + dbError);
    }
    setLoading(false);
  };

  //kategori silmek ucun
  const handleCatDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Kategoriyani silmek istediyinize eminsiniz ?")) return;

    const fileName = imageUrl.split("/").pop();

    if (!fileName) return;

    try {
      const { error: storageError } = await supabase.storage
        .from("category_images")
        .remove([fileName]);
      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);
      if (dbError) throw dbError;

      alert("Kategori silindi");
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error) {
      alert("Silinmə zamanı xəta: " + error);
    }
  };

  const createSlug = (text: any) => {
    return text
      .toString()
      .normalize("NFD") // Aksentli hərfləri ayırır
      .replace(/[\u0300-\u036f]/g, "") // Aksentləri silir (ə -> e, ş -> s)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Boşluqları tire (-) ilə əvəz edir
      .replace(/[^\w-]+/g, "") // Qalan hər şeyi silir
      .replace(/--+/g, "-"); // Yan-yana tireləri tək tire edir
  };

  // İstifadəsi:
  const slug = createSlug(categoryName); // "Şərablar" -> "serablar"

  return (
    <div className="w-full px-3 py-6 sm:px-6">
      <div className="mx-auto max-w-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Kategoriyalar əlavə etmək
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Yeni kategoriya adı və şəkli seçərək əlavə edin.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Kategoriya adı
              </label>
              <Input
                type="text"
                placeholder="Məs: Şərablar"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Kategoriya şəkli
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setCategoryImage(e.target.files ? e.target.files[0] : null)
                }
              />
              <p className="text-xs text-slate-500">PNG/JPG tövsiyə olunur.</p>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full sm:w-auto">
                {loading ? "Əlavə edilir...." : "Əlavə et"}
              </Button>
            </div>
          </form>
        </div>
        <div className="py-6">
          <h1 className="text-2xl font-bold text-center pb-6">Kategoriyalar</h1>

          {/* kategoriyalarin siyahisi */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories[0] ? (
              categories.map((cat: any) => (
                <Card
                  className="group relative mx-auto w-full max-w-sm pt-0 overflow-hidden"
                  key={cat.id}
                >
                  <div className="relative h-48 w-full sm:h-48">
                    <Image
                      src={cat.image_url}
                      alt={cat.category}
                      fill
                      sizes="(min-width: 1024px) 16vw, (min-width: 768px) 25vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    <button
                      type="button"
                      onClick={() => handleCatDelete(cat.id, cat.image_url)}
                      className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-red-600 opacity-0 shadow-sm transition-all duration-200 hover:bg-white group-hover:opacity-100"
                      aria-label="Delete category"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <CardTitle className="text-center text-2xl font-bold">
                    {cat.category}
                  </CardTitle>
                </Card>
              ))
            ) : (
              <div className="text-center text-2xl font-bold">
                Kategoriyalar yoxdur
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
