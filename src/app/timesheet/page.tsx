import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TimesheetTable } from "./_components/timesheet-table";

const TimesheetPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const timesheet = await db.timesheetItem.findMany({
    where: {
      userId,
    },
    orderBy: {
      timeFrom: "desc",
    },
  });

  return (
    <div className="container mx-auto">
      <TimesheetTable data={timesheet} />
    </div>
  );
};

export default TimesheetPage;
