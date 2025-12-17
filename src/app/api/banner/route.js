import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
    try {
        const banners = await prisma.banner.findMany({
            where: { deleted: false },
            orderBy: { createdAt: "desc" },
            include: {
                countries: { orderBy: { position: "asc" } },
                states: {
                    orderBy: { position: "asc" },
                    include: { state: true },
                },
            },
        });

        return Response.json({ message: "Banners fetched", data: banners });
    } catch (error) {
        return Response.json(
            { message: "Failed to fetch banners", error: error.message },
            { status: 500 }
        );
    }
}


export async function POST(req) {
    try {
        const formData = await req.formData();

        const text = formData.get("text");
        const active = formData.get("active") === "true";
        const platform = JSON.parse(formData.get("platform"));
        const countries = JSON.parse(formData.get("countries"));
        const states = JSON.parse(formData.get("states"));
        const countryNumbers = JSON.parse(formData.get("countryNumbers"));
        const stateNumbers = JSON.parse(formData.get("stateNumbers"));
        const image = formData.get("image");

        if (!platform.xpress && !platform.website) {
            return Response.json({ message: "Platform required" }, { status: 400 });
        }

        const banner = await prisma.banner.create({
            data: {
                text,
                image,
                active,
                platform: Object.keys(platform).filter(k => platform[k]),

                countries: {
                    create: countries.map(code => ({
                        countryCode: code,
                        position: countryNumbers[code] || 1,
                    })),
                },

                states: {
                    create: states.map(id => ({
                        stateId: Number(id),
                        position: stateNumbers[id] || 1,
                    })),
                },
            },
            include: {
                countries: true,
                states: { include: { state: true } },
            },
        });

        return Response.json(
            { message: "Banner created", data: banner },
            { status: 201 }
        );

    } catch (error) {
        console.error(error);
        return Response.json(
            { message: "Failed to create banner", error: error.message },
            { status: 500 }
        );
    }
}



export async function PUT(req) {
    try {
        const formData = await req.formData();

        const id = Number(formData.get("id"));
        const text = formData.get("text");
        const active = formData.get("active") === "true";
        const platform = JSON.parse(formData.get("platform"));
        const countries = JSON.parse(formData.get("countries"));
        const states = JSON.parse(formData.get("states"));
        const countryNumbers = JSON.parse(formData.get("countryNumbers"));
        const stateNumbers = JSON.parse(formData.get("stateNumbers"));

        const imageField = formData.get("image");
        const image = typeof imageField === "string" ? imageField : null;

        /* =============================
           1️⃣ OLD DATA FETCH (IMPORTANT)
        ============================== */
        const existingBanner = await prisma.banner.findUnique({
            where: { id },
            include: {
                countries: true,
                states: true,
            },
        });

        /* =============================
           2️⃣ COUNTRY POSITION CHECK
        ============================== */
        for (let c of countries) {
            const code = typeof c === "string" ? c : c.countryCode;
            const newPos = countryNumbers[code];

            const old = existingBanner.countries.find(
                (x) => x.countryCode === code
            );

            // 👉 agar position same hai → skip check
            if (old && old.position === newPos) continue;

            // 👉 sirf jab position change ho
            const conflict = await prisma.bannerCountry.findFirst({
                where: {
                    countryCode: code,
                    position: newPos,
                    bannerId: { not: id },
                },
            });

            if (conflict) {
                return Response.json(
                    {
                        message: `Country ${code} already has position ${newPos} in another banner`,
                    },
                    { status: 400 }
                );
            }
        }

        /* =============================
   3️⃣ STATE POSITION CHECK
============================== */
        for (let s of states) {
            const stateId = typeof s === "number" ? s : s.stateId;
            const newPos = stateNumbers[stateId];

            const old = existingBanner.states.find(
                (x) => x.stateId === Number(stateId)
            );

            // 👉 agar position same hai → skip
            if (old && old.position === newPos) continue;

            const conflict = await prisma.bannerState.findFirst({
                where: {
                    stateId: Number(stateId),
                    position: newPos,
                    bannerId: { not: id },
                },
                include: {
                    state: true, // 🔥 IMPORTANT
                },
            });

            if (conflict) {
                return Response.json(
                    {
                        message: `State "${conflict.state.name}" already has position ${newPos} in another banner`,
                    },
                    { status: 400 }
                );
            }
        }


        /* =============================
           4️⃣ SAFE UPDATE
        ============================== */
        const banner = await prisma.banner.update({
            where: { id },
            data: {
                text,
                image,
                active,
                platform: Object.keys(platform).filter((k) => platform[k]),

                countries: {
                    deleteMany: {},
                    create: countries.map((c) => {
                        const code = typeof c === "string" ? c : c.countryCode;
                        return {
                            countryCode: code,
                            position: countryNumbers[code] || 1,
                        };
                    }),
                },

                states: {
                    deleteMany: {},
                    create: states.map((s) => {
                        const stateId = typeof s === "number" ? s : s.stateId;
                        return {
                            stateId: Number(stateId),
                            position: stateNumbers[stateId] || 1,
                        };
                    }),
                },
            },
            include: {
                countries: true,
                states: { include: { state: true } },
            },
        });

        return Response.json({
            message: "Banner updated successfully",
            data: banner,
        });
    } catch (error) {
        return Response.json(
            { message: "Failed to update banner", error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json();

        if (!id) {
            return Response.json({ message: "Banner ID required" }, { status: 400 });
        }

        const banner = await prisma.banner.update({
            where: { id },
            data: { deleted: true },
        });

        return Response.json({ message: "Banner deleted", data: banner });
    } catch (error) {
        return Response.json(
            { message: "Failed to delete banner", error: error.message },
            { status: 500 }
        );
    }
}
