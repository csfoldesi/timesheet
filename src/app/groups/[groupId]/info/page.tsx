import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/lib/db";
import { GroupIdParams } from "@/lib/params";

const GroupInfoPage = async ({ params }: GroupIdParams) => {
  const { groupId } = await params;

  const members = await db.member.findMany({
    where: {
      groupId: groupId,
    },
    select: {
      user: true,
    },
  });
  const users = members.map((member) => member.user);

  const group = await db.group.findUnique({
    where: {
      id: groupId,
    },
    select: {
      name: true,
      joinCode: true,
    },
  });

  const joinUrl = `${process.env.FRONTEND_URL}/groups/${groupId}/join/${group?.joinCode}`;

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Név</TableHead>
            <TableHead>Email cím</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.lastName} {user.firstName}
              </TableCell>
              <TableCell>{user.emailAddress}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div>Meghívó: {joinUrl}</div>
    </div>
  );
};

export default GroupInfoPage;
