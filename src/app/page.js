import HeroSection from "./components/HeroSection";
import TopCampaigns from "./components/TopCampaigns";
import Testimonials from "./components/Testimonials";
import HowItWorks from "./components/HowItWorks";
import PlatformStats from "./components/PlatformStats";
import Categories from "./components/Categories";
import ChatBot from "./components/ChatBot";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TopCampaigns />
      <HowItWorks />
      <PlatformStats />
      <Categories />
      <Testimonials />
      <ChatBot />
    </>
  );
}