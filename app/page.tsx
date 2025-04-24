import { HeroSection } from "@/src/components/home/HeroSection";
import { FeaturesSection } from "@/src/components/home/FeaturesSection";
import { CTASection } from "@/src/components/home/CTASection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="container max-w-6xl px-4 py-12 mx-auto">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </div>
    </div>
  );
}
