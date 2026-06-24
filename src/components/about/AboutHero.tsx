import Image from 'next/image';

export default function AboutHero() {
  return (
    /* Hero section with profile image */
    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-12">
      <Image
        src="/profile.jpg"
        alt="Omar Younis - Software Engineer"
        width={300}
        height={300}
        className="rounded-2xl"
        priority
      />
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-[#0A1A2F] mb-2">Omar Younis</h1>
        <p className="text-2xl text-[#0093FF] font-semibold mb-4">Software Engineer · iOS &amp; Machine Learning</p>
        <p className="text-xl text-gray-600">
          I&apos;m a software engineer and problem-solver: I design the solution, then learn what the
          problem requires. That approach has carried me from seven years in mechanical engineering
          through machine learning, data engineering, and a privacy-first iOS app I shipped to the
          App Store. The mechanical background isn&apos;t a detour—it&apos;s range: I can speak both
          Mechanical and Software, and translate between the teams on each side.
        </p>
      </div>
    </div>
  );
}
