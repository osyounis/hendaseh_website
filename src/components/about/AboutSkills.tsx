'use client';

import { motion } from 'framer-motion';

export default function AboutSkills() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-[#0A1A2F] mb-4">Technical Skills</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg"
        >
          <h3 className="text-xl font-bold text-[#0A1A2F] mb-3">iOS &amp; Apple</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Swift, SwiftUI, SwiftData</li>
            <li>• Xcode, XCTest</li>
            <li>• Accessibility (VoiceOver, Dynamic Type)</li>
            <li>• App Store publishing</li>
          </ul>
        </motion.div>
        <motion.div
          whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg"
        >
          <h3 className="text-xl font-bold text-[#0A1A2F] mb-3">Machine Learning &amp; Data</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Python, PyTorch, TensorFlow, scikit-learn</li>
            <li>• NumPy, Pandas, Computer Vision (OpenCV, YOLO)</li>
            <li>• ETL pipelines, AWS, GCP</li>
            <li>• SQL</li>
          </ul>
        </motion.div>
        <motion.div
          whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg"
        >
          <h3 className="text-xl font-bold text-[#0A1A2F] mb-3">Scientific &amp; Systems</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• C++, CUDA, parallel computing</li>
            <li>• Numerical &amp; scientific computing</li>
            <li>• Docker, Git, GitHub Actions (CI/CD)</li>
            <li>• pytest, unit testing</li>
          </ul>
        </motion.div>
        <motion.div
          whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg"
        >
          <h3 className="text-xl font-bold text-[#0A1A2F] mb-3">Engineering Background</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Mechanical product design</li>
            <li>• SolidWorks / CAD, FEA</li>
            <li>• GD&amp;T, manufacturing</li>
            <li>• A differentiator: I speak both Mechanical and Software</li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
