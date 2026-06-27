import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ChatInterface from './components/ChatInterface'
import CyberBackground from './components/CyberBackground'
import { AIService } from './services/ai-service'
import { useLanguage } from './contexts/LanguageContext'
import { translations } from './data/translations'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [messages, setMessages] = useState([])
  const [aiService] = useState(new AIService())
  const [isLoading, setIsLoading] = useState(false)
  const [currentModel, setCurrentModel] = useState('GEMINI')
  const { language } = useLanguage()
  const t = translations[language]

  // 初始化AI服务提供商。API密钥只在Cloudflare Pages Function中读取。
  useEffect(() => {
    aiService.initialize(currentModel)
  }, [aiService, currentModel])

  const handlePromptSelect = async (prompt) => {
    const userMessage = {
      role: 'user',
      content: prompt,
      timestamp: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, userMessage])
    await sendToAI([...messages, userMessage])
  }

  const handleSendMessage = async (message) => {
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, userMessage])
    await sendToAI([...messages, userMessage])
  }

  const sendToAI = async (messageHistory) => {
    setIsLoading(true)
    
    try {
      const response = await aiService.sendMessage(messageHistory, {
        temperature: 0.7,
        maxTokens: 1024
      })
      
      const aiMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('AI请求失败:', error.message)
      
      let errorContent = t.errorGeneric
      
      if (error.message.includes('超时') || error.name === 'AbortError') {
        errorContent = t.errorTimeout
      } else if (error.message.includes('API key') || error.message.includes('API密钥') || error.message.includes('401') || error.message.includes('403')) {
        errorContent = t.errorApiKey
      } else if (error.message.includes('网络')) {
        errorContent = t.errorNetwork
      }
      
      const errorMessage = {
        role: 'assistant',
        content: errorContent,
        timestamp: new Date().toISOString()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleModelChange = async (model) => {
    // 清除之前的对话历史，避免模型混淆
    setMessages([])
    setCurrentModel(model)
    aiService.switchProvider(model)
  }

  return (
    <div className="app">
      <CyberBackground />
      <Sidebar 
        isOpen={sidebarOpen}
        onPromptSelect={handlePromptSelect}
      />
      
      {/* 移动端遮罩层 */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      
      <ChatInterface 
        messages={messages}
        onSendMessage={handleSendMessage}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isLoading={isLoading}
        currentModel={currentModel}
        onModelChange={handleModelChange}
      />
    </div>
  )
}

export default App
