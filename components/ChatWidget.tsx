'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, X, MessageCircle, RotateCcw } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatWidgetProps {
  isOpen: boolean
  onToggle: () => void
  prefilledMessage?: string
  onPrefilledMessageUsed?: () => void
}

export default function ChatWidget({ isOpen, onToggle, prefilledMessage, onPrefilledMessageUsed }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [sessionRestored, setSessionRestored] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive (only within chat container)
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  // Try to restore existing session
  useEffect(() => {
    if (isOpen && !hasStarted && !sessionRestored) {
      restoreOrStartSession()
    }
  }, [isOpen, hasStarted, sessionRestored])

  const restoreOrStartSession = async () => {
    setSessionRestored(true)
    setIsLoading(true)

    try {
      // Try to restore existing session
      const response = await fetch('/api/chat')
      const data = await response.json()

      if (data.session && data.session.messages && data.session.messages.length > 0) {
        // Restore existing conversation
        setMessages(data.session.messages)
        setHasStarted(true)
        setIsLoading(false)
        return
      }
    } catch (error) {
      console.error('Session restore error:', error)
    }

    // No existing session, start fresh
    setHasStarted(true)
    sendMessage('', true)
  }

  const startNewConversation = async () => {
    // Clear the session cookie by starting fresh
    setMessages([])
    setHasStarted(true)
    setIsLoading(true)

    // Delete the cookie client-side isn't possible for httpOnly cookies
    // So we just start a new conversation which will be saved as a new session
    // For a true "new session", we'd need an API endpoint to clear it

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [], newSession: true }),
      })

      const data = await response.json()
      if (data.message) {
        setMessages([{ role: 'assistant', content: data.message }])
      }
    } catch (error) {
      console.error('New conversation error:', error)
      setMessages([{
        role: 'assistant',
        content: "Hey! Welcome to Lessons Not Losses Fitness. I'm here to help you get started with a personalized meal plan. What's your name?",
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle prefilled message
  useEffect(() => {
    if (isOpen && prefilledMessage && messages.length > 0 && !isLoading) {
      setInput(prefilledMessage)
      onPrefilledMessageUsed?.()
    }
  }, [isOpen, prefilledMessage, messages.length, isLoading, onPrefilledMessageUsed])

  const sendMessage = async (userMessage: string, isInitial = false) => {
    const newMessages = isInitial
      ? []
      : [...messages, { role: 'user' as const, content: userMessage }]

    if (!isInitial) {
      setMessages(newMessages)
      setInput('')
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      const data = await response.json()

      if (data.message) {
        setMessages([...newMessages, { role: 'assistant', content: data.message }])
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: "Looks like we're having some technical difficulties. Please try again in a moment.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      sendMessage(input.trim())
    }
  }

  if (!isOpen) return null

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        style={{
          background: '#0a0a0a',
          border: '1px solid #2a2a2a',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 60px rgba(200, 255, 0, 0.08)',
          height: '600px',
        }}
      >
        {/* Header */}
        <div
          className="p-5 flex items-center gap-4"
          style={{
            background: 'linear-gradient(135deg, #141414 0%, #1a1a1a 100%)',
            borderBottom: '1px solid #2a2a2a',
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-black"
            style={{ background: '#c8ff00', color: '#0a0a0a' }}
          >
            LNL
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-lg">LNL Fitness</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-gray-400">Online</span>
            </div>
          </div>
          {messages.length > 1 && (
            <button
              onClick={startNewConversation}
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Start new conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onToggle}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4" style={{ background: '#0a0a0a' }}>
          {messages.length === 0 && !isLoading && (
            <div className="flex items-center justify-center h-full text-gray-600 text-sm">
              Starting conversation...
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'
                }`}
                style={{
                  background: msg.role === 'user' ? '#1f1f1f' : '#c8ff00',
                  color: msg.role === 'user' ? '#ffffff' : '#0a0a0a',
                  fontWeight: msg.role === 'assistant' ? '500' : '400',
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="px-5 py-3 rounded-2xl rounded-bl-md" style={{ background: '#c8ff00' }}>
                <div className="flex gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: 'rgba(0,0,0,0.4)', animationDelay: '0ms' }}
                  ></span>
                  <span
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: 'rgba(0,0,0,0.4)', animationDelay: '150ms' }}
                  ></span>
                  <span
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: 'rgba(0,0,0,0.4)', animationDelay: '300ms' }}
                  ></span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSubmit}
          className="p-5"
          style={{
            background: '#141414',
            borderTop: '1px solid #2a2a2a',
          }}
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-5 py-4 rounded-xl outline-none text-sm transition-all focus:ring-2 focus:ring-accent"
              style={{
                background: '#1f1f1f',
                color: '#ffffff',
                border: '1px solid #2a2a2a',
              }}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-5 py-4 rounded-xl font-bold text-sm transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              style={{
                background: '#c8ff00',
                color: '#0a0a0a',
              }}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
