import React, { useState } from 'react'
import { LIFE_CHOICE_TEMPLATES } from '../data/prompt-templates'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../data/translations'
import './Sidebar.css'

const Sidebar = ({ isOpen, onPromptSelect }) => {
  const categories = Object.values(LIFE_CHOICE_TEMPLATES)
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h3>{t.sidebarTitle}</h3>
        <p>{t.sidebarSubtitle}</p>
      </div>
      
      <div className="categories-list">
        {categories.map(category => (
          <CategoryItem
            key={category.id}
            category={category}
            onPromptSelect={onPromptSelect}
          />
        ))}
      </div>
    </div>
  )
}

const CategoryItem = ({ category, onPromptSelect }) => {
  const [expanded, setExpanded] = useState(false)
  const { language } = useLanguage()

  return (
    <div className="category-item">
      <div 
        className="category-header"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="category-icon">{category.icon}</span>
        <span className="category-title">{language === 'en' ? category.title_en : category.title}</span>
        <span className="expand-icon">{expanded ? '▼' : '►'}</span>
      </div>
      
      {expanded && (
        <div className="prompts-list">
          {(language === 'en' ? category.prompts_en : category.prompts).map((prompt, index) => (
            <div
              key={index}
              className="prompt-item"
              onClick={() => onPromptSelect(prompt)}
            >
              {prompt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Sidebar