import {
  LandingNavbar,
  HeroSection,
  StatsSection,
  FeaturesSection,
  HowItWorksSection,
  PricingSection,
  TestimonialsSection,
  CtaSection,
  FooterSection,
} from "../../components/landing";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-lp-base transition-colors">
      <LandingNavbar />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <FooterSection />
    </div>
  );
};

export default LandingPage;
