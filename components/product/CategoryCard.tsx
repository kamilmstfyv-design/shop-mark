"use client";
import { CategoryGridSkeleton } from "@/components/skeletons";
import { Card, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";

const CategoryCard = () => {
  const { categories, isFetching } = useCategories();
  return (
    <div className="main-container">
      <div className="py-6">
        <h1 className="pb-6 text-center text-2xl font-bold">Kategoriyalar</h1>

        {isFetching ? (
          <CategoryGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {categories[0] ? (
              categories.map((cat: any) => (
                <Link href={`/products?category=${cat.slug}`} key={cat.id}>
                  <Card className="relative mx-auto w-full max-w-sm overflow-hidden pt-0">
                    <div className="relative h-48 w-full sm:h-48">
                      <Image
                        src={cat.image_url}
                        alt={cat.category}
                        fill
                        sizes="(min-width: 1024px) 16vw, (min-width: 768px) 25vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    <CardTitle className="text-center text-2xl font-bold">
                      {cat.category}
                    </CardTitle>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center text-2xl font-bold text-slate-500">
                Kategoriyalar yoxdur
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;
