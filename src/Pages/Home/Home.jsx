import BestSeller from "../../Components/Home/BestSeller";
import FeaturesSection from "../../Components/Home/FeaturesSection";
import HeroSlider from "../../Components/Home/HeroSlider";
import MensCollection from "../../Components/Home/MensCollection";
//import PromotionalBanner from "../../Components/Home/PromotionalBanner";
import WomensCollection from "../../Components/Home/WomensCollection";
import TopSellingProducts from "../../Components/Home/Topsellingproducts";
import CategoryWiseSections from "../../Components/Home/CategoryWiseSections";
//import PromotionalPopup from "../../Components/Shared/PromotionalPopup";

function Home() {
  return (
    <>
      <HeroSlider />
      <FeaturesSection />
      <TopSellingProducts />
      <BestSeller />
     {/*  <PromotionalBanner /> */}
      <MensCollection />
      <WomensCollection />
      {/* <PromotionalPopup/> */}
      <CategoryWiseSections />
    </>
  );
}

export default Home;