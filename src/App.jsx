import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ChatInterface from './components/ChatInterface'
import CyberBackground from './components/CyberBackground'
import { AIService } from './services/ai-service'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [messages, setMessages] = useState([])
  const [aiService] = useState(new AIService())
  const [isLoading, setIsLoading] = useState(false)

  // 初始化AI服务
  useEffect(() => {
    const initAIService = async () => {
      try {
        const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
        console.log('检测到的API密钥:', apiKey ? '已配置' : '未配置')
        if (apiKey && apiKey !== 'your_deepseek_api_key_here' && apiKey !== 'your_actual_deepseek_api_key_here') {
          await aiService.initialize('DEEPSEEK', apiKey)
          console.log('AI服务初始化成功')
        } else {
          console.warn('未找到有效的Deepseek API密钥，请检查.env文件配置')
          console.warn('当前环境变量:', import.meta.env)
        }
      } catch (error) {
        console.error('AI服务初始化失败:', error)
      }
    }

    initAIService()
  }, [aiService])

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

    console.log('发送到AI的消息历史:', messageHistory)
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
      
      const errorMessage = {
        role: 'assistant',
        content: '抱歉，AI服务暂时不可用。请检查API密钥配置或网络连接。',
        timestamp: new Date().toISOString()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <CyberBackground />
      <Sidebar 
        isOpen={sidebarOpen}
        onPromptSelect={handlePromptSelect}
      />
      
      <ChatInterface 
        messages={messages}
        onSendMessage={handleSendMessage}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isLoading={isLoading}
      />
    </div>
  )
}

export default App