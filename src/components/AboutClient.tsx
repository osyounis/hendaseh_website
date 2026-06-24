'use client';

import AboutHero from './about/AboutHero';
import AboutQualifications from './about/AboutQualifications';
import AboutJourney from './about/AboutJourney';
import AboutSkills from './about/AboutSkills';
import CareerHighlights from './about/CareerHighlights';
import AboutWhatIBuild from './about/AboutWhatIBuild';
import AboutWhyWorkWithMe from './about/AboutWhyWorkWithMe';
import AboutContact from './about/AboutContact';

export default function AboutClient() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <AboutHero />

      <div className="prose prose-lg max-w-none">
        <AboutQualifications />
        <AboutJourney />
        <AboutSkills />
        <CareerHighlights />
        <AboutWhatIBuild />
        <AboutWhyWorkWithMe />
        <AboutContact />
      </div>
    </div>
  );
}
