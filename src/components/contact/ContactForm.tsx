'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, type ContactFormData } from '@/lib/validations/contact';
import { sendContactEmail } from '@/app/contact/actions';
import { HiMail, HiUser, HiDocumentText, HiCheckCircle, HiXCircle } from 'react-icons/hi';

export default function ContactForm() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur', // Validate on blur for better UX
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus('loading');
    setErrorMessage('');

    const result = await sendContactEmail(data);

    if (result.success) {
      setSubmitStatus('success');
      reset(); // Clear form

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } else {
      setSubmitStatus('error');
      setErrorMessage(result.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto">
      {/* Success Message */}
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <HiCheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          <p className="text-green-800 font-medium">
            Message sent successfully! I'll get back to you soon.
          </p>
        </div>
      )}

      {/* Error Message */}
      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <HiXCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <p className="text-red-800">{errorMessage}</p>
        </div>
      )}

      {/* Name Field */}
      <div className="mb-6">
        <label htmlFor="name" className="block text-[#0A1A2F] font-medium mb-2">
          Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            {...register('name')}
            id="name"
            type="text"
            placeholder="John Doe"
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0093FF] transition-all ${
              errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            disabled={submitStatus === 'loading'}
          />
        </div>
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="mb-6">
        <label htmlFor="email" className="block text-[#0A1A2F] font-medium mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            {...register('email')}
            id="email"
            type="email"
            placeholder="john@example.com"
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0093FF] transition-all ${
              errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            disabled={submitStatus === 'loading'}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Subject Field */}
      <div className="mb-6">
        <label htmlFor="subject" className="block text-[#0A1A2F] font-medium mb-2">
          Subject <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <HiDocumentText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            {...register('subject')}
            id="subject"
            type="text"
            placeholder="Project inquiry"
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0093FF] transition-all ${
              errors.subject ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            disabled={submitStatus === 'loading'}
          />
        </div>
        {errors.subject && (
          <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
        )}
      </div>

      {/* Message Field */}
      <div className="mb-6">
        <label htmlFor="message" className="block text-[#0A1A2F] font-medium mb-2">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('message')}
          id="message"
          rows={6}
          placeholder="Tell me about your project or inquiry..."
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0093FF] transition-all resize-y ${
            errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          disabled={submitStatus === 'loading'}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitStatus === 'loading'}
        className={`w-full py-4 px-6 rounded-lg font-medium text-white transition-all ${
          submitStatus === 'loading'
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#0093FF] hover:bg-[#0075CC] hover:shadow-lg'
        }`}
      >
        {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
