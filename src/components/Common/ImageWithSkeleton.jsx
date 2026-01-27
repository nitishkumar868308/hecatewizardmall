"use client";

import Image from "next/image";
import { useState } from "react";

const ImageWithSkeleton = ({
    src,
    alt = "",
    className = "",
    containerClass = "",
    priority = false,
    sizes = "100vw",
    ...props
}) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div
            className={`relative overflow-hidden bg-gray-200 ${containerClass}`}
        >
            {/* Skeleton */}
            {!loaded && (
                <div className="absolute inset-0 animate-pulse bg-gray-300" />
            )}

            {/* Image */}
            <Image
                src={src}
                alt={alt}
                fill
                sizes={sizes}
                priority={priority}
                className={`object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"
                    } ${className}`}
                onLoadingComplete={() => setLoaded(true)}
                {...props}
            />
        </div>
    );
};

export default ImageWithSkeleton;
