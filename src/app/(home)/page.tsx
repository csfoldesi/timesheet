import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

const HomePage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="flex justify-center items-center w-full h-full p-10">
        <SignInButton>
          <Button>Bejelentkezés</Button>
        </SignInButton>
      </div>
    );
  }

  return redirect("/groups/");
};

export default HomePage;
