import { TimesheetTable } from "@/app/timesheet/_components/timesheet-table";
import { db } from "@/lib/db";
import { GroupIdParams } from "@/lib/params";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { GroupHeader } from "./_components/group-header";
import { GroupProvider } from "./_components/GroupContext";

const GroupPage = async ({ params }: GroupIdParams) => {
  const { userId } = await auth();
  const { groupId } = await params;

  if (!userId) {
    return redirect("/");
  }

  const group = await db.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      members: true,
      timesheetItems: {
        orderBy: {
          timeFrom: "asc",
        },
      },
    },
  });

  if (!group?.members.find((member) => member.userId === userId)) {
    return (
      <div className="container mx-auto">
        <p>Nincs hozzáférésed ehhez a csoporthoz</p>
      </div>
    );
  }

  const timesheet = group.timesheetItems;

  return (
    <GroupProvider>
      <div className="container mx-auto">
        <p>{group?.name}</p>
        <GroupHeader groupId={groupId} />
        <TimesheetTable groupId={groupId} data={timesheet} />
      </div>
    </GroupProvider>
  );
};

export default GroupPage;
