"use client"

import { useState } from "react"
import { ChatList } from "@/components/company/chat-list"
import { ChatMessages } from "@/components/company/chat-messages"
import { ChatEmpty } from "@/components/company/chat-empty"

export default function CompanyChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden flex rounded-lg border bg-white dark:bg-gray-950 dark:border-gray-800">
        <div className="w-80 border-r dark:border-gray-800 flex flex-col">
          <div className="p-4 border-b dark:border-gray-800">
            <h2 className="text-lg font-semibold">Conversas</h2>
          </div>
          <ChatList onSelectChat={setSelectedChat} selectedChatId={selectedChat} />
        </div>
        <div className="flex-1 flex flex-col">
          {selectedChat ? <ChatMessages chatId={selectedChat} /> : <ChatEmpty />}
        </div>
      </div>
    </div>
  )
}
