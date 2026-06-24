'use client';

import HomeHero from './home/HomeHero';
import HomeCapabilities from './home/HomeCapabilities';
import FeaturedProjects from './home/FeaturedProjects';
import HomeCTA from './home/HomeCTA';

export default function HomepageClient() {
  return (
    <div>
      <HomeHero />

      <div className="max-w-6xl mx-auto px-4">
        <HomeCapabilities />
        <FeaturedProjects />
        <HomeCTA />
      </div>
    </div>
  );
}
