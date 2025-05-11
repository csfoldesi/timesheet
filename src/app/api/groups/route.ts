import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const { name } = await request.json();

    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }

    const group = await db.group.create({
      data: {
        name,
        ownerId: userId,
        joinCode: Math.random().toString(36).substring(2, 8),
      },
    });

    await db.member.create({
      data: {
        userId,
        groupId: group.id,
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.log("[GROUPS_ADD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
