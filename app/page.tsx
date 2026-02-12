import { Hero } from '@/components/Hero'
import { Mission } from '@/components/Mission'
import { ImpactCounter } from '@/components/ImpactCounter'
import { ProjectsSection } from '@/components/ProjectsSection'
import { JoinSection } from '@/components/JoinSection'
import { CTA } from '@/components/CTA'

export default function Home() {
  return (
    <>
      <Hero />
      <Mission />
      <ImpactCounter />
      <ProjectsSection />
      <JoinSection />
      <CTA />
    </>
  )
}

