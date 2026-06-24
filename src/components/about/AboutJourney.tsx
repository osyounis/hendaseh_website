export default function AboutJourney() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-[#0A1A2F] mb-4">My Journey</h2>
      <p className="text-gray-700 mb-4 leading-relaxed">
        I spent about seven years as a mechanical engineer across military defense systems, medical
        devices, and precision manufacturing. At D&amp;K Engineering I led a 20-person team building
        the ecoATM kiosk and earned a $1M contract extension. The constant across that work was
        problem-solving: find what the system needs, then build it.
      </p>
      <p className="text-gray-700 mb-4 leading-relaxed">
        I moved into software the same way. At Elemeno AI I trained a feed-forward neural network
        that improved package-delivery prediction accuracy by 25%, building the data pipelines and
        running the exploratory analysis behind it, deployed on Google Cloud. At Qualcomm I built
        ETL pipelines processing 1M+ data points per minute for ML teams.
      </p>
      <p className="text-gray-700 mb-4 leading-relaxed">
        My M.S. in Computer Science at Cal State Fullerton (May 2026) capped it. My graduate project
        parallelized Brent&apos;s root-finding method on the GPU in CUDA, hitting a 35× kernel-level
        speedup on an NVIDIA RTX 3080. It taught me to think in hardware, memory layout, and where
        performance actually comes from.
      </p>
      <p className="text-gray-700 mb-4 leading-relaxed">
        Most recently I designed and shipped Nahtadi, a privacy-first iOS prayer-times and Qibla
        app, to the App Store—built in SwiftUI/SwiftData, fully on-device, and accessible to WCAG
        standards. iOS is where my newest work lives; machine learning, data engineering, and
        scientific computing sit alongside it as range. That CUDA and on-device work is also
        pointing me toward on-device ML.
      </p>
    </section>
  );
}
