import { put } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";

import { db } from "~/server/db";
import { getSession } from "~/server/better-auth/server";

export async function POST(request: NextRequest) {
	const session = await getSession();
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const user = await db.user.findUnique({
		where: { id: session.user.id },
		select: { role: true },
	});

	if (user?.role !== "ADMIN") {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const { searchParams } = new URL(request.url);
	const filename = searchParams.get("filename");

	if (!filename) {
		return NextResponse.json({ error: "Filename required" }, { status: 400 });
	}

	const blob = await put(filename, request.body!, {
		access: "public",
	});

	return NextResponse.json(blob);
}
