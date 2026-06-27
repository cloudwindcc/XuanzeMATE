import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'

import { onRequestPost } from '../functions/api/chat.js'

const originalFetch = global.fetch

afterEach(() => {
  global.fetch = originalFetch
})

test('Kimi is the default provider and uses the server Moonshot key', async () => {
  let captured

  global.fetch = async (url, init) => {
    captured = {
      url: String(url),
      headers: init.headers,
      body: JSON.parse(init.body)
    }

    return new Response(JSON.stringify({
      choices: [
        {
          message: {
            content: 'Kimi answer'
          }
        }
      ]
    }))
  }

  const response = await onRequestPost({
    request: new Request('https://xuanzemate.pages.dev/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        apiKey: 'client-key-must-not-be-used',
        messages: [
          { role: 'user', content: 'Need a decision framework' }
        ],
        options: {
          maxTokens: 256,
          temperature: 0.1
        }
      })
    }),
    env: {
      DEFAULT_AI_PROVIDER: 'KIMI',
      MOONSHOT_API_KEY: 'server-moonshot-key'
    }
  })

  assert.equal(response.status, 200)
  assert.equal(captured.url, 'https://api.moonshot.ai/v1/chat/completions')
  assert.equal(captured.headers.Authorization, 'Bearer server-moonshot-key')
  assert.equal(captured.body.model, 'kimi-k2.7-code')
  assert.deepEqual(captured.body.messages.map(message => message.role), ['system', 'user'])
  assert.equal(captured.body.max_completion_tokens, 256)
  assert.equal(captured.body.max_tokens, undefined)
  assert.doesNotMatch(JSON.stringify(captured.body), /client-key-must-not-be-used/)

  const json = await response.json()
  assert.equal(json.provider, 'KIMI')
  assert.equal(json.content, 'Kimi answer')
})

test('Gemini requests use the server key and preserve conversation history', async () => {
  let captured

  global.fetch = async (url, init) => {
    captured = {
      url: String(url),
      body: JSON.parse(init.body)
    }

    return new Response(JSON.stringify({
      candidates: [
        {
          content: {
            parts: [{ text: 'Gemini answer' }]
          }
        }
      ]
    }))
  }

  const response = await onRequestPost({
    request: new Request('https://xuanzemate.pages.dev/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        provider: 'GEMINI',
        apiKey: 'client-key-must-not-be-used',
        messages: [
          { role: 'user', content: 'First question' },
          { role: 'assistant', content: 'First answer' },
          { role: 'user', content: 'Follow-up question' }
        ],
        options: {
          maxTokens: 333,
          temperature: 0.2
        }
      })
    }),
    env: {
      GEMINI_API_KEY: 'server-gemini-key'
    }
  })

  assert.equal(response.status, 200)
  assert.match(captured.url, /key=server-gemini-key/)
  assert.doesNotMatch(captured.url, /client-key-must-not-be-used/)
  assert.equal(captured.body.contents.length, 3)
  assert.deepEqual(captured.body.contents.map(message => message.role), ['user', 'model', 'user'])
  assert.equal(captured.body.generationConfig.maxOutputTokens, 333)

  const json = await response.json()
  assert.equal(json.content, 'Gemini answer')
})

test('DeepSeek requests use the server key and include a system prompt', async () => {
  let captured

  global.fetch = async (url, init) => {
    captured = {
      url: String(url),
      headers: init.headers,
      body: JSON.parse(init.body)
    }

    return new Response(JSON.stringify({
      choices: [
        {
          message: {
            content: 'DeepSeek answer'
          }
        }
      ]
    }))
  }

  const response = await onRequestPost({
    request: new Request('https://xuanzemate.pages.dev/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        provider: 'DEEPSEEK',
        apiKey: 'client-key-must-not-be-used',
        messages: [
          { role: 'user', content: 'Need a decision framework' }
        ]
      })
    }),
    env: {
      DEEPSEEK_API_KEY: 'server-deepseek-key'
    }
  })

  assert.equal(response.status, 200)
  assert.equal(captured.url, 'https://api.deepseek.com/v1/chat/completions')
  assert.equal(captured.headers.Authorization, 'Bearer server-deepseek-key')
  assert.deepEqual(captured.body.messages.map(message => message.role), ['system', 'user'])
  assert.doesNotMatch(JSON.stringify(captured.body), /client-key-must-not-be-used/)

  const json = await response.json()
  assert.equal(json.content, 'DeepSeek answer')
})
