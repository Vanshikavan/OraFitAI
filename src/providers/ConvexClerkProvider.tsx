"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

// Validate environment variables
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!convexUrl) {
  console.error("❌ Missing NEXT_PUBLIC_CONVEX_URL environment variable");
}

if (!clerkKey) {
  console.error("❌ Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable");
}

const convex = convexUrl ? new ConvexReactClient(convexUrl) : null as any;

function ConvexClerkProvider({ children }: { children: React.ReactNode }) {
  if (!clerkKey || !convexUrl) {
    console.error("Missing required environment variables for Convex/Clerk");
    return <div>Configuration error: Please check your environment variables</div>;
  }

  return (
    <ClerkProvider publishableKey={clerkKey}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

export default ConvexClerkProvider;