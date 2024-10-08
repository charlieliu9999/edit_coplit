import React, { useRef, useState } from 'react'
import { Save, FolderOpen, Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import mammoth from 'mammoth'
import { marked } from 'marked'
import * as XLSX from 'xlsx'
import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface TextEditorProps {
  content: string
  onTextChange: (newContent: string) => void
}

const TextEditor: React.FC<TextEditorProps> = ({ content, onTextChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileType, setFileType] = useState<string | null>(null)
  const [pdfFile, setPdfFile] = useState<string | null>(null)

  const handleFileOpen = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      setFileType(fileExtension || null)

      switch (fileExtension) {
        case 'txt':
          handleTxtFile(file)
          break
        case 'md':
          handleMarkdownFile(file)
          break
        case 'docx':
          handleDocxFile(file)
          break
        case 'xlsx':
        case 'xls':
          handleExcelFile(file)
          break
        case 'pdf':
          handlePdfFile(file)
          break
        default:
          alert('Unsupported file format')
      }
    }
  }

  const handleTxtFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result
      if (typeof text === 'string') {
        // Replace newlines with <br> tags for correct display
        onTextChange(text.replace(/\n/g, '<br>'))
      }
    }
    reader.readAsText(file)
  }

  const handleMarkdownFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result
      if (typeof text === 'string') {
        // Use marked to convert Markdown to HTML, which will handle line breaks correctly
        const html = marked(text)
        onTextChange(html)
      }
    }
    reader.readAsText(file)
  }

  const handleDocxFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result
      if (arrayBuffer instanceof ArrayBuffer) {
        const result = await mammoth.convertToHtml({ arrayBuffer })
        onTextChange(result.value)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleExcelFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const html = XLSX.utils.sheet_to_html(worksheet)
      onTextChange(html)
    }
    reader.readAsArrayBuffer(file)
  }

  const handlePdfFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const pdfData = e.target?.result
      if (typeof pdfData === 'string') {
        setPdfFile(pdfData)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    let contentToSave = content
    if (fileType === 'txt') {
      // Remove <br> tags and replace with newlines for saving
      contentToSave = content.replace(/<br\s*\/?>/gi, '\n')
    }
    const blob = new Blob([contentToSave], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'document.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleFormat = (command: string) => {
    document.execCommand(command, false)
  }

  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="mb-2 flex space-x-2">
        <button onClick={handleFileOpen} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
          <FolderOpen size={20} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".txt,.md,.docx,.xlsx,.xls,.pdf"
        />
        <button onClick={handleSave} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
          <Save size={20} />
        </button>
        <button onClick={() => handleFormat('bold')} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
          <Bold size={20} />
        </button>
        <button onClick={() => handleFormat('italic')} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
          <Italic size={20} />
        </button>
        <button onClick={() => handleFormat('underline')} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
          <Underline size={20} />
        </button>
        <button onClick={() => handleFormat('insertUnorderedList')} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
          <List size={20} />
        </button>
        <button onClick={() => handleFormat('justifyLeft')} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
          <AlignLeft size={20} />
        </button>
        <button onClick={() => handleFormat('justifyCenter')} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
          <AlignCenter size={20} />
        </button>
        <button onClick={() => handleFormat('justifyRight')} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
          <AlignRight size={20} />
        </button>
      </div>
      <div className="flex-1 relative">
        {fileType === 'pdf' && pdfFile ? (
          <Document file={pdfFile}>
            <Page pageNumber={1} />
          </Document>
        ) : (
          <div
            className="absolute inset-0 p-2 border border-gray-300 rounded overflow-auto whitespace-pre-wrap"
            contentEditable={fileType !== 'pdf'}
            dangerouslySetInnerHTML={{ __html: content }}
            onInput={(e) => onTextChange(e.currentTarget.innerHTML)}
          />
        )}
      </div>
    </div>
  )
}

export default TextEditor