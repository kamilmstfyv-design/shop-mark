"use client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const AddingCategoryForm = ({
  handleFormSubmit,
  setCategoryName,
  setCategoryImage,
  loading,
  categoryName,
}: any) => {
  return (
    <>
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
    </>
  );
};

export default AddingCategoryForm;
