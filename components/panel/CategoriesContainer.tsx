"use client";
import { CategoryGridSkeleton } from "@/components/skeletons";
import { useCategories } from "@/hooks/useCategories";
import AddingCategoryForm from "./AddingCategoryForm";
import RenderCaregories from "./RenderCaregories";

const CategoriesContainer = () => {
  const {
    categories,
    handleCatDelete,
    handleFormSubmit,
    setCategoryName,
    setCategoryImage,
    loading,
    categoryName,
    isFetching,
  } = useCategories();
  return (
    <>
      <div className="mx-auto max-w-xl">
        <AddingCategoryForm
          handleFormSubmit={handleFormSubmit}
          setCategoryName={setCategoryName}
          setCategoryImage={setCategoryImage}
          loading={loading}
          categoryName={categoryName}
        />

        <div className="py-6">
          <h1 className="pb-6 text-center text-2xl font-bold">Kategoriyalar</h1>

          {isFetching ? (
            <CategoryGridSkeleton count={4} className="lg:grid-cols-4" />
          ) : (
            <RenderCaregories
              categories={categories}
              handleCatDelete={handleCatDelete}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CategoriesContainer;
