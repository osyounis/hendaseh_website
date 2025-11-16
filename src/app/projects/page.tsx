import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Projects | Omar Younis',
  description: 'Software engineering projects - data engineering tools, machine learning applications, scientific computing, and engineering software',
};

const projects = [
  {
    id: 'islamic-prayer-time',
    title: 'Islamic Prayer Time App',
    description:
      'Pure Python library for calculating Muslim prayer times and Qibla direction using astronomical algorithms. Supports multiple calculation methods, DST handling, and works for any location worldwide. Features 105 comprehensive unit tests and modular architecture.',
    technologies: ['Python', 'Astronomical Algorithms', 'Unit Testing'],
    githubUrl: 'https://github.com/osyounis/islamic_prayer_time_app',
    liveUrl: null,
    featured: true,
    stats: '33 commits • GPL-3.0',
  },
  {
    id: 'collision-avoidance-radar',
    title: 'Collision Avoidance Radar Plotting App',
    description:
      'Educational Python application for maritime navigators to train in collision avoidance calculations using radar plotting techniques. Computes Closest Point of Approach (CPA) and determines required course/speed changes. Built for Coast Guard Auxiliary training.',
    technologies: ['Python', 'Streamlit', 'Matplotlib', 'NumPy', 'Pytest'],
    githubUrl: 'https://github.com/osyounis/collision_avoidance_radar_plotting_app',
    liveUrl: null, // Will be added when deployed
    featured: true,
    stats: '19 commits • GPL-3.0',
  },
  {
    id: 'cycloidal-drive-creator',
    title: 'Cycloidal Drive Creator',
    description:
      'Python application that generates parametric equations for cycloidal drive rotors (mechanical speed reducers). Creates rotor profiles that can be directly imported into SolidWorks CAD software via "Equation Driven Curve" feature.',
    technologies: ['Python', 'Tkinter', 'NumPy', 'Matplotlib'],
    githubUrl: 'https://github.com/osyounis/cycloidal_drive_creator',
    liveUrl: null,
    featured: true,
    stats: '29 commits • 22 stars • MIT',
  },
  {
    id: 'image-watermark-remover',
    title: 'Image Watermark Remover',
    description:
      'Machine learning project implementing a Pix2Pix generative adversarial network using PyTorch to automatically eliminate watermarks from digital images. Trained on ~16,700 watermarked images from Unsplash dataset.',
    technologies: ['Python', 'PyTorch', 'Pix2Pix', 'Deep Learning'],
    githubUrl: 'https://github.com/osyounis/image_watermark_remover',
    liveUrl: null,
    featured: true,
    stats: '10 stars • MIT',
  },
  {
    id: 'coast-guard-pilot-tracker',
    title: 'Coast Guard Pilot Training Tracker',
    description:
      'Productivity tool for accessing and summarizing training data for Coast Guard pilots. Adopted across ALL Coast Guard Air Stations nationwide. Reduced summarizing time from one week to 3 minutes. Received Coast Guard Auxiliary Achievement Medal.',
    technologies: ['Python', 'Excel', 'pandas', 'numpy', 'VBA'],
    githubUrl: null,
    liveUrl: null,
    featured: true,
    stats: 'Fleet-wide deployment • USCG Achievement Medal',
  },
  {
    id: 'coast-guard-inventory',
    title: 'Coast Guard Helicopter Inventory System',
    description:
      'Efficient inventory system and database to enhance Coast Guard helicopter maintenance operations. Resulted in 85% reduction in search time. Currently in operation at Coast Guard Air Station San Diego.',
    technologies: ['Python', 'Excel', 'pandas', 'numpy'],
    githubUrl: null,
    liveUrl: null,
    featured: false,
    stats: 'In production at USCG San Diego',
  },
  {
    id: 'asl-detector',
    title: 'American Sign Language Letter Detector',
    description:
      'Lightweight Python app that detects ASL letters from images or video to help students practice hand positions. Uses a retrained YOLOv5 model for real-time detection.',
    technologies: ['Python', 'Streamlit', 'YOLOv5', 'Computer Vision'],
    githubUrl: 'https://github.com/osyounis/asl_letter_detector',
    liveUrl: null,
    featured: false,
    stats: 'Object Detection',
  },
  {
    id: 'wildfire-predictor',
    title: 'California Wildfire Likelihood Predictor',
    description:
      'Predictive model to determine the likelihood of California wildfires based on weather and historical data. Uses TensorFlow for model training and API for data retrieval.',
    technologies: ['Python', 'TensorFlow', 'Scikit-Learn', 'Seaborn'],
    githubUrl: null,
    liveUrl: null,
    featured: false,
    stats: 'ML Classification',
  },
];

export default function Projects() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Projects</h1>
        <p className="text-xl text-gray-700">
          A collection of software engineering projects showcasing expertise in data engineering,
          machine learning, scientific computing, and engineering applications.
        </p>
      </div>

      <div className="grid gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-gray-200 rounded-lg p-8 hover:border-gray-400 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
              {project.featured && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                  Featured
                </span>
              )}
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">{project.description}</p>

            {project.stats && (
              <p className="text-sm text-gray-500 mb-4">{project.stats}</p>
            )}

            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex gap-4">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  View on GitHub
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Live Demo →
                </a>
              )}
              {!project.githubUrl && !project.liveUrl && (
                <span className="px-6 py-2 text-gray-500 italic">
                  Internal/Private Project
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-700 mb-4">Want to see more?</p>
        <a
          href="https://github.com/osyounis"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Visit My GitHub Profile →
        </a>
      </div>
    </div>
  );
}
