"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import { Switch } from "@/components/ui/switch";

const ProductsPanel = () => {
  const [categories, setCategories] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [addingProductImage, setAddingProductImage] = useState<File | null>(
    null,
  );

  const [products, setProducts] = useState<any[]>([]);

  const [productData, setProductData] = useState({
    name: "",

    price: "",

    discount_price: "0",

    category: "",

    description: "",

    is_new: false,

    is_best: false,
  });

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

    if (!productData.name || !productData.price || !productData.category) {
      alert("Zəhmət olmasa əsas sahələri doldurun!");

      return;
    }

    if (!addingProductImage) {
      alert("Şəkil seçilməyib!");

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

          price: Number(productData.price),

          discount_price: Number(productData.discount_price),

          category_slug: productData.category,

          description: productData.description,

          is_new: productData.is_new,

          is_popular: productData.is_best,
        },
      ]);

      if (dbError) throw dbError;

      alert("Məhsul uğurla əlavə edildi!");

      setProductData({
        name: "",

        price: "",

        discount_price: "0",

        category: "",

        description: "",

        is_new: false,

        is_best: false,
      });

      setAddingProductImage(null);

      (document.getElementById("image") as HTMLInputElement).value = "";
    } catch (error: any) {
      alert("Xəta baş verdi: " + (error.message || error));

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select("*");

      if (error) {
        console.error("Kateqoriyalar yüklənməsində xəta:", error);
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-900 p-6">
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">
            Məhsul Əlavə Et
          </h1>

          <p className="text-gray-400 text-sm mt-1">
            Sistemə yeni məhsul daxil edin
          </p>
        </div>

        <div className="p-8">
          <form className="space-y-6" onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-700"
                >
                  Məhsulun Adı
                </label>

                <input
                  type="text"
                  id="name"
                  required
                  value={productData.name}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  placeholder="Məs: Savalan Syrah"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="price"
                  className="text-sm font-semibold text-gray-700"
                >
                  Qiymət (AZN)
                </label>

                <input
                  type="number"
                  id="price"
                  required
                  value={productData.price}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  placeholder="0.00"
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="discount_price"
                  className="text-sm font-semibold text-gray-700"
                >
                  Endirimli Qiymət (AZN)
                </label>

                <input
                  type="number"
                  id="discount_price"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  placeholder="0.00"
                  onChange={handleInputChange}
                  value={productData.discount_price}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="category"
                className="text-sm font-semibold text-gray-700"
              >
                Kateqoriya
              </label>

              <select
                id="category"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                onChange={handleInputChange}
                value={productData.category}
              >
                <option value="">Kateqoriya seçin...</option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.slug || category.category}
                  >
                    {category.category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="description"
                className="text-sm font-semibold text-gray-700"
              >
                Açıqlama
              </label>

              <textarea
                id="description"
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none"
                placeholder="Məhsul haqqında ətraflı məlumat..."
                onChange={handleInputChange}
                value={productData.description}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_new"
                checked={productData.is_new}
                onCheckedChange={(checked) =>
                  setProductData({ ...productData, is_new: checked })
                }
              />

              <label htmlFor="is_new" className="text-sm font-medium">
                Yeni Məhsul
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_best"
                checked={productData.is_best}
                onCheckedChange={(checked) =>
                  setProductData({ ...productData, is_best: checked })
                }
              />

              <label htmlFor="is_best" className="text-sm font-medium">
                Ən Çox Satılan Məhsul
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="image"
                className="text-sm font-semibold text-red-500 uppercase italic"
              >
                Məhsul Şəkli
              </label>

              <input
                type="file"
                id="image"
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                onChange={(e) =>
                  setAddingProductImage(
                    e.target.files ? e.target.files[0] : null,
                  )
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all active:scale-[0.98] mt-4 uppercase tracking-widest"
            >
              {loading ? "Yüklənir..." : "Bazaya Əlavə Et"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductsPanel;
