import SmoothScroll from "@/components/ui/SmoothScroll";
import RedLanding from "@/components/hero/RedLanding";
import WhoAmI from "@/components/intro/WhoAmI";
import WorkspaceShowcase from "@/components/work/WorkspaceShowcase";
import ProjectShowcase from "@/components/work/ProjectsHorizontalScroll";
import SkillsBentoGrid from "@/components/work/SkillsBentoGrid";
import JourneyTimeline from "@/components/journey/JourneyTimeline";
import ConnectCTA from "@/components/footer/ConnectCTA";


export default function Home() {
  return (
    <main className="bg-white text-black min-h-screen">
      <SmoothScroll />
      <RedLanding />
      <WhoAmI />
      <WorkspaceShowcase />
      <ProjectShowcase />
      <SkillsBentoGrid />
      <JourneyTimeline />
      <ConnectCTA/>
    </main>
  );
}