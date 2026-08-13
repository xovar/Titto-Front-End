import BestSeller from "../../Components/Home/BestSeller";
import FeaturesSection from "../../Components/Home/FeaturesSection";
import HeroSlider from "../../Components/Home/HeroSlider";
import MensCollection from "../../Components/Home/MensCollection";
import PromotionalBanner from "../../Components/Home/PromotionalBanner";
import WomensCollection from "../../Components/Home/WomensCollection";
//import PromotionalPopup from "../../Components/Shared/PromotionalPopup";

function Home() {
  return (
    <>
      <HeroSlider />
      <FeaturesSection />
      <BestSeller />
      <PromotionalBanner />
      <MensCollection />
      <WomensCollection />
      {/* <PromotionalPopup/> */}
    </>
  );
}

export default Home;
