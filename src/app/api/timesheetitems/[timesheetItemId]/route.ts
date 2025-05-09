import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface TimesheetIdParams {
  params: Promise<{
    timesheetItemId: string;
  }>;
}

export async function DELETE(request: Request, { params }: TimesheetIdParams) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }

    const { timesheetItemId } = await params;

    const timesheetItem = await db.timesheetItem.findUnique({
      where: {
        id: timesheetItemId,
      },
    });

    if (!timesheetItem) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (timesheetItem.userId !== userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }

    const deletedTimesheetItem = await db.timesheetItem.delete({
      where: {
        id: timesheetItemId,
      },
    });

    return NextResponse.json(deletedTimesheetItem);
  } catch (error) {
    console.log("[DELETE_TIMESHEETITEM_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
