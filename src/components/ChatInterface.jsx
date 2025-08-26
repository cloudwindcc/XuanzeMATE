import React, { useState, useRef, useEffect } from 'react'
import FormattedMessage from './FormattedMessage'
import ChatParticles from './ChatParticles'
import LanguageToggle from './LanguageToggle'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../data/translations'
import './ChatInterface.css'

const ChatInterface = ({ messages, onSendMessage, onToggleSidebar, isLoading, currentModel, onModelChange }) => {
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef(null)
  const { language } = useLanguage()
  const t = translations[language]

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
            <div className="pantheon-logo">⚡</div>
            <h2>XuanzeMATE</h2>
          </div>
          <span className="subtitle">{language === 'zh' ? '您的人生决策伙伴' : 'Your Life Decision Partner'}</span>
        </div>
        
        <div className="chat-header-right">
          <div className="model-selector">
            <select 
              value={currentModel} 
              onChange={(e) => onModelChange(e.target.value)}
              disabled={isLoading}
            >
              <option value="DEEPSEEK">{t.deepseek}</option>
              <option value="GEMINI">{t.gemini}</option>
            </select>
          </div>
          <LanguageToggle />
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <div className="welcome-icon">🤖</div>
            <h3>{t.welcomeTitle}</h3>
            <p>{t.welcomeDescription1}</p>
            <p>{t.welcomeDescription2}</p>
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
            placeholder={isLoading ? t.inputPlaceholderLoading : t.inputPlaceholder}
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