import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import GemsStoneSection from "@/components/home/GemsStoneSection";
import AuraSection from "@/components/home/AuraSection";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import FeaturedReviews from "@/components/home/FeaturedReviews";
import FeaturedBlogs from "@/components/home/FeaturedBlogs";
import NewsletterBanner from "@/components/home/NewsletterBanner";
import CollectionCarousel from "@/components/CollectionCarousel";
import CrystalTree from "@/components/home/CrystalTree";
import ImageBanner from "@/components/layout/ImageBanner";
import RudrakshaCalculator from "@/components/RudrakshaCalculator";
import FAQPage from "@/components/home/FAQ";
import WhatsAppButton from "@/components/home/WhatsAppButton";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <GemsStoneSection/>
      <AuraSection/>  
      <CollectionCarousel/>
      <FeaturedProducts />
      <CrystalTree/>
      {/* <WhyChooseUs /> */}
      {/* <FeaturedCollections /> */}
       <RudrakshaCalculator />
    
     
      <FeaturedReviews />
      <FAQPage/>
        <ImageBanner />
      <FeaturedBlogs />
      
      {/* <NewsletterBanner /> */}
    </div>
  );
}
