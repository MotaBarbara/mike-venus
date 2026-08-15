'use client'

import { useEffect } from 'react'

type ArtistModalProps = {
    open: boolean
    onClose: () => void
}

const SOCIALS = [
    { label: 'Youtube', href: 'https://youtube.com/@mikevenus' },
    { label: 'Soundcloud', href: 'https://soundcloud.com/mikevenus' },
    { label: 'Instagram', href: 'https://instagram.com/mikevenus' },
]

export default function ArtistModal({ open, onClose }: ArtistModalProps) {
    // Esc closes the modal
    useEffect(() => {
        if (!open) return
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [open, onClose])

    return (
        <div
            className={`modal-overlay ${open ? 'is-open' : ''}`}
            aria-hidden={!open}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div className="modal" role="dialog" aria-modal="true" aria-label="Artist info">
                <div className="modal__header">
                    <h2 className="modal__title">Mike Venus</h2>
                    <button type="button" className="modal__close" aria-label="Close" onClick={onClose}>
                        &times;
                    </button>
                </div>

                <p className="modal__body">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat.
                </p>

                <nav className="modal__links">
                    {SOCIALS.map((social) => (
                        <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">
                            {social.label}
                        </a>
                    ))}
                </nav>
            </div>
        </div>
    )
}
