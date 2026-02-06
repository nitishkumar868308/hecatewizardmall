"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImageWithSkeleton({
    src,
    alt = "image",
    containerClass = "",
    priority = false
}) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={`relative overflow-hidden bg-[#0d0d0d] ${containerClass}`}>

            {/* Skeleton */}
            {!loaded && <div className="absolute inset-0 shimmer" />}

            <Image
                src={src}
                alt={alt}
                fill
                priority={priority}
                onLoad={() => setLoaded(true)}
                className={`object-cover transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"
                    }`}
            />

            <style jsx>{`
        .shimmer {
          background: linear-gradient(
            110deg,
            #0d0d0d 25%,
            #1a1a1a 37%,
            #0d0d0d 63%
          );
          background-size: 200% 100%;
          animation: shimmer 1.2s infinite linear;
        }

        @keyframes shimmer {
          to {
            background-position-x: -200%;
          }
        }
      `}</style>
        </div>
    );
}
