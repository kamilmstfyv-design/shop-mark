"use client";

import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { Switch } from "@/components/ui/switch";

type AddingProductFormProps = {
  /** Məhsul əlavə olunduqdan sonra məhsul siyahısını yeniləmək üçün (məs. panel) */
  onSuccess?: () => void | Promise<void>;
};

const AddingProductForm = ({ onSuccess }: AddingProductFormProps) => {
  const { categories } = useCategories();
  const {
    variants,
    loading,
    addingProductImage,
    setAddingProductImage,
    productData,
    handleFormSubmit,
    handleInputChange,
    updateVariants,
    addVariants,
    deleteVariants,
    setProductData,
  } = useProducts({ onSuccess });
  return (
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
          {/* Məhsulun Litrləri */}
          {/* Admin Panel: Variantlar (Litr və Qiymət) Əlavə Etmə Sahəsi */}
          <div className="space-y-4 border-t pt-4 mt-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase text-gray-500 tracking-wider text-red-600 italic">
                Məhsul Variantları (Həcm və Qiymət)
              </label>
              <button
                type="button"
                onClick={addVariants}
                className="text-[10px] bg-gray-900 text-white px-3 py-1 rounded-md hover:bg-black uppercase font-bold"
              >
                + Yeni Variant
              </button>
            </div>

            {/* Variant Sətiri 1 */}
            {variants.map((variant, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-2 rounded-lg border border-gray-200"
              >
                <div className="col-span-4">
                  <input
                    type="text"
                    placeholder="Həcm (Məs: 0.5 L)"
                    className="w-full text-xs p-2 rounded border border-gray-300 outline-none focus:border-red-500"
                    value={variant.size}
                    onChange={(e) =>
                      updateVariants(index, "size", e.target.value)
                    }
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    placeholder="Qiymət"
                    className="w-full text-xs p-2 rounded border border-gray-300 outline-none focus:border-red-500"
                    value={variant.price}
                    onChange={(e) =>
                      updateVariants(index, "price", e.target.value)
                    }
                  />
                </div>
                <div className="col-span-4">
                  <input
                    type="number"
                    placeholder="Endirimli Q."
                    className="w-full text-xs p-2 rounded border border-gray-300 outline-none focus:border-red-500"
                    value={variant.discountPrice}
                    onChange={(e) =>
                      updateVariants(index, "discountPrice", e.target.value)
                    }
                  />
                </div>
                <div
                  className="col-span-1 flex justify-center text-red-500 cursor-pointer hover:scale-110"
                  onClick={() => deleteVariants(index)}
                >
                  {/* Silmə Düyməsi */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </div>
              </div>
            ))}
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
                setAddingProductImage(e.target.files ? e.target.files[0] : null)
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
  );
};

export default AddingProductForm;
