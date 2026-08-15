"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import styles from "./HomeGrid.module.css";

const TRACKS = [
  {
    image: "Daniel_Caesar_Transform.jpg",
    youtubeId: "y0jrnWc2ru4",
    caption: "Daniel Caesar - Transform",
  },
  {
    image: "DanielCaesar_Loose.jpg",
    youtubeId: "L8NB6etqeNM",
    caption: "Daniel Caesar - Loose",
  },
  {
    image: "DanielCaesar_StreetCar.jpg",
    youtubeId: "lTsfLsXwyHE",
    caption: "Daniel Caesar - Street Card",
  },
  {
    image: "DanielCaesar_Superpowers.jpg",
    youtubeId: "T2vHQlEWYaY",
    caption: "Daniel Caesar - Superpowers",
  },
  {
    image: "Drake&Yebba_YebbasHeartbreak.jpg",
    youtubeId: "c31LEm2vO",
    caption: "Drake&Yebba - Yebba's Heartbreak ",
  },
  {
    image: "Michael_Jackson_RememberTheTime.jpg",
    youtubeId: "6sV2jthjqCU",
    caption: "Michael Jackson - Remember The Time",
  },
  {
    image: "MikeVenus_BlueLove.jpg",
    youtubeId: "78hqYSYl3IA",
    caption: "Mike Venus - Blue Love",
  },
  {
    image: "OliviaDean_SoEasy.jpg",
    youtubeId: "LvpEql-dK9A",
    caption: "Olivia Dean - So Easy",
  },
  {
    image: "SuperPowers_Orchestral.jpg",
    youtubeId: "1pw1gJQL-vI",
    caption: "SuperPowers - Orchestral",
  },
  {
    image: "TomOdell_AnotherLove.jpg",
    youtubeId: "G3DU2kMkA78",
    caption: "Tom Odell - Another Love",
  },
  {
    image: "YebbasHeartbreak_Orchestral.jpg",
    youtubeId: "the-real-video-id",
    caption: "Yebbas Heartbreak - Orchestral",
  },
];

function hashAspectRatio(seed: string, min = 0.65, max = 1.6) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const normalized = (Math.abs(hash) % 1000) / 1000; // 0..1
  return min + normalized * (max - min);
}

function ContentBlock({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className={styles.content} aria-hidden={hidden || undefined}>
      {TRACKS.map((track) => (
        <div key={track.image} className={styles.tile}>
          <div
            className={styles.media}
            data-video={track.youtubeId}
            style={{ aspectRatio: hashAspectRatio(track.image) }}
          >
            <img src={`/medias/${track.image}`} alt="" draggable={false} />
            <span className={styles.play} />
          </div>
          <p className={styles.caption}>{track.caption}</p>
        </div>
      ))}
    </div>
  );
}

export default function HomeGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  // lock page scroll while the drag-grid handles all movement, restore on unmount
  useEffect(() => {
    document.body.classList.add("page-home");
    return () => document.body.classList.remove("page-home");
  }, []);

  // GSAP drag/scroll effect + click-vs-drag detection for the lightbox
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    gsap.registerPlugin(Observer);

    const halfX = container.clientWidth / 2;
    const wrapX = gsap.utils.wrap(-halfX, 0);
    const xTo = gsap.quickTo(container, "x", {
      duration: 1.5,
      ease: "power4",
      modifiers: { x: gsap.utils.unitize(wrapX) },
    });

    const halfY = container.clientHeight / 2;
    const wrapY = gsap.utils.wrap(-halfY, 0);
    const yTo = gsap.quickTo(container, "y", {
      duration: 1.5,
      ease: "power4",
      modifiers: { y: gsap.utils.unitize(wrapY) },
    });

    let incrX = 0;
    let incrY = 0;

    const observer = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      onChangeX: (self) => {
        incrX += self.event.type === "wheel" ? -self.deltaX : self.deltaX * 2;
        xTo(incrX);
      },
      onChangeY: (self) => {
        incrY += self.event.type === "wheel" ? -self.deltaY : self.deltaY * 2;
        yTo(incrY);
      },
    });

    let downX = 0;
    let downY = 0;
    let moveDist = 0;
    const DRAG_THRESHOLD = 8;

    function onPointerDown(e: PointerEvent) {
      downX = e.clientX;
      downY = e.clientY;
      moveDist = 0;
    }

    function onPointerMove(e: PointerEvent) {
      moveDist = Math.max(
        moveDist,
        Math.hypot(e.clientX - downX, e.clientY - downY)
      );
    }

    function onClick(e: MouseEvent) {
      if (moveDist > DRAG_THRESHOLD) return; // was a drag, not a click
      const mediaEl = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-video]"
      );
      if (!mediaEl) return;
      const id = mediaEl.dataset.video;
      if (id) setVideoId(id);
    }

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    container.addEventListener("click", onClick);

    return () => {
      observer.kill();
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("click", onClick);
    };
  }, []);

  // Esc closes the lightbox
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setVideoId(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <section className={styles.grid}>
        <div className={styles.container} ref={containerRef}>
          <ContentBlock />
          <ContentBlock hidden />
          <ContentBlock hidden />
          <ContentBlock hidden />
        </div>
      </section>

      <div
        className={`lightbox ${videoId ? "is-open" : ""}`}
        aria-hidden={!videoId}
        onClick={(e) => {
          if (e.target === e.currentTarget) setVideoId(null);
        }}
      >
        <button
          className="lightbox__close"
          aria-label="Close video"
          onClick={() => setVideoId(null)}
        >
          &times;
        </button>
        <div className="lightbox__frame">
          {videoId && (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title="Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </>
  );
}
