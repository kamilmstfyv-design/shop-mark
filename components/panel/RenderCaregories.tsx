"use client";
import Image from "next/image";
import { Card, CardTitle } from "../ui/card";
import { TrashIcon } from "lucide-react";

const RenderCaregories = ({
  categories,
  handleCatDelete,
}: {
  categories: any[];
  handleCatDelete: (id: string, imageUrl: string) => void;
}) => {
  return (
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
  );
};

export default RenderCaregories;
