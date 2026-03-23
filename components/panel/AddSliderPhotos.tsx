"use client";
import { useSlider } from "@/hooks/useSlider";

const AddSliderPhotos = () => {
  const { handleFormSubmit, setAddingSliderFile, uploading } = useSlider();
  return (
    <section>
      <h1 className="text-center text-3xl font-bold pt-5">
        Slaydere Sekil elave etmek
      </h1>
      <div className="flex justify-center mt-5">
        {/* foto yuklemek ucun form */}
        <form
          className="p-6 bg-gray-800 rounded-xl shadow-lg max-w-sm"
          onSubmit={handleFormSubmit}
        >
          <label className="block">
            <span className="sr-only">Şəkil seçin</span>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-400
  file:mr-4 file:py-2 file:px-4
  file:rounded-full file:border-0
  file:text-sm file:font-semibold
  file:bg-green-50 file:text-green-700
  hover:file:bg-green-100
  cursor-pointer
  focus:outline-none"
              onChange={(e) =>
                setAddingSliderFile(e.target.files ? e.target.files[0] : null)
              }
            />
          </label>
          <button
            type="submit"
            className="bg-red-500 w-full rounded-lg mt-5 text-white font-bold"
          >
            {uploading ? "Yuklenir........." : "Yukle"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddSliderPhotos;
