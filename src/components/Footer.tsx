export default function Footer() {
  return (
    // The hairline is inset to the page container, not full-bleed.
    <footer className="page-wrap text-subtle">
      <div className="border-edge-soft flex flex-col items-center gap-2 border-t py-14 text-[13px] sm:flex-row sm:justify-between">
        <span>&copy; {new Date().getFullYear()} Omar Younis</span>
        <span>omar@hendaseh.com &middot; Sunnyvale, CA</span>
      </div>
    </footer>
  );
}
