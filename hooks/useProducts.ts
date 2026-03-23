import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type UseProductsOptions = {
  onSuccess?: () => void | Promise<void>;
};

export const useProducts = (options?: UseProductsOptions) => {
  const onSuccess = options?.onSuccess;
  const [variants, setVariants] = useState([
    { size: "", price: "", discountPrice: "" },
  ]);
  const [loading, setLoading] = useState(false);

  const [addingProductImage, setAddingProductImage] = useState<File | null>(
    null,
  );

  const [productData, setProductData] = useState({
    name: "",

    category: "",

    description: "",

    is_new: false,

    is_best: false,
  });

  const deleteVariants = (index: number) => {
    // v obyektin özüdür (size, price və s.), i isə onun sırasıdır
    const filteredVariants = variants.filter((_, i) => i !== index);
    setVariants(filteredVariants);
  };

  const addVariants = () => {
    setVariants([...variants, { size: "", price: "", discountPrice: "" }]);
  };

  const updateVariants = (index: number, field: string, value: string) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { id, value } = e.target;

    setProductData({ ...productData, [id]: value });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!productData.name || !productData.category) {
      toast.warning("Əsas sahələri doldurun", {
        description: "Ad və kateqoriya mütləqdir.",
      });

      return;
    }

    if (!addingProductImage) {
      toast.warning("Şəkil seçilməyib");

      return;
    }

    setLoading(true);

    try {
      const fileExt = addingProductImage.name.split(".").pop();

      const fileName = `${Math.random()}.${fileExt}`;

      const filePath = `products/${fileName}`;

      const { error: storageError } = await supabase.storage

        .from("products_image")

        .upload(filePath, addingProductImage);

      if (storageError) throw storageError;

      const { data: urlData } = supabase.storage

        .from("products_image")

        .getPublicUrl(filePath);

      const image_url = urlData.publicUrl;

      const { error: dbError } = await supabase.from("products").insert([
        {
          name: productData.name,

          image_url: image_url,

          category_slug: productData.category,

          description: productData.description,

          is_new: productData.is_new,

          is_popular: productData.is_best,
          variants: variants,
        },
      ]);

      if (dbError) throw dbError;

      try {
        await onSuccess?.();
      } catch (cbErr) {
        console.error("onSuccess xətası:", cbErr);
      }

      toast.success("Məhsul əlavə olundu");

      setProductData({
        name: "",
        category: "",

        description: "",

        is_new: false,

        is_best: false,
      });

      setAddingProductImage(null);
      setVariants([{ size: "", price: "", discountPrice: "" }]);

      (document.getElementById("image") as HTMLInputElement).value = "";
    } catch (error: any) {
      toast.error("Əlavə alınmadı", {
        description: error?.message || String(error),
      });

      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    variants,
    setVariants,
    loading,
    setLoading,
    addingProductImage,
    setAddingProductImage,
    productData,
    setProductData,
    handleFormSubmit,
    handleInputChange,
    updateVariants,
    addVariants,
    deleteVariants,
  };
};
