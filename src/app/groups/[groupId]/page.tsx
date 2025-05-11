import { db } from "@/lib/db";
import { GroupIdParams } from "@/lib/params";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

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
  });

  return (
    <div className="container mx-auto">
      <p>{group?.name}</p>
      <pre>{JSON.stringify({ userId, groupId }, null, 2)}</pre>
    </div>
  );
};

export default GroupPage;
