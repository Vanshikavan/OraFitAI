import { httpRouter } from "convex/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
    }

    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("No svix headers found", {
        status: 400,
      });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occurred", { status: 400 });
    }

    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, first_name, last_name, image_url, email_addresses } = evt.data;

      // Validate email_addresses array
      if (!email_addresses || !Array.isArray(email_addresses) || email_addresses.length === 0) {
        console.error("Error creating user: No email addresses found");
        return new Response("No email addresses found", { status: 400 });
      }

      const email = email_addresses[0]?.email_address;
      if (!email) {
        console.error("Error creating user: Invalid email address");
        return new Response("Invalid email address", { status: 400 });
      }

      const name = `${first_name || ""} ${last_name || ""}`.trim() || email.split("@")[0] || "User";

      try {
        await ctx.runMutation(api.users.syncUser, {
          email,
          name,
          image: image_url || undefined,
          clerkId: id,
        });
      } catch (error) {
        console.error("Error creating user:", error);
        return new Response("Error creating user", { status: 500 });
      }
    }

    if (eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      // Validate email_addresses array
      if (!email_addresses || !Array.isArray(email_addresses) || email_addresses.length === 0) {
        console.error("Error updating user: No email addresses found");
        return new Response("No email addresses found", { status: 400 });
      }

      const email = email_addresses[0]?.email_address;
      if (!email) {
        console.error("Error updating user: Invalid email address");
        return new Response("Invalid email address", { status: 400 });
      }

      const name = `${first_name || ""} ${last_name || ""}`.trim() || email.split("@")[0] || "User";

      try {
        await ctx.runMutation(api.users.updateUser, {
          clerkId: id,
          email,
          name,
          image: image_url || undefined,
        });
      } catch (error) {
        console.error("Error updating user:", error);
        return new Response("Error updating user", { status: 500 });
      }
    }

    return new Response("Webhooks processed successfully", { status: 200 });
  }),
});


export default http;