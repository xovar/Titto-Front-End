import BestSeller from "../../Components/Home/BestSeller";
import FeaturesSection from "../../Components/Home/FeaturesSection";
import HeroSlider from "../../Components/Home/HeroSlider";
import PromotionalBanner from "../../Components/Home/PromotionalBanner";

function Home() {
  return (
    <>
      <HeroSlider />
      <FeaturesSection />
      <BestSeller />
      <PromotionalBanner />
    </>
  );
}

export default Home;
