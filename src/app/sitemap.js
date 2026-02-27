// app/sitemap.js

import prisma from "@/lib/prisma"

export default async function sitemap() {
    const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "https://hecatewizardmall.com"


    const products = await prisma.product.findMany({
        select: {
            id: true,
            updatedAt: true,
        },
    })

    const staticPaths = [
        "/",
        "/hecate-quickGo/home",
        "/categories",
        "/about",
        "/contact",
        "/faq",
        "/privacy-policy",
        "/terms-and-conditions",
        "/refund-policy",
        "/shipping-and-return-policy",
    ]

    const staticUrls = staticPaths.map((path) => ({
        url: `${baseUrl}${path}`,
        lastModified: new Date().toISOString(),
        priority: path === "/" ? 1.0 : 0.8,
    }))

    const productUrls = products.map((product) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: product.updatedAt,
        priority: 0.9,
    }))

    return [...staticUrls, ...productUrls]
}