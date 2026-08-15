"use client";

import { useState } from "react";
import Link from "next/link";
import ArtistModal from "./ArtistModal";

export default function Nav() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="site-nav">
        <Link href="/" className="site-nav__corner">
          Mike Venus
        </Link>

        <button
          type="button"
          className="site-nav__corner site-nav__corner--about"
          aria-haspopup="dialog"
          aria-expanded={modalOpen}
          onClick={() => setModalOpen(true)}
        >
          About
        </button>

        <button
          type="button"
          className="site-nav__corner site-nav__corner--contact"
          aria-haspopup="dialog"
          aria-expanded={modalOpen}
          onClick={() => setModalOpen(true)}
        >
          Contact
        </button>
      </div>

      <ArtistModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
