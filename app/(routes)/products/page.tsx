"use client";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Xəta:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = category
    ? products.filter((product) => product.category_slug === category)
    : products;

  if (loading)
    return (
      <div className="text-center py-20 font-medium">
        Məhsullar gətirilir...
      </div>
    );
  if (filteredProducts.length === 0)
    return (
      <div className="text-center py-20 opacity-50">
        Bu kateqoriyada məhsul tapılmadı.
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="main-container">
        {/* Başlıq Hissəsi */}
        <div className="mb-10 border-b border-gray-200 pb-2">
          <h1 className="text-3xl font-serif font-bold text-gray-900 uppercase tracking-widest">
            {category ? category.replace("-", " ") : "Bütün Kolleksiya"}
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-light italic">
            Seçilmiş dadlar, unikal anlar üçün.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {filteredProducts.map((product: any) => (
            <div key={product.id} className="group">
              <div className="relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
                {/* 1. Şəkil Sahəsi (Daha yığcam aspect-ratio) */}
                <div className="relative aspect-square w-full bg-gray-50">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-contain p-2" // Şüşə tam görünsün deyə object-contain
                  />
                  {product.is_new && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                      Yeni
                    </span>
                  )}
                </div>

                {/* 2. Məlumat Hissəsi (Minimum boşluqlar) */}
                <div className="p-3 flex-grow flex flex-col">
                  <h2 className="text-[13px] font-bold text-gray-800 line-clamp-1 leading-tight">
                    {product.name}
                  </h2>

                  <div className="flex items-center gap-2 mt-1">
                    {product.discount_price > 0 ? (
                      <>
                        <span className="text-[14px] font-black text-red-600">
                          {product.discount_price} AZN
                        </span>
                        <span className="text-[10px] text-gray-400 line-through">
                          {product.price} AZN
                        </span>
                      </>
                    ) : (
                      <span className="text-[14px] font-black text-gray-900">
                        {product.price} AZN
                      </span>
                    )}
                  </div>

                  {/* Açıqlama - Çox kiçik və yığcam */}
                  <p className="text-[10px] text-gray-500 line-clamp-1 mt-1 italic">
                    {product.description}
                  </p>

                  {/* 3. Düymələr (Yan-yana və simmetrik) */}
                  {/* Düymələr Sahəsi */}
                  <div className="mt-auto pt-3 grid grid-cols-5 gap-2">
                    {/* Səbətə At (Açıq Boz) - 2 sütun tutur */}
                    <button className="col-span-2 flex items-center justify-center py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all active:scale-95">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="8" cy="21" r="1" />
                        <circle cx="19" cy="21" r="1" />
                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                      </svg>
                    </button>

                    {/* WhatsApp İlə Sifariş (Yaşıl) - 3 sütun tutur */}
                    <button
                      onClick={() =>
                        window.open(
                          `https://wa.me/994555120157?text=Salam, ${product.name} sifariş vermək istəyirəm. Qiyməti: ${product.discount_price || product.price} AZN`,
                          "_blank",
                        )
                      }
                      className="col-span-3 flex items-center justify-center gap-1.5 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] transition-all shadow-sm active:scale-95"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z" />
                      </svg>
                      <span className="text-[11px] font-bold uppercase tracking-tighter">
                        Sifariş
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
