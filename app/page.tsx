import Hero from "@/components/Hero";
import ServicesPreview from "@/components/ServicesPreview";
import ProcessTimeline from "@/components/ProcessTimeline";
import ContactTeaser from "@/components/ContactTeaser";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesPreview />
      <ProcessTimeline />
      <ContactTeaser />
    </>
  );
}