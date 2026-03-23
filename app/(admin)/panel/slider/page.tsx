import SliderPhotos from "@/components/panel/SliderPhotos";
import AddSliderPhotos from "@/components/panel/AddSliderPhotos";

export const metadata = {
  title: "Slayder",
  description: "Ana səhifə slayder şəkilləri",
};

const SliderPanel = () => {
  return (
    <div>
      {/* datadan gelen fotolari ekrana listelemek */}
      <SliderPhotos />
      {/* Sliderin Database ine foto yuklemek ucun */}
      <AddSliderPhotos />
    </div>
  );
};

export default SliderPanel;
