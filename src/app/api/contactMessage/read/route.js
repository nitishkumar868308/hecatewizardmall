import prisma from "@/lib/prisma";

export async function PUT(req) {
    try {
        const { id, role } = await req.json();

        if (!id || !role) {
            return Response.json(
                { message: "id and role are required" },
                { status: 400 }
            );
        }

        let updateData = {};

        if (role === "admin") {
            updateData.readByAdmin = true;
        } else if (role === "user") {
            updateData.readByUser = true;
        } else {
            return Response.json(
                { message: "Invalid role" },
                { status: 400 }
            );
        }

        const message = await prisma.contactMessage.update({
            where: { id },
            data: updateData,
        });

        return Response.json({ message }, { status: 200 });
    } catch (err) {
        return Response.json({ message: err.message }, { status: 500 });
    }
}
