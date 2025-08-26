import React, { useState, useRef, useEffect } from 'react'
import FormattedMessage from './FormattedMessage'
import ChatParticles from './ChatParticles'
import './ChatInterface.css'

const ChatInterface = ({ messages, onSendMessage, onToggleSidebar, isLoading, currentModel, onModelChange }) => {
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim())
      setInputMessage('')
    }
  }

  return (
    <div className="chat-interface">
      <ChatParticles />
      <div className="chat-header">
        <div className="chat-header-left">
          <button className="sidebar-toggle" onClick={onToggleSidebar}>
            ☰
          </button>
          <div className="logo-container">
            <img src="/assets/daxuanze-main.png" alt="XuanzeMATE Logo" className="header-logo" />
            <h2>XuanzeMATE</h2>
          </div>
          <span className="subtitle">您的人生决策伙伴</span>
        </div>
        
        <div className="chat-header-right">
          <div className="model-selector">
            <select 
              value={currentModel} 
              onChange={(e) => onModelChange(e.target.value)}
              disabled={isLoading}
            >
              <option value="DEEPSEEK">Deepseek</option>
              <option value="GEMINI">Gemini</option>
            </select>
          </div>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <div className="welcome-icon">🤖</div>
            <h3>欢迎使用 XuanzeMATE</h3>
            <p>我是您的人生决策AI伙伴，可以帮助您分析各种人生选择</p>
            <p>请从左侧选择主题开始对话，或直接输入您的问题</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="message-content">
                <FormattedMessage 
                  content={message.content} 
                  role={message.role}
                />
              </div>
              <div className="message-time">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="input-container" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isLoading ? "AI正在思考中..." : "输入您的问题..."}
            className="message-input"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={isLoading || !inputMessage.trim()}
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatInterface