'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send initial greeting when chat opens for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      sendMessage('', true)
    }
  }, [isOpen])

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
          content: "Yo, looks like we're having some technical difficulties. Hit that Book Now button above to connect with Jay directly!",
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

  return (
    <>
      {/* Floating Chat Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center z-50 transition-all duration-300 hover:scale-110 glow-accent"
        style={{
          background: 'linear-gradient(135deg, #c8ff00 0%, #a8e600 100%)',
        }}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-28 right-6 w-[380px] max-w-[calc(100vw-48px)] h-[550px] max-h-[calc(100vh-160px)] rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden animate-slideUp"
          style={{
            background: '#0a0a0a',
            border: '1px solid #2a2a2a',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(200, 255, 0, 0.1)',
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
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black"
              style={{ background: '#c8ff00', color: '#0a0a0a' }}
            >
              J
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg">Coach Jay's Assistant</h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs text-gray-400">Online — Let's get it</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ background: '#0a0a0a' }}>
            {messages.length === 0 && !isLoading && (
              <div className="flex items-center justify-center h-full text-gray-600 text-sm">
                Starting conversation...
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
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
              <div className="flex justify-start animate-slideUp">
                <div className="px-4 py-3 rounded-2xl rounded-bl-md" style={{ background: '#c8ff00' }}>
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

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className="p-4"
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
                className="flex-1 px-4 py-3 rounded-xl outline-none text-sm transition-all focus:ring-2 focus:ring-accent"
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
                className="px-5 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                style={{
                  background: '#c8ff00',
                  color: '#0a0a0a',
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>

            {/* Quick Action */}
            <div className="mt-3 text-center">
              <a
                href="#book"
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-500 hover:text-accent transition-colors"
              >
                Or skip chat and <span className="underline">book directly →</span>
              </a>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
