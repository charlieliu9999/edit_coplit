import React, { useState } from 'react'
import { Send, PlusCircle } from 'lucide-react'

interface Message {
  role: 'user' | 'ai'
  content: string
}

interface AiChatProps {
  onGenerate: (generatedText: string) => void
}

const AiChat: React.FC<AiChatProps> = ({ onGenerate }) => {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newUserMessage: Message = { role: 'user', content: input }
    setMessages(prevMessages => [...prevMessages, newUserMessage])

    // Simulating AI response (replace with actual AI integration)
    const aiResponse = `AI: I understand you said "${input}". How can I help you with that?`
    const newAiMessage: Message = { role: 'ai', content: aiResponse }
    setMessages(prevMessages => [...prevMessages, newAiMessage])

    setInput('')
  }

  const handleGenerate = () => {
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()
    if (lastUserMessage) {
      const generatedText = `Generated text based on: "${lastUserMessage.content}"`
      onGenerate(generatedText)
    }
  }

  return (
    <div className="w-1/3 bg-white p-4 border-l border-gray-300 flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4">AI Chat</h2>
      <div className="flex-1 overflow-y-auto mb-4 border border-gray-200 rounded p-2">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              {message.content}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Chat with AI..."
          rows={3}
        />
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center"
          >
            <Send className="mr-2" size={18} />
            Send
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center justify-center"
          >
            <PlusCircle className="mr-2" size={18} />
            Generate Text
          </button>
        </div>
      </form>
    </div>
  )
}

export default AiChat