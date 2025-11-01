"use client";

// VAPI client initialization
// In VAPI v2.x, the library might export differently
// We'll initialize it in the component using useEffect instead

export const createVapiInstance = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    // Try to dynamically import and create instance
    // The actual initialization will happen in the component
    return null; // Will be initialized in component
  } catch (error) {
    console.error("Error creating VAPI instance:", error);
    return null;
  }
};

// Export a function to get VAPI instance dynamically
export const getVapiInstance = async () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const vapiModule = await import("@vapi-ai/web");
    const Vapi = vapiModule.default || vapiModule.Vapi || (vapiModule as any).default;
    
    if (!Vapi) {
      throw new Error("Vapi class not found");
    }

    return new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY || "");
  } catch (error) {
    console.error("Error initializing VAPI:", error);
    return null;
  }
};

// Export placeholder that will be replaced in component
export const vapi = {} as any;

