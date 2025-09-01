import { clearSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST() {
    clearSession();

    return NextResponse.json({ message: "Logged out successfully" });
}
