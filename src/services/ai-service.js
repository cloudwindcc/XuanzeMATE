const AI_PROVIDERS = {
  GEMINI: {
    name: 'Google Gemini',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/models',
    models: {
      PRO: 'gemini-pro',
      PRO_VISION: 'gemini-pro-vision'
    },
    headers: {
      'Content-Type': 'application/json'
    }
  },
  DEEPSEEK: {
    name: 'Deepseek',
    baseURL: 'https://api.deepseek.com/v1',
    models: {
      CHAT: 'deepseek-chat',
      CODER: 'deepseek-coder'
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }
}

export class AIService {
  constructor() {
    this.currentProvider = null
    this.apiKey = null
  }

  async initialize(providerType, apiKey) {
    this.currentProvider = AI_PROVIDERS[providerType]
    this.apiKey = apiKey
  }

  async sendMessage(messages, options = {}) {
    if (!this.currentProvider || !this.apiKey) {
      throw new Error('AI服务未配置')
    }

    // 添加格式要求到系统提示
    const formattedMessages = [
      {
        role: 'system',
        content: '请使用Markdown格式回复，包括标题、列表、粗体、表格等来组织内容，使回答更加结构化和易读。保持专业且友好的语气。'
      },
      ...messages
    ]

    switch (this.currentProvider) {
      case AI_PROVIDERS.GEMINI:
        return this.callGeminiAPI(formattedMessages, options)
      case AI_PROVIDERS.DEEPSEEK:
        return this.callDeepseekAPI(formattedMessages, options)
      default:
        throw new Error('未配置AI提供商')
    }
  }

  async callGeminiAPI(messages, options) {
    const model = options.model || AI_PROVIDERS.GEMINI.models.PRO
    const url = `${AI_PROVIDERS.GEMINI.baseURL}/${model}:generateContent?key=${this.apiKey}`

    const response = await fetch(url, {
      method: 'POST',
      headers: AI_PROVIDERS.GEMINI.headers,
      body: JSON.stringify({
        contents: messages.map(msg => ({
          parts: [{ text: msg.content }],
          role: msg.role === 'user' ? 'user' : 'model'
        })),
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxTokens || 2048
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API错误: ${response.status}`)
    }

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
  }

  async callDeepseekAPI(messages, options) {
    const model = options.model || AI_PROVIDERS.DEEPSEEK.models.CHAT
    const url = `${AI_PROVIDERS.DEEPSEEK.baseURL}/chat/completions`

    try {
      // 转换消息格式为Deepseek要求的格式
      const formattedMessages = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))

      console.log('发送到Deepseek的消息:', formattedMessages)
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...AI_PROVIDERS.DEEPSEEK.headers,
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: formattedMessages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2048,
          stream: options.stream || false
        })
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Deepseek API错误详情:', response.status, errorData)
        throw new Error(`Deepseek API错误: ${response.status} - ${errorData}`)
      }

      const data = await response.json()
      console.log('Deepseek API响应:', data)
      return data.choices[0].message.content
    } catch (error) {
      console.error('Deepseek API调用失败:', error)
      throw error
    }
  }

  switchProvider(providerType, apiKey) {
    this.currentProvider = AI_PROVIDERS[providerType]
    this.apiKey = apiKey
  }

  getAvailableProviders() {
    return Object.keys(AI_PROVIDERS)
  }
}

export const APIRetry = {
  async withRetry(apiCall, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall()
      } catch (error) {
        if (attempt === maxRetries) throw error
        await new Promise(resolve => setTimeout(resolve, delay * attempt))
      }
    }
  }
}