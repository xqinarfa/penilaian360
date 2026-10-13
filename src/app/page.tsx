import { Navbar, Footer } from "@/components/layout";
import {
  HeroSection,
  AboutSection,
  WorkflowSection,
  CtaBannerSection,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="landing-page">
      {/* Skip to Content for A11y */}
      <a href="#main-content" className="skip-to-content">
        Lewati ke konten utama
      </a>

      <Navbar />

      <main id="main-content">
        <HeroSection />
        <AboutSection />
        <WorkflowSection />
        <CtaBannerSection />
      </main>

      <Footer />
    </div>
  );
}
