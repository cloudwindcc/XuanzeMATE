import React, { useRef, useEffect } from 'react'
import './ChatParticles.css'

const ChatParticles = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    
    // 交互状态
    const mouse = {
      x: 0,
      y: 0,
      isActive: false
    }
    
    // 鼠标事件监听
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.isActive = true
    }
    
    const handleMouseLeave = () => {
      mouse.isActive = false
    }
    
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const particles = []
    const gridSize = 120 // 增加网格间距，减少密度（稀疏一倍）
    const gridPoints = []
    const sidebarWidth = 320 // 侧边栏宽度，用于排除特效区域

    // 创建网格点 - 优化为稀疏的网络节点
    for (let x = 0; x <= canvas.width; x += gridSize) {
      for (let y = 0; y <= canvas.height; y += gridSize) {
        gridPoints.push({ 
          x, 
          y, 
          originX: x, 
          originY: y,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          hue: Math.random() * 60 + 200 // 蓝色主题：200-260度
        })
      }
    }

    // 创建光子粒子 - 优化性能，减少到40个粒子
    for (let i = 0; i < 40; i++) {
      const type = Math.random() > 0.7 ? 'photon' : 'normal'
      const baseHue = Math.random() * 60 + 200 // 蓝色主题：200-260度
      
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: type === 'photon' ? Math.random() * 3 + 2 : Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * (type === 'photon' ? 2.5 : 1.2),
        speedY: (Math.random() - 0.5) * (type === 'photon' ? 2.5 : 1.2),
        color: `hsl(${baseHue}, 90%, 70%)`,
        alpha: type === 'photon' ? Math.random() * 0.6 + 0.4 : Math.random() * 0.4 + 0.2,
        trail: [],
        type: type,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.02
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 绘制深色渐变背景 - 排除侧边栏区域
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, 
        canvas.height / 2, 
        0,
        canvas.width / 2, 
        canvas.height / 2, 
        Math.max(canvas.width, canvas.height)
      )
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.8)')
      gradient.addColorStop(1, 'rgba(10, 10, 20, 0.9)')
      ctx.fillStyle = gradient
      
      // 只绘制聊天区域，排除侧边栏
      ctx.fillRect(sidebarWidth, 0, canvas.width - sidebarWidth, canvas.height)

      // 更新网格点脉冲效果
      gridPoints.forEach(point => {
        point.pulse += point.pulseSpeed
        const pulseValue = Math.sin(point.pulse) * 3
        point.x = point.originX + pulseValue
        point.y = point.originY + pulseValue
      })

      // 绘制动态粒子带轨迹 - 排除侧边栏区域
      particles.forEach(particle => {
        // 排除侧边栏区域的粒子
        if (particle.x >= sidebarWidth) {
          // 绘制粒子轨迹
          if (particle.trail.length > 0) {
            ctx.strokeStyle = particle.color
            ctx.globalAlpha = 0.1
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particle.trail[0].x, particle.trail[0].y)
            for (let i = 1; i < particle.trail.length; i++) {
              ctx.lineTo(particle.trail[i].x, particle.trail[i].y)
            }
            ctx.stroke()
            ctx.globalAlpha = 1
          }

          // 绘制粒子 - 光子效果
          if (particle.type === 'photon') {
            // 光子发光效果
            particle.pulse += particle.pulseSpeed
            const glowSize = particle.size * (Math.sin(particle.pulse) * 0.3 + 1.2)
            const glowAlpha = particle.alpha * (Math.sin(particle.pulse) * 0.2 + 0.8)
            
            // 发光光晕
            const gradient = ctx.createRadialGradient(
              particle.x, particle.y, 0,
              particle.x, particle.y, glowSize * 3
            )
            gradient.addColorStop(0, particle.color.replace('hsl', 'hsla').replace(')', ', 0.8)'))
            gradient.addColorStop(1, particle.color.replace('hsl', 'hsla').replace(')', ', 0)'))
            
            ctx.fillStyle = gradient
            ctx.globalAlpha = glowAlpha * 0.6
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, glowSize * 3, 0, Math.PI * 2)
            ctx.fill()
          }
          
          // 绘制粒子主体
          ctx.fillStyle = particle.color
          ctx.globalAlpha = particle.alpha
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1

          // 更新轨迹
          particle.trail.push({ x: particle.x, y: particle.y })
          if (particle.trail.length > 10) {
            particle.trail.shift()
          }

          // 更新位置
          particle.x += particle.speedX
          particle.y += particle.speedY

          // 边界检查并反弹
          if (particle.x < 0 || particle.x > canvas.width) {
            particle.speedX *= -1
            particle.trail = [] // 清除轨迹
          }
          if (particle.y < 0 || particle.y > canvas.height) {
            particle.speedY *= -1
            particle.trail = [] // 清除轨迹
          }
        }
      })

      // 绘制交互式粒子连接线
      particles.forEach((particle, index) => {
        // 排除侧边栏区域的粒子
        if (particle.x >= sidebarWidth) {
          // 绘制与其他粒子的连接线
          for (let j = index + 1; j < particles.length; j++) {
            const otherParticle = particles[j]
            if (otherParticle.x >= sidebarWidth) {
              const dist = Math.sqrt(
                Math.pow(particle.x - otherParticle.x, 2) + 
                Math.pow(particle.y - otherParticle.y, 2)
              )
              
              // 近距离粒子之间绘制连接线
              if (dist < 100) {
                const alpha = 1 - (dist / 100) * 0.8
                const gradient = ctx.createLinearGradient(
                  particle.x, particle.y, 
                  otherParticle.x, otherParticle.y
                )
                gradient.addColorStop(0, `hsla(${particle.color.match(/hsl\((\d+)/)[1]}, 80%, 60%, ${alpha * 0.4})`)
                gradient.addColorStop(1, `hsla(${otherParticle.color.match(/hsl\((\d+)/)[1]}, 80%, 60%, ${alpha * 0.4})`)
                
                ctx.strokeStyle = gradient
                ctx.lineWidth = 1 * alpha
                ctx.globalAlpha = alpha * 0.3
                ctx.beginPath()
                ctx.moveTo(particle.x, particle.y)
                ctx.lineTo(otherParticle.x, otherParticle.y)
                ctx.stroke()
                ctx.globalAlpha = 1
              }
            }
          }
          
          // 鼠标交互效果
          if (mouse.isActive) {
            const mouseDist = Math.sqrt(
              Math.pow(particle.x - mouse.x, 2) + 
              Math.pow(particle.y - mouse.y, 2)
            )
            
            // 鼠标靠近时绘制连接线
            if (mouseDist < 120) {
              const alpha = 1 - (mouseDist / 120)
              const gradient = ctx.createLinearGradient(particle.x, particle.y, mouse.x, mouse.y)
              gradient.addColorStop(0, `hsla(${particle.color.match(/hsl\((\d+)/)[1]}, 90%, 70%, ${alpha * 0.6})`)
              gradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)')
              
              ctx.strokeStyle = gradient
              ctx.lineWidth = 1.5 * alpha
              ctx.globalAlpha = alpha * 0.5
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(mouse.x, mouse.y)
              ctx.stroke()
              ctx.globalAlpha = 1
              
              // 鼠标靠近时粒子变大并加速
              if (mouseDist < 80) {
                particle.size = Math.min(particle.size + 0.2, 6)
                const repelForce = 0.5 * (1 - mouseDist / 80)
                const angle = Math.atan2(particle.y - mouse.y, particle.x - mouse.x)
                particle.speedX += Math.cos(angle) * repelForce
                particle.speedY += Math.sin(angle) * repelForce
              }
            }
          }
        }
      })

      // 绘制彩色网络节点 - 排除侧边栏区域
      gridPoints.forEach(point => {
        // 排除侧边栏区域的节点
        if (point.x >= sidebarWidth) {
          const pulse = Math.sin(point.pulse) * 0.3 + 0.7
          ctx.fillStyle = `hsla(${point.hue}, 80%, 60%, ${pulse * 0.6})`
          ctx.beginPath()
          ctx.arc(point.x, point.y, 2 * pulse, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // 随机生成能量光束效果 - 排除侧边栏区域
      if (Math.random() < 0.02) {
        const startX = Math.random() * (canvas.width - sidebarWidth) + sidebarWidth
        const startY = Math.random() * canvas.height
        const endX = Math.random() * (canvas.width - sidebarWidth) + sidebarWidth
        const endY = Math.random() * canvas.height
        
        const gradient = ctx.createLinearGradient(startX, startY, endX, endY)
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)')
        gradient.addColorStop(1, 'rgba(37, 99, 235, 0.4)')
        
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1
        ctx.globalAlpha = 0.4
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
        ctx.globalAlpha = 1
      }
      // 绘制鼠标光标效果
      if (mouse.isActive) {
        // 光标外圈
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)'
        ctx.lineWidth = 1
        ctx.globalAlpha = 0.8
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 15, 0, Math.PI * 2)
        ctx.stroke()
        
        // 光标内点
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 2, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.globalAlpha = 1
      }
      
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="chat-particles" />
}

export default ChatParticles