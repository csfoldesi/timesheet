import { auth } from "@clerk/nextjs/server";

export const authHelper = async () => {
  const { userId } = await auth();
  return { userId: userId || "GUEST" };
};
