// 测试环境变量加载
console.log('测试环境变量加载...')

// 模拟Vite的环境变量处理
import fs from 'fs'
import path from 'path'

// 读取.env文件
const envPath = path.join(process.cwd(), '.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  const envLines = envContent.split('\n')
  
  const envVars = {}
  envLines.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, value] = line.split('=')
      if (key && value) {
        envVars[key.trim()] = value.trim()
      }
    }
  })
  
  console.log('从.env文件读取的变量:')
  console.log('VITE_DEEPSEEK_API_KEY:', envVars.VITE_DEEPSEEK_API_KEY)
  console.log('VITE_GEMINI_API_KEY:', envVars.VITE_GEMINI_API_KEY)
  console.log('VITE_DEFAULT_AI_PROVIDER:', envVars.VITE_DEFAULT_AI_PROVIDER)
} else {
  console.log('.env文件不存在')
}