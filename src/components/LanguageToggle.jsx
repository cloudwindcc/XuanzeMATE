import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../data/translations'

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage()
  const t = translations[language]

  return (
    <button 
      onClick={toggleLanguage}
      className="language-toggle"
      title={language === 'zh' ? t.switchToEnglish : t.switchToChinese}
    >
      {t.language}
    </button>
  )
}

export default LanguageToggle