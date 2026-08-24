import type { Metadata } from 'next';
import { HiMail, HiLocationMarker, HiDocumentDownload } from 'react-icons/hi';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Contact - Omar Younis | Software Engineer — iOS & ML',
  description: 'Get in touch with Omar Younis for software engineering opportunities, contract work, or project inquiries.',
  keywords: ['contact', 'hire software engineer', 'contract development', 'software engineering services'],
  alternates: {
    canonical: 'https://hendaseh.com/contact',
  },
  openGraph: {
    title: 'Contact - Omar Younis | Software Engineer — iOS & ML',
    description: 'Get in touch with Omar Younis for software engineering opportunities, contract work, or project inquiries.',
    url: 'https://hendaseh.com/contact',
    siteName: 'Hendaseh',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og/site.png', width: 1200, height: 630, alt: 'Omar Younis — Software Engineer · iOS & Machine Learning' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact - Omar Younis | Software Engineer — iOS & ML',
    description: 'Get in touch with Omar Younis for software engineering opportunities, contract work, or project inquiries.',
    images: ['/og/site.png'],
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Header Section */}
      <section className="text-center mb-16 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-[#0A1A2F] mb-6">
          Let&apos;s Work Together
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Available for full-time software engineering opportunities and contract engagements.
          Whether you have a project in mind or want to discuss potential collaboration, I&apos;d love to hear from you.
        </p>
      </section>

      {/* Direct channels (form removed — design pass comes in sub-project 4) */}
      <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
        {/* Quick Contact */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-[#0A1A2F] mb-4">Quick Contact</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <HiMail className="w-5 h-5 text-[#0093FF] flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <a
                  href="mailto:omar@hendaseh.com"
                  className="text-[#0A1A2F] hover:text-blue-600 font-medium transition-colors"
                >
                  omar@hendaseh.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HiLocationMarker className="w-5 h-5 text-[#0093FF] flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Location</p>
                <p className="text-[#0A1A2F] font-medium">Sunnyvale, CA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-[#0A1A2F] mb-4">Connect</h2>
          <div className="space-y-3">
            <a
              href="https://www.linkedin.com/in/omar-younis/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <FaLinkedin className="w-5 h-5 text-[#0077B5]" />
              <span className="text-[#0A1A2F] group-hover:text-blue-600 font-medium">
                LinkedIn
              </span>
            </a>
            <a
              href="https://github.com/osyounis"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <FaGithub className="w-5 h-5 text-[#101411]" />
              <span className="text-[#0A1A2F] group-hover:text-blue-600 font-medium">
                GitHub
              </span>
            </a>
            <a
              href="/omar_younis_resume_2026.pdf"
              download="Omar_Younis_Resume.pdf"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <HiDocumentDownload className="w-5 h-5 text-[#0093FF]" />
              <span className="text-[#0A1A2F] group-hover:text-blue-600 font-medium">Résumé (PDF)</span>
            </a>
          </div>
        </div>

        {/* Response Time */}
        <div className="bg-white border-2 border-[#0093FF] rounded-lg p-6">
          <h2 className="text-lg font-bold text-[#0A1A2F] mb-2">Response Time</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            I typically respond to inquiries within <strong>24-48 hours</strong> during business days.
          </p>
        </div>
      </div>

      {/* Additional Info */}
      <section className="max-w-3xl mx-auto text-center py-12 px-8 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-bold text-[#0A1A2F] mb-4">Email Me</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          You can reach me at{' '}
          <a href="mailto:omar@hendaseh.com" className="text-blue-600 hover:text-blue-700 font-medium">
            omar@hendaseh.com
          </a>
          . I&apos;m available for discussions about full-time opportunities, contract projects, or technical
          collaborations.
        </p>
        <a
          href="mailto:omar@hendaseh.com"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0093FF] text-white rounded-lg hover:bg-[#0075CC] transition-colors font-medium"
        >
          <HiMail className="w-5 h-5" />
          Email Me Directly
        </a>
      </section>
    </div>
  );
}
