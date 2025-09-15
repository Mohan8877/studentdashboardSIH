"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send } from "lucide-react"

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: "Hello! I'm your study assistant. How can I help you today?", isUser: false },
  ])

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages((prev) => [...prev, { text: message, isUser: true }])
      setMessage("")
      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: "Thanks for your message! This is a demo response.", isUser: false }])
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Bot Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce hover:animate-none group"
        size="icon"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white transition-transform group-hover:rotate-90" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
        )}
      </Button>

      {/* Chat Interface */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 max-w-[calc(100vw-3rem)] h-96 max-h-[calc(100vh-8rem)] bg-white rounded-lg shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-2 duration-300 flex flex-col">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <h3 className="font-semibold">Study Assistant</h3>
            <p className="text-sm opacity-90">How can I help you today?</p>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    msg.isUser
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-slate-100 text-slate-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-200">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon" className="bg-blue-500 hover:bg-blue-600">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
