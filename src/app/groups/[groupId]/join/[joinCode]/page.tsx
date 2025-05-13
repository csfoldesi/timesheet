import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { GroupIdParams } from "@/lib/params";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

const JoinPage = async ({ params }: GroupIdParams) => {
  const { groupId, joinCode } = await params;
  const { userId } = await auth();

  if (!userId) {
    return (
      <div>
        <p>A csoporthoz való csatlakozás előtt jelentkezz be</p>
        <SignInButton forceRedirectUrl={`/groups/${groupId}/join/${joinCode}`}>
          <Button className="m-4">Bejelentkezés</Button>
        </SignInButton>
      </div>
    );
  }

  const group = await db.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      members: true,
    },
  });
  if (!group) {
    return (
      <div>
        <p>A csoport nem található</p>
      </div>
    );
  }

  if (group.members.find((member) => member.userId === userId)) {
    return (
      <div>
        <p>Már tagja vagy a csoportnak</p>
        <Link href={`/groups/${groupId}`}>
          <Button className="m-4">Tovább</Button>
        </Link>
      </div>
    );
  }

  if (group.joinCode !== joinCode) {
    return (
      <div>
        <p>Hibás kód</p>
      </div>
    );
  }

  await db.member.create({
    data: {
      userId,
      groupId: group.id,
    },
  });

  return redirect(`/groups/${groupId}`);
};

export default JoinPage;
