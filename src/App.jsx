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
  const [currentModel, setCurrentModel] = useState(import.meta.env.VITE_DEFAULT_AI_PROVIDER || 'GEMINI')
  const { language } = useLanguage()
  const t = translations[language]

  // 初始化AI服务
  useEffect(() => {
    const initAIService = async () => {
      try {
        const apiKey = import.meta.env[currentModel === 'DEEPSEEK' ? 'VITE_DEEPSEEK_API_KEY' : 'VITE_GEMINI_API_KEY']
        console.log('检测到的API密钥:', apiKey ? '已配置' : '未配置')
        console.log(`${currentModel} API密钥值:`, apiKey)
        if (apiKey && apiKey !== 'your_deepseek_api_key_here' && apiKey !== 'your_actual_deepseek_api_key_here' && apiKey !== 'your_gemini_api_key_here') {
          await aiService.initialize(currentModel, apiKey)
          console.log('AI服务初始化成功')
        } else {
          console.warn(`未找到有效的${currentModel} API密钥，请检查.env文件配置`)
          console.warn(`当前${currentModel} API密钥:`, apiKey)
        }
      } catch (error) {
        console.error('AI服务初始化失败:', error)
      }
    }

    initAIService()
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
    if (!aiService.apiKey) {
      console.error('AI服务未正确配置')
      return
    }

    // console.log('发送到AI的消息历史:', messageHistory)
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
      console.error('AI请求失败:', error)
      
      let errorContent = t.errorGeneric
      
      if (error.message.includes('超时') || error.name === 'AbortError') {
        errorContent = t.errorTimeout
      } else if (error.message.includes('API密钥') || error.message.includes('401') || error.message.includes('403')) {
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
    const apiKey = import.meta.env[model === 'DEEPSEEK' ? 'VITE_DEEPSEEK_API_KEY' : 'VITE_GEMINI_API_KEY']
    console.log(`${model} API密钥:`, apiKey)
    if (apiKey && apiKey !== 'your_deepseek_api_key_here' && apiKey !== 'your_actual_deepseek_api_key_here' && apiKey !== 'your_gemini_api_key_here') {
      await aiService.switchProvider(model, apiKey)
      console.log(`已切换到 ${model} 模型`)
    } else {
      console.warn(`未找到有效的${model} API密钥，请检查.env文件配置`)
      console.warn(`当前${model} API密钥:`, apiKey)
    }
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