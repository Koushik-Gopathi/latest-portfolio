import ScrollProgress from "@/components/ui/ScrollProgress";
import RedLanding from "@/components/hero/RedLanding";
import WhoAmI from "@/components/intro/WhoAmI";
import WorkspaceShowcase from "@/components/work/WorkspaceShowcase";
import ProjectShowcase from "@/components/work/ProjectsHorizontalScroll";
import SkillsBentoGrid from "@/components/work/SkillsBentoGrid";
import JourneyTimeline from "@/components/journey/JourneyTimeline";
import Education from "@/components/education/Education";
import ConnectCTA from "@/components/footer/ConnectCTA";

export default function Home() {
  return (
    // SmoothScroll lives in the root layout, not here: two Lenis instances
    // both rafing the same document fight each other and the scroll goes soft.
    <main className="min-h-screen bg-white text-black">
      <ScrollProgress />
      <RedLanding />
      <WhoAmI />
      <WorkspaceShowcase />
      <ProjectShowcase />
      <SkillsBentoGrid />
      <JourneyTimeline />
      <Education />
      <ConnectCTA />
    </main>
  );
}
