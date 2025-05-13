import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";

export default async function JoinLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{
    groupId: string;
  }>;
}>) {
  const { groupId } = await params;
  const group = await db.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      members: true,
    },
  });

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Csatlakozás a csoporthoz: {group?.name || groupId}</CardTitle>
          <CardDescription />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">{children}</CardContent>
      </Card>
    </div>
  );
}
