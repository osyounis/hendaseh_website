export default function CareerHighlights() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-[#0A1A2F] mb-4">Career Highlights</h2>
      <div className="space-y-4">
        <div className="border-l-4 border-[#0093FF] pl-4">
          <h3 className="font-bold text-[#0A1A2F]">Software Engineer Intern - Qualcomm</h3>
          <p className="text-gray-600 text-sm mb-2">May 2024 - August 2024</p>
          <p className="text-gray-700">
            Built ETL pipelines processing 1M+ data points per minute for ML teams.
            Improved development efficiency by 40% through logging and monitoring solutions.
          </p>
        </div>
        <div className="border-l-4 border-[#0093FF] pl-4">
          <h3 className="font-bold text-[#0A1A2F]">Machine Learning Engineer - Elemeno AI</h3>
          <p className="text-gray-600 text-sm mb-2">August 2022 - November 2022</p>
          <p className="text-gray-700">
            Trained a feed-forward neural network that improved package-delivery prediction
            accuracy by 25%, with SQL and big-data EDA. Deployed on Google Cloud Platform.
          </p>
        </div>
        <div className="border-l-4 border-[#0093FF] pl-4">
          <h3 className="font-bold text-[#0A1A2F]">Lead Mechanical Engineer - D&K Engineering</h3>
          <p className="text-gray-600 text-sm mb-2">February 2019 - May 2021</p>
          <p className="text-gray-700">
            Led team of 20 engineers in developing ecoATMs, earning $1M contract extension.
            Built Python productivity tools that raised in-house engineering efficiency by roughly 50%.
          </p>
        </div>
        <div className="border-l-4 border-[#0093FF] pl-4">
          <h3 className="font-bold text-[#0A1A2F]">US Coast Guard Auxiliary - Member since 2015</h3>
          <p className="text-gray-600 text-sm mb-2">Flotilla Staff Officer for Operations · 2021 - 2026</p>
          <p className="text-gray-700">
            Developed Python productivity tools deployed fleet-wide across all US Coast Guard Air
            Stations. Received Coast Guard Auxiliary Achievement Medal for measurable impact.
          </p>
        </div>
      </div>
    </section>
  );
}
