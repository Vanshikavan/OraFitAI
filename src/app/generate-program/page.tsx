"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const GenerateProgramPage = () => {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [callEnded, setCallEnded] = useState(false);
  const [vapi, setVapi] = useState<any>(null);

  const { user } = useUser();
  const router = useRouter();

  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Initialize VAPI
  useEffect(() => {
    let isMounted = true;
    let vapiInstance: any = null;

    const initVapi = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
        
        // Debug: Check if API key exists (show first few chars only)
        console.log("🔍 Checking VAPI configuration...");
        if (apiKey) {
          console.log(`✅ API Key found: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)} (length: ${apiKey.length})`);
        } else {
          console.error("❌ VAPI Error: NEXT_PUBLIC_VAPI_API_KEY is not set!");
          console.error("📝 Please add NEXT_PUBLIC_VAPI_API_KEY to your .env.local file");
          console.error("💡 Make sure to restart your dev server after adding the key!");
          if (isMounted) {
            alert("❌ VAPI API Key Missing!\n\nPlease add NEXT_PUBLIC_VAPI_API_KEY to your .env.local file and restart the server.");
          }
          return;
        }

        const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
        if (workflowId) {
          console.log(`✅ Workflow ID found: ${workflowId.substring(0, 8)}...`);
        } else {
          console.warn("⚠️ Workflow ID not set: NEXT_PUBLIC_VAPI_WORKFLOW_ID");
        }

        const vapiModule = await import("@vapi-ai/web");
        const Vapi = vapiModule.default || vapiModule.Vapi;
        
        if (!Vapi) {
          console.error("❌ Vapi class not found in @vapi-ai/web");
          return;
        }

        vapiInstance = new Vapi(apiKey);
        if (isMounted) {
          setVapi(vapiInstance);
          console.log("✅ VAPI initialized successfully");
        }
      } catch (error) {
        console.error("❌ Error initializing VAPI:", error);
      }
    };

    if (typeof window !== "undefined") {
      initVapi();
    }

    // Cleanup: Stop VAPI call if component unmounts during active call
    return () => {
      isMounted = false;
      if (vapiInstance) {
        try {
          vapiInstance.stop?.();
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  // SOLUTION to get rid of "Meeting has ended" error
  useEffect(() => {
    const originalError = console.error;
    // override console.error to ignore "Meeting has ended" errors
    console.error = function (msg, ...args) {
      if (
        msg &&
        (msg.includes("Meeting has ended") ||
          (args[0] && args[0].toString().includes("Meeting has ended")))
      ) {
        console.log("Ignoring known error: Meeting has ended");
        return; // don't pass to original handler
      }

      // pass all other errors to the original handler
      return originalError.call(console, msg, ...args);
    };

    // restore original handler on unmount
    return () => {
      console.error = originalError;
    };
  }, []);

  // auto-scroll messages
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // navigate user to profile page after the call ends
  useEffect(() => {
    if (callEnded) {
      const redirectTimer = setTimeout(() => {
        try {
          router.push("/profile");
        } catch (error) {
          console.error("Error navigating to profile:", error);
          // Fallback: try window.location if router fails
          window.location.href = "/profile";
        }
      }, 1500);

      return () => clearTimeout(redirectTimer);
    }
  }, [callEnded, router]);

  // setup event listeners for vapi
  useEffect(() => {
    if (!vapi) return;

    const handleCallStart = () => {
      console.log("Call started");
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
    };

    const handleCallEnd = () => {
      console.log("Call ended");
      setCallActive(false);
      setConnecting(false);
      setIsSpeaking(false);
      setCallEnded(true);
    };

    const handleSpeechStart = () => {
      console.log("AI started Speaking");
      setIsSpeaking(true);
    };

    const handleSpeechEnd = () => {
      console.log("AI stopped Speaking");
      setIsSpeaking(false);
    };

    const handleMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { content: message.transcript, role: message.role };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const handleError = (error: any) => {
      console.log("Vapi Error", error);
      setConnecting(false);
      setCallActive(false);
    };

    vapi
      .on("call-start", handleCallStart)
      .on("call-end", handleCallEnd)
      .on("speech-start", handleSpeechStart)
      .on("speech-end", handleSpeechEnd)
      .on("message", handleMessage)
      .on("error", handleError);

    // cleanup event listeners on unmount
    return () => {
      if (vapi) {
        vapi
          .off("call-start", handleCallStart)
          .off("call-end", handleCallEnd)
          .off("speech-start", handleSpeechStart)
          .off("speech-end", handleSpeechEnd)
          .off("message", handleMessage)
          .off("error", handleError);
      }
    };
  }, [vapi]);

  const toggleCall = async () => {
    if (!vapi) {
      console.error("❌ VAPI not initialized yet. Please check your VAPI_PUBLIC_KEY.");
      alert("VAPI is not initialized. Please check your environment variables:\n\n- NEXT_PUBLIC_VAPI_API_KEY\n- NEXT_PUBLIC_VAPI_WORKFLOW_ID");
      return;
    }

    if (callActive) {
      try {
        vapi.stop?.();
      } catch (error) {
        console.error("Error stopping call:", error);
        // Still update state even if stop fails
        setCallActive(false);
        setConnecting(false);
      }
      return;
    }

    try {
      const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
      
      if (!workflowId) {
        console.error("⚠️ VAPI Error: NEXT_PUBLIC_VAPI_WORKFLOW_ID is not set!");
        alert("VAPI Workflow ID is missing. Please add NEXT_PUBLIC_VAPI_WORKFLOW_ID to your .env.local file");
        setConnecting(false);
        return;
      }

      setConnecting(true);
      setMessages([]);
      setCallEnded(false);

      const fullName = user?.firstName
        ? `${user.firstName} ${user.lastName || ""}`.trim()
        : user?.emailAddresses?.[0]?.emailAddress || "Guest";
      
      if (!fullName || fullName.trim() === "") {
        console.warn("⚠️ User name is empty, using fallback");
      }

      await vapi.start(workflowId, {
        variableValues: {
          full_name: fullName,
          user_id: user?.id,
        },
      });
    } catch (error: any) {
      console.error("❌ Failed to start call:", error);
      console.error("Error details:", {
        type: error?.type,
        status: error?.error?.status || error?.error?.statusCode,
        message: error?.message,
        error: error?.error,
      });
      
      // More specific error messages
      if (error?.error?.status === 401 || error?.error?.statusCode === 401) {
        const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
        const keyInfo = apiKey 
          ? `Current key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`
          : "❌ API key is MISSING!";
        
        alert(`❌ 401 Unauthorized: VAPI rejected your API key.\n\n${keyInfo}\n\nPlease verify:\n1. Your API key is correct from VAPI dashboard\n2. The key is active and has proper permissions\n3. You've restarted the dev server after adding the key\n4. The key starts with the correct prefix (check VAPI docs)`);
      } else if (error?.error?.status === 404 || error?.error?.statusCode === 404) {
        alert("❌ Workflow not found (404): Please check your NEXT_PUBLIC_VAPI_WORKFLOW_ID is correct");
      } else {
        alert(`Failed to start call: ${error?.message || error?.type || "Unknown error"}\n\nCheck the console for more details.`);
      }
      
      setConnecting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden  pb-6 pt-24">
      <div className="container mx-auto px-4 h-full max-w-5xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-mono">
            <span>Generate Your </span>
            <span className="text-primary uppercase">Fitness Program</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Have a voice conversation with our AI assistant to create your personalized plan
          </p>
        </div>

        {/* VIDEO CALL AREA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* AI ASSISTANT CARD */}
          <Card className="bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative">
            <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
              {/* AI VOICE ANIMATION */}
              <div
                className={`absolute inset-0 ${
                  isSpeaking ? "opacity-30" : "opacity-0"
                } transition-opacity duration-300`}
              >
                {/* Voice wave animation when speaking */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-center items-center h-20">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`mx-1 h-16 w-1 bg-primary rounded-full ${
                        isSpeaking ? "animate-sound-wave" : ""
                      }`}
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        height: isSpeaking ? `${Math.random() * 50 + 20}%` : "5%",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* AI IMAGE */}
              <div className="relative size-32 mb-4">
                <div
                  className={`absolute inset-0 bg-primary opacity-10 rounded-full blur-lg ${
                    isSpeaking ? "animate-pulse" : ""
                  }`}
                />

                <div className="relative w-full h-full rounded-full bg-card flex items-center justify-center border border-border overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-secondary/10"></div>
                  <img
                    src="/ai-avatar.jpg"
                    alt="AI Assistant"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold text-foreground">OraFit AI</h2>
              <p className="text-sm text-muted-foreground mt-1">Fitness & Diet Coach</p>

              {/* SPEAKING INDICATOR */}

              <div
                className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border ${
                  isSpeaking ? "border-primary" : ""
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isSpeaking ? "bg-primary animate-pulse" : "bg-muted"
                  }`}
                />

                <span className="text-xs text-muted-foreground">
                  {isSpeaking
                    ? "Speaking..."
                    : callActive
                      ? "Listening..."
                      : callEnded
                        ? "Redirecting to profile..."
                        : "Waiting..."}
                </span>
              </div>
            </div>
          </Card>

          {/* USER CARD */}
          <Card className={`bg-card/90 backdrop-blur-sm border overflow-hidden relative`}>
            <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
              {/* User Image */}
              <div className="relative size-32 mb-4">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="User"
                    className="size-full object-cover rounded-full"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      if (target.nextElementSibling) {
                        (target.nextElementSibling as HTMLElement).style.display = "flex";
                      }
                    }}
                  />
                ) : null}
                <div 
                  className={`size-full rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center border border-border ${!user?.imageUrl ? "flex" : "hidden"}`}
                >
                  <span className="text-3xl font-bold text-primary">
                    {user?.firstName?.charAt(0)?.toUpperCase() || user?.emailAddresses?.[0]?.emailAddress?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-foreground">You</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {user ? (user.firstName + " " + (user.lastName || "")).trim() : "Guest"}
              </p>

              {/* User Ready Text */}
              <div className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border`}>
                <div className={`w-2 h-2 rounded-full bg-muted`} />
                <span className="text-xs text-muted-foreground">Ready</span>
              </div>
            </div>
          </Card>
        </div>

        {/* MESSAGE COINTER  */}
        {messages.length > 0 && (
          <div
            ref={messageContainerRef}
            className="w-full bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4 mb-8 h-64 overflow-y-auto transition-all duration-300 scroll-smooth"
          >
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <div key={index} className="message-item animate-fadeIn">
                  <div className="font-semibold text-xs text-muted-foreground mb-1">
                    {msg.role === "assistant" ? "CodeFlex AI" : "You"}:
                  </div>
                  <p className="text-foreground">{msg.content}</p>
                </div>
              ))}

              {callEnded && (
                <div className="message-item animate-fadeIn">
                  <div className="font-semibold text-xs text-primary mb-1">System:</div>
                  <p className="text-foreground">
                    Your fitness program has been created! Redirecting to your profile...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CALL CONTROLS */}
        <div className="w-full flex justify-center gap-4">
          <Button
            className={`w-40 text-xl rounded-3xl ${
              callActive
                ? "bg-destructive hover:bg-destructive/90"
                : callEnded
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-primary hover:bg-primary/90"
            } text-white relative`}
            onClick={toggleCall}
            disabled={connecting || callEnded}
          >
            {connecting && (
              <span className="absolute inset-0 rounded-full animate-ping bg-primary/50 opacity-75"></span>
            )}

            <span>
              {callActive
                ? "End Call"
                : connecting
                  ? "Connecting..."
                  : callEnded
                    ? "View Profile"
                    : "Start Call"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default GenerateProgramPage;