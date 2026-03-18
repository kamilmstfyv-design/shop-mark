"use client";
import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const CategoryCard = () => {
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
  return (
    <div className="main-container">
      <div className="py-6">
        <h1 className="text-2xl font-bold text-center pb-6">Kategoriyalar</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories[0] ? (
            categories.map((cat: any) => (
              <Link href={`/products?category=${cat.slug}`} key={cat.id}>
                <Card className="relative mx-auto w-full max-w-sm pt-0 overflow-hidden">
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
            <div className="text-center text-2xl font-bold">
              Kategoriyalar yoxdur
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
