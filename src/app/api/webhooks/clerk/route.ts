import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error("Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local");
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  try {
    if (evt.type === "user.created" || evt.type === "user.updated") {
      const { id, first_name, last_name, email_addresses } = evt.data;
      let user = await db.user.findUnique({
        where: {
          userId: id,
        },
      });
      if (user === null) {
        user = await db.user.create({
          data: {
            userId: id,
            firstName: first_name || "",
            lastName: last_name || "",
            emailAddress: email_addresses[0].email_address,
          },
        });
      } else {
        user = await db.user.update({
          where: {
            userId: id,
          },
          data: {
            firstName: first_name || "",
            lastName: last_name || "",
            emailAddress: email_addresses[0].email_address,
          },
        });
      }
      return NextResponse.json(user);
    }
    if (evt.type === "user.deleted") {
      const { id } = evt.data;
      const userToDelete = await db.user.findUnique({
        where: {
          userId: id,
        },
      });
      if (userToDelete !== null) {
        await db.user.delete({
          where: {
            userId: id,
          },
        });
      }
      return NextResponse.json(userToDelete);
    }

    return NextResponse.json({ message: "Unhandled event" }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
