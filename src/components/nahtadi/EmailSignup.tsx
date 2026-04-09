'use client';

import { useState, FormEvent } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function EmailSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('email', email);

      await fetch(
        'https://buttondown.com/api/emails/embed-subscribe/hendaseh',
        {
          method: 'POST',
          body: formData,
          mode: 'no-cors',
        }
      );

      // no-cors responses are opaque; assume success if no network error
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="max-w-md mx-auto mb-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3"
      >
        <input
          type="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={status === 'loading' || status === 'success'}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="bg-[#0093FF] hover:bg-[#0075CC] text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-60"
        >
          {status === 'loading' ? 'Sending…' : 'Notify Me'}
        </button>
      </form>

      {status === 'success' && (
        <p className="mt-4 text-green-700 font-medium">
          You&apos;re in! We&apos;ll keep you posted.
        </p>
      )}
      {status === 'error' && (
        <p className="mt-4 text-red-600 font-medium">{errorMsg}</p>
      )}
    </div>
  );
}
