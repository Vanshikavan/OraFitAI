"use client";

import Vapi from "@vapi-ai/web";

// Initialize a single Vapi instance for the web SDK.
// The SDK uses public workflows; no secret keys on the client.
// Optionally, you can pass a custom base URL with { serverUrl: process.env.NEXT_PUBLIC_VAPI_URL }
export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY as string);

// Helper function to start a call with proper error handling
export const startVapiCall = async (workflowId: string, variableValues: Record<string, any>) => {
  try {
    if (!workflowId) {
      throw new Error("Workflow ID is required");
    }

    // Request microphone permission before starting the call
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone permission granted");
    } catch (micError) {
      console.error("Microphone permission denied:", micError);
      throw new Error("Microphone access is required for voice calls. Please allow microphone access and try again.");
    }
    
    const result = await vapi.start(workflowId, {
      variableValues,
    });
    
    return result;
  } catch (error) {
    console.error("Failed to start Vapi call:", error);
    throw error;
  }
};

// Helper function to stop a call
export const stopVapiCall = () => {
  try {
    vapi.stop();
  } catch (error) {
    console.error("Failed to stop Vapi call:", error);
  }
};


