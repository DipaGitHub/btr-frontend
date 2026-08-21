/**
 * Reusable infinite CSS marquee.
 * Duplicates the items array so the track loops seamlessly.
 *
 * CSS variables consumed:
 *   --marquee-duration  (default 35s)
 *   --marquee-gap       (default 56px)
 */
export function Marquee({
  items = [],
  speed = 35,
  gap = 56,
  direction = 'left',
  separator = null,
  renderItem,
  className = '',
}) {
  const track = [...items, ...items]

  return (
    <div
      className={`btr-marquee ${className}`}
      style={{ '--marquee-duration': `${speed}s`, '--marquee-gap': `${gap}px` }}

    >
      <div className="btr-marquee-track" data-direction={direction}>
        {track.map((item, i) => (
          <span key={i} className="btr-marquee-item">
            {renderItem ? renderItem(item, i) : item}
            {separator && (
              <span className="btr-marquee-sep" aria-hidden="true">
                {separator}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}
