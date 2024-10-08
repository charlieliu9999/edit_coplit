import React, { useState } from 'react'
import MenuBar from './components/MenuBar'
import TextEditor from './components/TextEditor'
import AiChat from './components/AiChat'

function App() {
  const [editorContent, setEditorContent] = useState('')

  const handleTextChange = (newContent: string) => {
    setEditorContent(newContent)
  }

  const handleAiGenerate = (generatedText: string) => {
    setEditorContent(prevContent => prevContent + '\n' + generatedText)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <MenuBar />
      <div className="flex-1 flex">
        <TextEditor content={editorContent} onTextChange={handleTextChange} />
        <AiChat onGenerate={handleAiGenerate} />
      </div>
    </div>
  )
}

export default App