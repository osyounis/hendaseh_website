import Link from 'next/link';

export default function AboutWhatIBuild() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-[#0A1A2F] mb-4">What I Build</h2>
      <p className="text-gray-700 mb-4 leading-relaxed">
        My projects combine engineering rigor with software development, creating practical
        tools with real-world impact:
      </p>
      <ul className="space-y-2 text-gray-700 ml-6">
        <li>
          • <strong>Data Engineering Tools</strong>: ETL pipelines processing millions of data points
        </li>
        <li>
          • <strong>Machine Learning Applications</strong>: Computer vision, NLP, and predictive models
        </li>
        <li>
          • <strong>Scientific Computing</strong>: Astronomical calculations, maritime navigation algorithms
        </li>
        <li>
          • <strong>Engineering Software</strong>: CAD-integrated tools for mechanical design
        </li>
      </ul>
      <p className="text-gray-700 mt-4 leading-relaxed">
        Check out my{' '}
        <Link href="/projects" className="text-blue-600 hover:text-blue-800 font-medium">
          projects page
        </Link>{' '}
        to see what I&apos;ve built, or visit my{' '}
        <a
          href="https://github.com/osyounis"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          GitHub profile
        </a>{' '}
        to explore the code.
      </p>
    </section>
  );
}
