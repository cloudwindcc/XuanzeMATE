const AI_PROVIDERS = ['GEMINI', 'DEEPSEEK']

export class AIService {
  constructor() {
    this.currentProvider = 'GEMINI'
  }

  initialize(providerType = 'GEMINI') {
    this.currentProvider = this.normalizeProvider(providerType)
  }

  async sendMessage(messages, options = {}) {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        provider: this.currentProvider,
        messages,
        options
      })
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(data.error || `AI服务请求失败: ${response.status}`)
    }

    return data.content
  }

  switchProvider(providerType) {
    this.currentProvider = this.normalizeProvider(providerType)
  }

  normalizeProvider(providerType) {
    const provider = String(providerType || '').toUpperCase()
    return AI_PROVIDERS.includes(provider) ? provider : 'GEMINI'
  }

  getAvailableProviders() {
    return AI_PROVIDERS
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
