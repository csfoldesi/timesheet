import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const { groupId, name, timeFrom, timeTo } = await request.json();

    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }

    const timesheetItem = await db.timesheetItem.create({
      data: {
        groupId,
        userId,
        name,
        timeFrom,
        timeTo,
      },
    });
    return NextResponse.json(timesheetItem);
  } catch (error) {
    console.log("[TIMESHEETITEMS_ADD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    const { own } = await request.json();

    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }

    const timesheetItems = await db.timesheetItem.findMany({
      where: {
        ...(own ? { userId } : {}),
      },
      orderBy: {
        timeFrom: "desc",
      },
    });

    return NextResponse.json(timesheetItems);
  } catch (error) {
    console.log("[TIMESHEETITEMS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
