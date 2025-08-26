import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('zh')
  const [isDetecting, setIsDetecting] = useState(true)

  useEffect(() => {
    // 检查本地存储是否有语言设置
    const savedLanguage = localStorage.getItem('xuanzemate-language')
    if (savedLanguage) {
      setLanguage(savedLanguage)
      setIsDetecting(false)
    } else {
      // 自动检测语言基于IP地址
      detectLanguageByIP()
    }
  }, [])

  const detectLanguageByIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()
      
      // 如果IP不在中国大陆，默认使用英文
      if (data.country_code !== 'CN') {
        setLanguage('en')
      }
    } catch (error) {
      console.log('IP检测失败，使用默认中文:', error)
      // 失败时使用中文
      setLanguage('zh')
    } finally {
      setIsDetecting(false)
    }
  }

  const toggleLanguage = () => {
    const newLanguage = language === 'zh' ? 'en' : 'zh'
    setLanguage(newLanguage)
    localStorage.setItem('xuanzemate-language', newLanguage)
  }

  const value = {
    language,
    toggleLanguage,
    isDetecting
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}