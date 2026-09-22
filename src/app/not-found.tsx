import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * The site's 404. Renders inside the root layout, so nav, footer, fonts and
 * tokens come for free; Next still answers 404 and injects `noindex` itself.
 * Card-tier slugs land here too (`dynamicParams = false` on /projects/[slug]).
 *
 * Deliberately quiet: one headline set like the home hero's name, one line of
 * direction, two ways out. No "404" eyebrow and no motion -- nothing here
 * answers a user action, so there is nothing to animate.
 *
 * `title` resolves through the root template to `Page Not Found - Omar
 * Younis`. Providing this file also removes the second `<title>` Next's
 * built-in 404 used to inject. Guarded by tests/e2e/not-found.spec.ts.
 */
export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'This page does not exist on hendaseh.com.',
};

export default function NotFound() {
  return (
    <section className="page-wrap flex min-h-[70svh] flex-col items-center justify-center py-20 text-center">
      <h1 className="text-primary text-[clamp(40px,6.5vw,72px)] leading-[1.05] font-black tracking-[-0.02em] text-balance">
        This page can’t be found.
      </h1>

      <p className="text-secondary text-body mt-5 max-w-[36rem] text-pretty">
        The link may be out of date, or the address may have a typo.
      </p>

      <div className="mt-9 flex flex-wrap justify-center gap-[14px]">
        <Link href="/" className="pill pill-primary">
          Go to homepage
        </Link>
        <Link href="/projects" className="pill pill-secondary">
          View projects
        </Link>
      </div>
    </section>
  );
}
