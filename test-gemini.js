// 简单的Gemini API测试脚本
const API_KEY = 'AIzaSyA1I5A8KccLqtd9T9hIWLj5wIXYkNofY2w'
const MODEL = 'gemini-1.5-flash-latest'
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`

async function testGeminiAPI() {
  try {
    console.log('测试Gemini API密钥...')
    console.log('API密钥:', API_KEY)
    console.log('请求URL:', URL)
    
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: 'Hello' }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 100
        }
      })
    })
    
    console.log('响应状态:', response.status)
    
    if (!response.ok) {
      const errorData = await response.text()
      console.log('错误响应:', errorData)
    } else {
      const data = await response.json()
      console.log('成功响应:', JSON.stringify(data, null, 2))
    }
    
  } catch (error) {
    console.error('测试失败:', error)
  }
}

testGeminiAPI()