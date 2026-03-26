"use client";

import dynamic from "next/dynamic";

const AiChatbot = dynamic(() => import("./AiChatbot"), {
  ssr: false,
});

export default function ChatWrapper() {
  return <AiChatbot />;
}
