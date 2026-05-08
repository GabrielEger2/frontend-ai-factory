"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface ProductMediaProps {
  image: string;
  imageAlt: string;
  videoSrc?: string;
  className?: string;
  loading?: "lazy" | "eager";
}

const noop = () => {};

export default function ProductMedia({
  image,
  imageAlt,
  videoSrc,
  className,
  loading = "lazy",
}: ProductMediaProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const showVideo = !!videoSrc && !shouldReduceMotion;

  useEffect(() => {
    if (!showVideo) return;
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          video.play().catch(noop);
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [showVideo]);

  return (
    <div ref={containerRef} className={className}>
      <img
        src={image}
        alt={imageAlt}
        loading={loading}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {showVideo && (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={image}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
