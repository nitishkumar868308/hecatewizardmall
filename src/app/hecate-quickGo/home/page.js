import HomeSlider from "@/components/HomeSlider/HomeSlider";
import ProductShowQuickGo from "@/components/productShowQuickGo/productShowQuickGo";
import LandingModal from "@/components/LandingModal/LandingModal";

export default function Home() {
    return (
        <>
            <LandingModal />
            <HomeSlider />
            <ProductShowQuickGo />
        </>
    );
}