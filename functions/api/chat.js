const SYSTEM_PROMPT = '请使用Markdown格式回复，包括标题、列表、粗体、表格等来组织内容，使回答更加结构化和易读。保持专业且友好的语气。'

const PROVIDERS = {
  KIMI: {
    defaultModel: 'kimi-k2.7-code',
    baseURL: 'https://api.moonshot.cn/v1',
    envKeys: ['MOONSHOT_API_KEY', 'KIMI_API_KEY']
  },
  GEMINI: {
    defaultModel: 'gemini-2.5-pro',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/models',
    envKeys: ['GEMINI_API_KEY', 'VITE_GEMINI_API_KEY']
  },
  DEEPSEEK: {
    defaultModel: 'deepseek-chat',
    baseURL: 'https://api.deepseek.com/v1',
    envKeys: ['DEEPSEEK_API_KEY', 'VITE_DEEPSEEK_API_KEY']
  }
}

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8'
}

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: jsonHeaders })
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json()
    const providerType = normalizeProvider(body.provider || env.DEFAULT_AI_PROVIDER || env.VITE_DEFAULT_AI_PROVIDER || 'KIMI')
    const provider = getProviderConfig(providerType, env)
    const messages = normalizeMessages(body.messages)
    const options = normalizeOptions(body.options)

    if (!provider.apiKey) {
      return jsonResponse({ error: `${providerType} API key is not configured on the server.` }, 500)
    }

    const content = providerType === 'GEMINI'
      ? await callGemini(provider, messages, options)
      : await callChatCompletions(provider, messages, options, providerType)

    return jsonResponse({
      content,
      provider: providerType,
      model: options.model || provider.defaultModel
    })
  } catch (error) {
    const status = error.status || 500
    return jsonResponse({ error: error.message || 'AI request failed.' }, status)
  }
}

function normalizeProvider(provider) {
  const providerType = String(provider || '').trim().toUpperCase()
  if (!PROVIDERS[providerType]) {
    throw httpError(`Unsupported AI provider: ${provider || 'unknown'}`, 400)
  }
  return providerType
}

function getProviderConfig(providerType, env = {}) {
  const provider = PROVIDERS[providerType]
  const apiKey = provider.envKeys.map(key => env[key]).find(Boolean)
  return { ...provider, apiKey }
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw httpError('messages must be a non-empty array.', 400)
  }

  return messages
    .filter(message => message && ['user', 'assistant'].includes(message.role))
    .map(message => ({
      role: message.role,
      content: String(message.content || '').trim()
    }))
    .filter(message => message.content.length > 0)
}

function normalizeOptions(options = {}) {
  return {
    model: typeof options.model === 'string' ? options.model : undefined,
    temperature: clampNumber(options.temperature, 0, 2, 0.7),
    maxTokens: clampNumber(options.maxTokens, 1, 8192, 2048)
  }
}

async function callGemini(provider, messages, options) {
  const model = options.model || provider.defaultModel
  const url = `${provider.baseURL}/${model}:generateContent?key=${encodeURIComponent(provider.apiKey)}`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      contents: messages.map(message => ({
        role: message.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: message.content }]
      })),
      generationConfig: {
        temperature: options.temperature,
        maxOutputTokens: options.maxTokens
      }
    })
  })

  if (!response.ok) {
    throw httpError(await safeErrorMessage(response, 'Gemini API request failed.'), response.status)
  }

  const data = await response.json()
  const content = data?.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim()
  if (!content) {
    throw httpError('Gemini API returned an empty response.', 502)
  }
  return content
}

async function callChatCompletions(provider, messages, options, providerType) {
  const model = options.model || provider.defaultModel
  const tokenLimitKey = providerType === 'KIMI' ? 'max_completion_tokens' : 'max_tokens'
  const response = await fetch(`${provider.baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${provider.apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: options.temperature,
      [tokenLimitKey]: options.maxTokens,
      stream: false
    })
  })

  if (!response.ok) {
    throw httpError(await safeErrorMessage(response, `${providerType} API request failed.`), response.status)
  }

  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content?.trim()
  if (!content) {
    throw httpError(`${providerType} API returned an empty response.`, 502)
  }
  return content
}

async function safeErrorMessage(response, fallback) {
  try {
    const text = await response.text()
    return text ? `${fallback} ${text}` : fallback
  } catch {
    return fallback
  }
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value)
  if (!Number.isFinite(number)) return fallback
  return Math.min(Math.max(number, min), max)
}

function httpError(message, status) {
  const error = new Error(message)
  error.status = status
  return error
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders
  })
}
