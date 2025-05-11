import { db } from "@/lib/db";
import { GroupIdParams } from "@/lib/params";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: GroupIdParams) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }

    const { groupId } = await params;

    const group = await db.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (group.ownerId !== userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }

    const deletedGroup = await db.group.update({
      where: {
        id: groupId,
      },
      data: {
        isDeleted: true,
      },
    });

    // TODO: what about members / timesheets?

    return NextResponse.json(deletedGroup);
  } catch (error) {
    console.log("[DELETE_GROUP_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: GroupIdParams) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }

    const { groupId } = await params;
    const { name } = await request.json();

    const group = await db.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (group.ownerId !== userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }

    const updatedGroup = await db.group.update({
      where: {
        id: groupId,
      },
      data: {
        name,
      },
    });

    // TODO: what about members / timesheets?

    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.log("[DELETE_GROUP_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
