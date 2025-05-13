import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

export default async function GroupLayout({
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
    <div>
      <header className="flex justify-start items-center p-4 gap-4 h-16">
        <Link href={`/groups/`}>
          <Button variant="outline">
            <ChevronLeftIcon />
            Vissza
          </Button>
        </Link>

        <h1 className="text-2xl font-bold">{group?.name}</h1>
        <div className="flex-1" />
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <div className="container mx-auto">{children}</div>
    </div>
  );
}
