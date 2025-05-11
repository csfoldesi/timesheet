import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Groups } from "./_components/groups";

const HomePage = async () => {
  const { userId } = await auth();

  const groupRecords = await db.member.findMany({
    where: {
      userId: userId || "GUEST",
      group: {
        isDeleted: false,
      },
    },
    select: {
      group: true,
    },
    orderBy: {
      group: {
        name: "asc",
      },
    },
  });
  const groups = groupRecords.map((record) => record.group);

  return (
    <div className="container mx-auto">
      <Groups groups={groups} />
    </div>
  );
};

export default HomePage;
