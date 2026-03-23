import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

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

export const useCategories = () => {
  //elimizde olan kategoriyalari state da saxlayan hook
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [categoryName, setCategoryName] = useState("");
  //kategoriyalari ceken async function
  const fetchCategories = useCallback(
    async (opts?: { background?: boolean }) => {
      const background = opts?.background === true;
      try {
        if (!background) setIsFetching(true);
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) {
          toast.error("Kateqoriyalar yüklənmədi", {
            description: error.message,
          });
        } else {
          setCategories(data ?? []);
        }
      } catch (error) {
        toast.error("Kateqoriyalar yüklənmədi", {
          description: String(error),
        });
      } finally {
        if (!background) setIsFetching(false);
      }
    },
    [],
  );

  //sehife acilanda kategoriyalari cekmek ucun
  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  /** Siyahını serverdən yenidən çək (UI titrəməsin deyə default olaraq “background”) */
  const refetch = useCallback(() => {
    void fetchCategories({ background: true });
  }, [fetchCategories]);

  const slug = createSlug(categoryName); // "Şərablar" -> "serablar"

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!categoryImage || !categoryName) {
      toast.warning("Bütün sahələri doldurun", {
        description: "Ad və şəkil mütləqdir.",
      });
      return;
    }

    setLoading(true);
    try {
      const fileuzantisi = categoryImage.name.split(".").pop();
      const fileName = `${Math.random()}.${fileuzantisi}`;

      const { error: uploadError } = await supabase.storage
        .from("category_images")
        .upload(fileName, categoryImage);

      if (uploadError) {
        toast.error("Şəkil yüklənmədi", { description: uploadError.message });
        return;
      }

      const { data: urlData } = await supabase.storage
        .from("category_images")
        .getPublicUrl(fileName);
      const image = urlData.publicUrl;

      const { error: dbError } = await supabase.from("categories").insert([
        {
          image_url: image,
          category: categoryName,
          slug: slug,
        },
      ]);

      if (dbError) {
        toast.error("Verilənlər bazasına yazılmadı", {
          description: dbError.message,
        });
        return;
      }

      setCategoryName("");
      setCategoryImage(null);
      await fetchCategories({ background: true });
      toast.success("Kateqoriya əlavə olundu");
    } catch (error) {
      toast.error("Kateqoriya əlavə olunmadı", { description: String(error) });
    } finally {
      setLoading(false);
    }
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

      toast.success("Kateqoriya silindi");
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error) {
      toast.error("Silinmə alınmadı", { description: String(error) });
    }
  };
  return {
    categories,
    handleCatDelete,
    handleFormSubmit,
    setCategoryName,
    setCategoryImage,
    loading,
    categoryName,
    isFetching,
    refetch,
  };
};
