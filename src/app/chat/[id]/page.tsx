"use client";

import { useParams } from "next/navigation";
import { ChatIdView } from "@/views/chat-id";

export default function Chat() {
  const { id } = useParams();

  return <ChatIdView groupChatId={id as string} />;
}
