"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const AiChatbot = dynamic(() => import("./AiChatbot"), {
  ssr: false,
});

export default function ChatWrapper() {
  const pathname = usePathname();
  
  // Hide the chatbot in PRO tool areas (CV tool and automated plan)
  const isProTool = pathname?.startsWith("/cv-tool") || pathname?.startsWith("/plan-de-empleabilidad");
  
  if (isProTool) return null;
  
  return <AiChatbot />;
}
