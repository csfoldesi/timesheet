import { db } from "@/lib/db";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Groups } from "./_components/groups";

const GroupsPage = async () => {
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
    <div>
      <header className="flex justify-start items-center p-4 gap-4 h-16">
        <h1 className="text-2xl font-bold">Csoportok</h1>
        <div className="flex-1" />
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <div className="container mx-auto">
        <Groups groups={groups} />
      </div>
    </div>
  );
};

export default GroupsPage;
