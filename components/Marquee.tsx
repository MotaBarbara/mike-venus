type MarqueeProps = {
    items: string[]
}

export default function Marquee({ items }: MarqueeProps) {
    // duplicated once so the CSS animation (-50%) loops seamlessly
    const track = [...items, ...items]

    return (
        <div className="marquee" aria-hidden="true">
            <div className="marquee__track">
                {track.map((item, i) => (
                    <span key={i}>{item}</span>
                ))}
            </div>
        </div>
    )
}
