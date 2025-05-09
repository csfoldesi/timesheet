import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const { name, timeFrom, timeTo } = await request.json();

    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }

    const timesheetItem = await db.timesheetItem.create({
      data: {
        userId,
        name,
        timeFrom,
        timeTo,
      },
    });
    return NextResponse.json(timesheetItem);
  } catch (error) {
    console.log("[TIMESHEETITEMS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
