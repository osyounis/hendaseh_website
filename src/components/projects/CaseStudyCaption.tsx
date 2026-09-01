/**
 * The tile's text. Apple's `.tile-rounded` pattern: an optional title and the
 * caption at the SAME size and weight (19px/600, set in case-study.css), with
 * `--fg-strong` against the caption's grey doing all the separating.
 *
 * Shared by the still blocks the template renders on the server and by
 * `CaseStudyVideo`, which is a client component -- one definition rather than
 * two that drift. It holds no state and reaches for no browser API, so it is
 * safe on either side of the boundary.
 *
 * With no title this emits exactly what the single-figure template emitted
 * before the media sequence existed: a `.case-caption` containing only text.
 */
export default function CaseStudyCaption({
  title,
  caption,
}: {
  title?: string;
  caption: string;
}) {
  return (
    <figcaption className="case-caption">
      {/* `<b>`, not a heading. The title labels the tile; it does not open a
          section, and an <h3> here would put a heading between two <h2>
          sections that it is not a subsection of. */}
      {title && <b className="case-media-title">{title}</b>}
      {caption}
    </figcaption>
  );
}
